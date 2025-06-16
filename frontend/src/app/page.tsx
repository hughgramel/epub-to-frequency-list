'use client';

import { useState } from 'react';
// Corrected the import path to use the Next.js alias for robustness.
import { getTextFromEpub } from '@/lib/epub-parser';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendMessage, setBackendMessage] = useState<string | null>(null);

  // New state to manage the input mode: 'file' or 'text'
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  // New state for the manual text input
  const [manualText, setManualText] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError(null);
      setBackendMessage(null);
    }
  };

  const handleProcessClick = async () => {
    setIsLoading(true);
    setError(null);
    setBackendMessage(null);

    let textContent = '';

    try {
      if (inputMode === 'file' && selectedFile) {
        // 1a. Get the cleaned text string from the EPUB parser
        textContent = await getTextFromEpub(selectedFile);
      } else if (inputMode === 'text') {
        // 1b. Use the text from the textarea
        // We should apply the same cleaning here if the backend expects it
        textContent = manualText
          .toLowerCase()
          .replace(/[—–-]/g, ' ')
          .replace(/[.,¡!¿?:;()"“”«»\[\]◆]/g, '')
          .replace(/\d+/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      } else {
        throw new Error('No file selected or text entered.');
      }

      // 2. Send the text to the Python backend API
      const response = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: textContent }),
      });

      if (!response.ok) {
        throw new Error('The Python server is not responding. Is it running?');
      }

      const data = await response.json();
      setBackendMessage(data.message);

    } catch (err: any) {
      setError(err.message);
      console.error("Failed to process:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <main className="container mx-auto max-w-4xl p-4 sm:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            EPUB & Text Analyzer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Upload a book or paste text to process with Python.
          </p>
        </header>

        {/* --- Input Mode Toggle --- */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setInputMode('file')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                inputMode === 'file' ? 'bg-white dark:bg-gray-900 text-blue-600' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Upload EPUB
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                inputMode === 'text' ? 'bg-white dark:bg-gray-900 text-blue-600' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Paste Text
            </button>
          </div>
        </div>

        {/* --- Main Input Area --- */}
        <div className="mb-8">
          {inputMode === 'file' ? (
            <div className="flex justify-center items-center h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              {!selectedFile ? (
                <label
                  htmlFor="epub-upload"
                  className="cursor-pointer text-blue-600 font-semibold"
                >
                  Click here to select an EPUB file
                </label>
              ) : (
                <span className="text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded-lg">
                  {selectedFile.name}
                </span>
              )}
              <input id="epub-upload" type="file" accept=".epub" className="hidden" onChange={handleFileChange} />
            </div>
          ) : (
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Paste your text here..."
              className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          )}
        </div>
        
        {/* --- Process Button --- */}
        <div className="text-center mb-12">
            <button
                onClick={handleProcessClick}
                disabled={isLoading || (inputMode === 'file' && !selectedFile) || (inputMode === 'text' && !manualText)}
                className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
            >
                {isLoading ? 'Processing...' : 'Process Text'}
            </button>
        </div>


        {error && (
            <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mb-4">{error}</div>
        )}

        {backendMessage && (
            <div className="text-center text-green-600 bg-green-100 dark:bg-green-900/50 p-3 rounded-lg mb-4">{backendMessage}</div>
        )}
        
      </main>
    </div>
  );
}
