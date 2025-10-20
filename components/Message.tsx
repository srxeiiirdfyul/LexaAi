import React from 'react';
import { ChatMessage, ChatMessageRole } from '../types';
import { SparklesIcon } from './icons';

interface MessageProps {
  message: ChatMessage;
}

const UserAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold text-white text-sm">
        U
    </div>
);

const ModelAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
        <SparklesIcon className="w-5 h-5 text-white" />
    </div>
);


const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === ChatMessageRole.USER;
  const isTyping = message.role === ChatMessageRole.MODEL && message.text === 'Sto rispondendo...';

  return (
    <div className={`flex items-start gap-4 my-4 ${isUser ? 'justify-end' : ''}`}>
        {!isUser && <ModelAvatar />}
      <div className={`max-w-xl p-4 rounded-2xl ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-700 text-gray-200 rounded-bl-none'
        }`}
      >
        {isTyping ? (
          <div className="flex items-baseline gap-2">
            <span className="text-gray-300">Sto rispondendo</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        ) : (
            <div className="prose prose-invert max-w-none prose-p:my-2" dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />') }} />
        )}
        {message.images && message.images.length > 0 && (
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {message.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`uploaded content ${index}`}
                className="rounded-lg object-cover w-full h-24"
              />
            ))}
          </div>
        )}
      </div>
      {isUser && <UserAvatar />}
    </div>
  );
};

export default Message;