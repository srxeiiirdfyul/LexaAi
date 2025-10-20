import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatInterface from './components/ChatInterface';
import HeroSection from './components/HeroSection';
import AuthModal from './components/AuthModal';
import UpgradeModal from './components/UpgradeModal';
import { User, UserTier, ChatMessage, ChatMessageRole } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User>({ isLoggedIn: false, tier: UserTier.GUEST });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  
  // Persist user state in localStorage to simulate a session
  useEffect(() => {
    const storedUser = localStorage.getItem('lexaai_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const updateUserState = (newUserState: Partial<User>) => {
    setUser(prevUser => {
      const updatedUser = { ...prevUser, ...newUserState };
      localStorage.setItem('lexaai_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  // Modal handlers
  const handleOpenLoginModal = () => setIsAuthModalOpen(true);

  const handleOpenUpgradeModal = () => {
    if (user.isLoggedIn) {
      setIsUpgradeModalOpen(true);
    } else {
      // Prompt to login first if not logged in
      setIsAuthModalOpen(true);
    }
  };

  const handleLogout = () => {
    updateUserState({ isLoggedIn: false, tier: UserTier.GUEST });
    setMessages([]);
    setHasStartedChat(false);
  };
  
  // Callbacks from modals
  const handleAuthSuccess = () => {
    updateUserState({ isLoggedIn: true, tier: UserTier.FREE });
    setIsAuthModalOpen(false);
  };

  const handleUpgradeConfirm = () => {
    if (user.isLoggedIn) {
      updateUserState({ tier: UserTier.PRO });
    }
    setIsUpgradeModalOpen(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    setHasStartedChat(false);
  };

  const handleSaveChat = () => {
    if (messages.length === 0) {
      alert("There's nothing to save!");
      return;
    }
    try {
      localStorage.setItem('lexaai_saved_chat', JSON.stringify(messages));
      alert('Chat saved successfully!');
    } catch (error) {
      console.error('Failed to save chat:', error);
      alert('Could not save the chat. Storage might be full.');
    }
  };

  const handleLoadChat = () => {
    const savedChat = localStorage.getItem('lexaai_saved_chat');
    if (savedChat) {
      try {
        const parsedChat = JSON.parse(savedChat);
        if (Array.isArray(parsedChat)) {
          setMessages(parsedChat);
          if(parsedChat.length > 0) {
            setHasStartedChat(true);
          }
          alert('Chat loaded successfully!');
        }
      } catch (error) {
        console.error('Failed to parse saved chat:', error);
        alert('Could not load the chat. The saved data might be corrupted.');
      }
    } else {
      alert('No saved chat found.');
    }
  };

  useEffect(() => {
    if(messages.length > 0 && !hasStartedChat) {
        setHasStartedChat(true);
    }
  }, [messages, hasStartedChat]);


  return (
    <div className="bg-gray-900 min-h-screen flex flex-col text-gray-200 font-sans">
      <Header 
        user={user} 
        onLogin={handleOpenLoginModal} 
        onLogout={handleLogout} 
        onUpgrade={handleOpenUpgradeModal}
        onNewChat={handleNewChat}
        onSaveChat={handleSaveChat}
        onLoadChat={handleLoadChat}
      />
      
      <main className="flex-grow flex flex-col pt-16">
        <div className={`transition-all duration-500 overflow-hidden ${hasStartedChat ? 'max-h-0 opacity-0' : 'max-h-screen opacity-100'}`}>
            <HeroSection />
        </div>
        
        <div className={`flex-grow flex flex-col transition-opacity duration-500 ${hasStartedChat ? 'opacity-100' : 'opacity-100'}`}>
            <ChatInterface user={user} messages={messages} setMessages={setMessages} />
        </div>
      </main>

      <Footer />
      
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={handleAuthSuccess} />}
      {isUpgradeModalOpen && <UpgradeModal onClose={() => setIsUpgradeModalOpen(false)} onUpgradeConfirm={handleUpgradeConfirm} />}
    </div>
  );
};

export default App;