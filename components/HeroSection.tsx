
import React from 'react';
import { SparklesIcon } from './icons';

const CheckListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start">
        <svg className="w-6 h-6 text-indigo-400 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        <span>{children}</span>
    </li>
);

const HeroSection: React.FC = () => {
  return (
    <div className="text-white text-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
          Benvenuto su LexaAI
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
          La tua intelligenza artificiale personale. Parla, chiedi, esplora, crea.
        </p>
        <p className="mt-6 text-base text-gray-400 max-w-3xl mx-auto">
            LexaAI è un assistente conversazionale avanzato, progettato con tecnologie AI di ultima generazione tramite Google AI Studio. Ti aiuta a scrivere, capire, creare, analizzare e risolvere problemi in modo semplice e naturale.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Cosa puoi fare con LexaAI</h3>
                <ul className="space-y-4 text-gray-300">
                    <CheckListItem><b>Conversazioni intelligenti:</b> chiedi qualsiasi cosa, da spiegazioni tecniche a idee creative.</CheckListItem>
                    <CheckListItem><b>Allega fino a 5 immagini</b> per analisi visive o richieste personalizzate.</CheckListItem>
                    <CheckListItem><b>Carica fino a 3 documenti</b> (PDF, Word, ecc.) per riassunti, traduzioni o aiuto nello studio.</CheckListItem>
                </ul>
            </div>
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                 <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <SparklesIcon className="w-6 h-6 mr-2 text-indigo-400"/>
                    LexaAI PRO — <span className="ml-2 text-sm font-normal text-gray-400">Paghi una volta, per sempre</span>
                </h3>
                <ul className="space-y-4 text-gray-300">
                     <CheckListItem><b>Caricamenti illimitati</b> di immagini e file.</CheckListItem>
                     <CheckListItem><b>Risposte più veloci</b> e modelli più potenti.</CheckListItem>
                     <CheckListItem>Accesso completo <b>senza limiti</b> e senza abbonamento.</CheckListItem>
                </ul>
            </div>
        </div>

        <div className="mt-10">
            <h2 className="text-2xl font-bold">🚀 Inizia ora</h2>
            <p className="text-gray-400 mt-2">Non serve registrarsi. Scrivi la tua prima domanda qui sotto e scopri quanto può essere utile LexaAI.</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
