
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center py-4">
      <p className="text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} LexaAI. All data is protected and private.
      </p>
    </footer>
  );
};

export default Footer;
