import React, { useState, useRef, useEffect } from 'react';
import { User, UserTier } from '../types';
import { SparklesIcon, Bars3Icon, ArrowDownTrayIcon, ArrowUpTrayIcon } from './icons';

interface HeaderProps {
  user: User;
  onLogin: () => void;
  onLogout: () => void;
  onUpgrade: () => void;
  onNewChat: () => void;
  onSaveChat: () => void;
  onLoadChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin, onLogout, onUpgrade, onNewChat, onSaveChat, onLoadChat }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuAction = (action: () => void) => {
    action();
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-50 backdrop-blur-md z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
              >
                <Bars3Icon className="w-6 h-6" />
              </button>

              {isMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 origin-top-left bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-2 z-50 animate-fade-in-down">
                  {user.isLoggedIn ? (
                    <>
                      <button
                        onClick={() => handleMenuAction(onNewChat)}
                        className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 flex items-center transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        New Chat
                      </button>
                      <button
                        onClick={() => handleMenuAction(onSaveChat)}
                        className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 flex items-center transition-colors"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-3" />
                        Save Chat
                      </button>
                       <button
                        onClick={() => handleMenuAction(onLoadChat)}
                        className="w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 flex items-center transition-colors"
                      >
                        <ArrowUpTrayIcon className="h-5 w-5 mr-3" />
                        Load Chat
                      </button>
                      <div className="border-t border-gray-700 my-2" />
                      <div className="px-4 py-2">
                        {user.tier === UserTier.PRO ? (
                            <div className="flex items-center justify-center text-sm font-medium text-indigo-400 border border-indigo-400 px-3 py-1.5 rounded-full">
                                <SparklesIcon className="w-4 h-4 mr-2" />
                                <span>PRO User</span>
                            </div>
                        ) : (
                          <button
                            onClick={() => handleMenuAction(onUpgrade)}
                            className="w-full bg-indigo-500 text-white p-2.5 rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center shadow-lg text-sm font-semibold"
                          >
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            Upgrade to LexaAI PRO
                          </button>
                        )}
                      </div>
                      <div className="border-t border-gray-700 my-2" />
                      <button
                        onClick={() => handleMenuAction(onLogout)}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 flex items-center transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="px-4 py-2">
                       <button
                        onClick={() => handleMenuAction(onLogin)}
                        className="w-full bg-gray-700 text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-gray-600 transition-colors"
                      >
                        Login / Sign Up
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center ml-4">
              <SparklesIcon className="h-8 w-8 text-indigo-400" />
              <h1 className="text-2xl font-bold text-white ml-2 tracking-tight">LexaAI</h1>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;