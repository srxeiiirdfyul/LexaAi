import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage, ChatMessageRole, UserTier } from '../types';
import { generateResponse } from '../services/geminiService';
import Message from './Message';
import { SendIcon, PaperClipIcon, XCircleIcon } from './icons';

interface ChatInterfaceProps {
  user: User;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, messages, setMessages }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const canUpload = user.isLoggedIn;
  const maxFiles = user.tier === UserTier.PRO ? Infinity : user.tier === UserTier.FREE ? 5 : 0;
  const acceptedFileTypes = "image/*,application/pdf,.doc,.docx,.txt";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      if (files.length + newFiles.length > maxFiles) {
        alert(`You can only upload a maximum of ${maxFiles} files.`);
        return;
      }
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  
  const handleSendMessage = async () => {
    if (isLoading || (!input.trim() && files.length === 0)) return;

    setIsLoading(true);

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const docFiles = files.filter(file => !file.type.startsWith('image/'));

    const imageUrls = imageFiles.map(file => URL.createObjectURL(file));

    const docPrompt = docFiles.length > 0 
        ? `\n\nI have uploaded the following documents: ${docFiles.map(f => f.name).join(', ')}. Please consider their content when responding.`
        : '';
    
    const userMessageText = `${input.trim()}${docPrompt}`;

    const userMessage: ChatMessage = {
      role: ChatMessageRole.USER,
      text: userMessageText,
      images: imageUrls,
    };
    
    const historyForAPI = [...messages, userMessage];
    
    setMessages(prev => [...prev, userMessage, { role: ChatMessageRole.MODEL, text: 'Sto rispondendo...' }]);
    setInput('');
    setFiles([]);

    try {
      const stream = await generateResponse(historyForAPI, user.tier);
      const reader = stream.getReader();
      let modelResponseText = '';
      
      const processStream = async () => {
        let firstChunk = true;
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            setIsLoading(false);
            imageUrls.forEach(url => URL.revokeObjectURL(url));
            break;
          }
          
          modelResponseText += value;

          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessageIndex = newMessages.length - 1;
            
            if (firstChunk) {
              newMessages[lastMessageIndex] = { role: ChatMessageRole.MODEL, text: modelResponseText };
              firstChunk = false;
            } else {
              newMessages[lastMessageIndex] = { ...newMessages[lastMessageIndex], text: modelResponseText };
            }
            return newMessages;
          });
        }
      };

      processStream();
      
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
          role: ChatMessageRole.SYSTEM,
          text: 'There was an error communicating with the AI. Please try again.',
      };
      setMessages((prev) => {
        const newMessages = [...prev.slice(0, -1), errorMessage];
        return newMessages;
      });
      setIsLoading(false);
      imageUrls.forEach(url => URL.revokeObjectURL(url));
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-4 sticky bottom-0 bg-gray-900">
        {files.length > 0 && (
          <div className="p-2 mb-2 bg-gray-800 rounded-lg flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div key={index} className="bg-gray-700 rounded-full px-3 py-1 text-sm text-white flex items-center gap-2">
                <span>{file.name}</span>
                <button onClick={() => handleRemoveFile(index)} className="text-gray-400 hover:text-white">
                  <XCircleIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Scrivi la tua domanda..."
            rows={1}
            className="w-full bg-gray-800 text-white rounded-2xl p-4 pr-24 resize-none border-2 border-transparent focus:border-indigo-500 focus:outline-none transition-colors"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="relative group">
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!canUpload}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                    <PaperClipIcon className="w-6 h-6" />
                </button>
                {!canUpload && <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    Login to upload files
                </span>}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept={acceptedFileTypes}
              className="hidden"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || (!input.trim() && files.length === 0)}
              className="bg-indigo-600 text-white p-2 rounded-full disabled:bg-gray-600 transition-colors"
            >
              <SendIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;