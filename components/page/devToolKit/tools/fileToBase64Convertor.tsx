'use client';

import { useState } from 'react';

export default function FileToBase64Converter() {
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState('');
  const [error, setError] = useState('');
  const MAX_FILE_SIZE = 5 * 1024 * 1024; 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if(selectedFile){
        setError('');
        setBase64('');

        if(selectedFile.size > MAX_FILE_SIZE) {
            setError(`File size exceeds the maximum limit of 5MB.`);
            return ;
        }

        setError('');
        setBase64('');
    
        setFile(selectedFile);
    
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            if (result.startsWith('data:')) {
              setBase64(result.split(',')[1]);
            } else {
              setBase64(result);
            }
          };
          reader.onerror = () => {
            setError('Failed to read file.');
          };
          reader.readAsDataURL(selectedFile);
    }
  };

  const handleClear = () => {
    setFile(null);
    setBase64('');
    setError('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(base64);
  };

  return (
    <div className="max-w-5xl mx-auto p-2  rounded-xl">
      <h2 className="text-2xl font-bold mb-4">File to Base64 Converter</h2>

      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 block"
        accept=".txt,.pdf,.jpg,.jpeg,.png,.json,.csv,.xml,.doc,.docx,.xls,.xlsx"
      />

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleClear}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Clear
        </button>
        {base64 && (
          <button
            onClick={handleCopy}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Copy Base64
          </button>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {base64 && (
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md border font-mono text-sm max-h-96 overflow-auto">
          {base64}
        </pre>
      )}
    </div>
  );
}
