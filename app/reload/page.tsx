"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OllamaNotRunningPage() {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText("ollama serve");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-secondary from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 px-6">
      <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-6">
        Ollama is not running
      </h1>
      <p className="text-lg text-center mb-4">
        Follow these steps to start Ollama:
      </p>
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-lg shadow-md w-full max-w-md">
        <ol className="list-decimal pl-6 space-y-2">
          <li>Open your terminal</li>
          <li>Run the following command:</li>
        </ol>
        <div className="bg-gray-800 text-white px-4 py-2 mt-2 rounded-lg flex justify-between items-center font-mono">
          <code>ollama serve</code>
          <button
            onClick={handleCopy}
            className="ml-4 text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <p className="text-lg text-center mt-6">
        If you haven’t installed Ollama, get it here:
      </p>
      <a
        href="https://ollama.com"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 mt-4 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 active:scale-95 transition-transform duration-200"
      >
        Install Ollama
      </a>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-3 mt-6 text-lg font-semibold text-white bg-gray-600 rounded-lg shadow-lg hover:bg-gray-700 active:scale-95 transition-transform duration-200"
      >
        Return to Home
      </button>
    </div>
  );
}
