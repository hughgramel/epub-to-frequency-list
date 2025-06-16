'use client';

import { useState } from 'react';
import { getTextFromEpub } from '@/lib/epub-parser'; // Make sure this path is correct

// Define a type for the analysis results we expect from the backend
interface AnalysisResult {
  word: string;
  frequency: number;
  percentage: number;
  cumulative_comprehension: number;
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // This state is kept for future use, but won't be populated in this version
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setResults([]);
      setError(null);
    }
  };

// From your page.tsx
const handleProcessClick = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);
    try {
      const textContent = await getTextFromEpub(selectedFile);
      console.log("--- EPUB Text Content (from JSZip) ---");
      console.log(textContent);
      alert("EPUB content has been printed to the console.");
    } catch (err: any) {
      setError(err.message);
      console.error("Failed to parse EPUB:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <main className="container mx-auto max-w-4xl p-4 sm:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            EPUB Word Analyzer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Upload a book to see its text content in the console.
          </p>
        </header>

        <div className="flex justify-center items-center mb-12 space-x-4 h-12">
          {!selectedFile && !isLoading && (
            <>
              <label
                htmlFor="epub-upload"
                className="cursor-pointer bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
              >
                Import EPUB
              </label>
              <input id="epub-upload" type="file" accept=".epub" className="hidden" onChange={handleFileChange} />
            </>
          )}
          {selectedFile && !isLoading &&(
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 py-3 px-4 rounded-lg">
                {selectedFile.name}
              </span>
              <button
                onClick={handleProcessClick}
                className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105"
              >
                Process
              </button>
            </div>
          )}
          {isLoading && (
             <div className="text-lg text-gray-600 dark:text-gray-300">Parsing...</div>
          )}
        </div>

        {error && (
            <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/50 p-3 rounded-lg mb-8">{error}</div>
        )}
        
        {/* The table will not be populated in this version */}
        
      </main>
    </div>
  );
}
