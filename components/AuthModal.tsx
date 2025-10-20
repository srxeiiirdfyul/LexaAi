import React, { useState } from 'react';
import Modal from './Modal';

interface AuthModalProps {
  onClose: () => void;
  onAuthSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onAuthSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        console.log('Logging in with', { email, password });
    } else {
        if (!firstName || !lastName || !dob || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        console.log('Signing up with', { firstName, lastName, dob, email, password });
    }
    
    setError('');
    onAuthSuccess();
  };
  
  const handleViewChange = (isLogin: boolean) => {
    setIsLoginView(isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setDob('');
  };


  return (
    <Modal isOpen={true} onClose={onClose} title={isLoginView ? 'Login' : 'Sign Up'}>
      <div className="flex mb-4 border-b border-gray-700">
        <button
          className={`w-1/2 py-2 text-center font-medium transition-colors ${isLoginView ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
          onClick={() => handleViewChange(true)}
        >
          Login
        </button>
        <button
          className={`w-1/2 py-2 text-center font-medium transition-colors ${!isLoginView ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
          onClick={() => handleViewChange(false)}
        >
          Sign Up
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
            {!isLoginView && (
                <>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-1/2">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">Nome</label>
                            <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Mario"
                            autoComplete="given-name"
                            />
                        </div>
                        <div className="w-full sm:w-1/2">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">Cognome</label>
                            <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Rossi"
                            autoComplete="family-name"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="dob" className="block text-sm font-medium text-gray-300">Data di nascita</label>
                        <input
                        type="date"
                        id="dob"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        autoComplete="bday"
                        />
                    </div>
                </>
            )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              autoComplete={isLoginView ? 'current-password' : 'new-password'}
            />
          </div>
        </div>
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800"
          >
            {isLoginView ? 'Login' : 'Create Account'}
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-400">
          This is a simulated authentication. No data is sent.
        </p>
      </form>
    </Modal>
  );
};

export default AuthModal;