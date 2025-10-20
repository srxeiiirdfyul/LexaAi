import React from 'react';
import Modal from './Modal';
import { SparklesIcon } from './icons';

interface UpgradeModalProps {
  onClose: () => void;
  onUpgradeConfirm: () => void;
}

const CheckListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <svg className="w-6 h-6 text-indigo-400 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        <span>{children}</span>
    </li>
);


const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose, onUpgradeConfirm }) => {
  return (
    <Modal isOpen={true} onClose={onClose} title="Upgrade to LexaAI PRO">
        <div className="text-gray-300">
            <p className="mb-4">
                Unlock the full potential of LexaAI with a one-time payment for lifetime access.
            </p>
            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                    <SparklesIcon className="w-5 h-5 mr-2 text-indigo-400"/>
                    PRO Features
                </h3>
                <ul className="space-y-3">
                     <CheckListItem><b>Unlimited uploads</b> of images and files.</CheckListItem>
                     <CheckListItem><b>Faster responses</b> with our most powerful AI models.</CheckListItem>
                     <CheckListItem><b>Full access</b> with no limits and no subscriptions.</CheckListItem>
                     <CheckListItem>Priority support.</CheckListItem>
                </ul>
            </div>
            <div className="mt-6">
                <button
                    onClick={onUpgradeConfirm}
                    className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 font-semibold"
                >
                    Upgrade Now (Lifetime Access)
                </button>
            </div>
            <p className="mt-4 text-center text-sm text-gray-400">
                This is a simulated upgrade process. No payment is required.
            </p>
        </div>
    </Modal>
  );
};

export default UpgradeModal;
