import React, { useState } from 'react';

interface PromptInputProps {
  handleGenerate: (prompt: string, aspectRatio: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ handleGenerate, isLoading, disabled = false }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');

  const onGenerateClick = () => {
    handleGenerate(prompt, aspectRatio);
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={disabled ? "You have no credits left. Please purchase a plan." : "e.g., A majestic lion wearing a crown, cinematic lighting, hyper-realistic"}
        className="w-full h-24 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none placeholder-gray-500"
        disabled={isLoading || disabled}
      />
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-400 mb-1">Aspect Ratio</label>
          <select
            id="aspect-ratio"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            disabled={isLoading || disabled}
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="1:1">Square (1:1)</option>
            <option value="16:9">Landscape (16:9)</option>
            <option value="9:16">Portrait (9:16)</option>
            <option value="4:3">Standard (4:3)</option>
            <option value="3:4">Tall (3:4)</option>
          </select>
        </div>
        <button
          onClick={onGenerateClick}
          disabled={isLoading || !prompt.trim() || disabled}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 self-end"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Image (1 Credit)'
          )}
        </button>
      </div>
    </div>
  );
};

export default PromptInput;
