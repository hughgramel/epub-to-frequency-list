'use client';

import { useState } from 'react';
// Corrected the import path to use a relative path for compatibility.
import { getTextFromEpub } from '../lib/epub-parser';

// Define a type for the analysis results we expect from the backend
interface AnalysisResult {
  word: string;
  frequency: number;
  percentage: number;
  cumulative_comprehension: number;
}

const INITIAL_DISPLAY_COUNT = 100;

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // This state holds all results from the backend
  const [results, setResults] = useState<AnalysisResult[]>([]);
  // This new state tracks how many results to show
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [manualText, setManualText] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError(null);
      setResults([]);
      setDisplayCount(INITIAL_DISPLAY_COUNT); // Reset display count
    }
  };

  const handleProcessClick = async () => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    setDisplayCount(INITIAL_DISPLAY_COUNT); // Reset display count

    let textContent = '';

    try {
      if (inputMode === 'file' && selectedFile) {
        textContent = await getTextFromEpub(selectedFile);
      } else if (inputMode === 'text') {
        textContent = manualText;
      } else {
        throw new Error('No file selected or text entered.');
      }

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

      const data: AnalysisResult[] = await response.json();
      setResults(data);

    } catch (err: any) {
      setError(err.message);
      console.error("Failed to process:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const showMoreResults = () => {
    setDisplayCount(prevCount => prevCount + 100);
  };

  const showAllResults = () => {
    setDisplayCount(results.length);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <main className="container mx-auto max-w-4xl p-4 sm:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Vocabulary Frequency Analyzer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Upload a book or paste text to get a full vocabulary breakdown.
          </p>
        </header>

        {/* --- Input Mode Toggle --- */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button onClick={() => setInputMode('file')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${inputMode === 'file' ? 'bg-white dark:bg-gray-900 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}>
              Upload EPUB
            </button>
            <button onClick={() => setInputMode('text')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${inputMode === 'text' ? 'bg-white dark:bg-gray-900 text-blue-600' : 'text-gray-600 dark:text-gray-300'}`}>
              Paste Text
            </button>
          </div>
        </div>

        {/* --- Main Input Area --- */}
        <div className="mb-8">
          {inputMode === 'file' ? (
            <div className="flex justify-center items-center h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              {!selectedFile ? (<label htmlFor="epub-upload" className="cursor-pointer text-blue-600 font-semibold">Click here to select an EPUB file</label>) : (<span className="text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded-lg">{selectedFile.name}</span>)}
              <input id="epub-upload" type="file" accept=".epub" className="hidden" onChange={handleFileChange} />
            </div>
          ) : (
            <textarea value={manualText} onChange={(e) => setManualText(e.target.value)} placeholder="Paste your text here..." className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
          )}
        </div>
        
        {/* --- Process Button --- */}
        <div className="text-center mb-12">
          <button onClick={handleProcessClick} disabled={isLoading || (inputMode === 'file' && !selectedFile) || (inputMode === 'text' && !manualText)} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100">
            {isLoading ? 'Processing...' : 'Analyze Vocabulary'}
          </button>
        </div>

        {error && (<div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mb-8">{error}</div>)}

        {/* --- Results Table --- */}
        {results.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                  <tr>
                    {/* New column for the row number */}
                    <th scope="col" className="px-6 py-3">#</th>
                    <th scope="col" className="px-6 py-3">Word (Lemma)</th>
                    <th scope="col" className="px-6 py-3">Frequency</th>
                    <th scope="col" className="px-6 py-3">Text %</th>
                    <th scope="col" className="px-6 py-3">Cumulative Comprehension %</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Use slice to only show a portion of the results */}
                  {results.slice(0, displayCount).map((result, index) => (
                    <tr key={index} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      {/* New cell for the row number (index + 1) */}
                      <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400">{index + 1}</td>
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{result.word}</th>
                      <td className="px-6 py-4">{result.frequency}</td>
                      <td className="px-6 py-4">{result.percentage}%</td>
                      <td className="px-6 py-4">{result.cumulative_comprehension}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* --- Pagination Buttons --- */}
            {displayCount < results.length && (
              <div className="p-4 flex justify-center space-x-4 bg-gray-50 dark:bg-gray-700/50">
                <button
                  onClick={showMoreResults}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Show 100 More
                </button>
                <button
                  onClick={showAllResults}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Show All
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
