'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Base64EncoderTool() {
  const [mode, setMode] = useState<'decode' | 'encode'>('decode');
  const [value, setValue] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleDecode = () => {
    setError('');
    if (!value) {
      setError('❌ Please enter a base64 string.');
      return;
    }

    try {
      const decodedBase64 = atob(value);
      setResult(decodedBase64);
    } catch {
      setError('❌ Failed to decode base64.');
    }
  };

  const handleEncode = () => {
    setError('');
    try {
      const encodedBase64 = btoa(value);
      setResult(encodedBase64);
    } catch (err) {
      setError('❌ Invalid input for base64 encoding');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    setValue('');
    setError('');
    setResult(null);
  };

  const handleSetMode = (newMode: 'decode' | 'encode') => {
    if (mode !== newMode) {
      setMode(newMode);
      setValue('');
      setResult(null);
      setError('');
    }
  };

  return (
    <div className="w-full mx-auto bg-white dark:bg-gray-900 space-y-6 p-4 rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Base64 Encoder / Decoder</h1>

      <div className="flex border-b border-gray-300 dark:border-gray-700 mt-4">
        <button
          onClick={() => handleSetMode('decode')}
          className={`px-4 py-2 transition ${
            mode === 'decode'
              ? 'border-b-2 border-gray-800 dark:border-gray-100 font-semibold text-gray-800 dark:text-gray-100'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Decode
        </button>
        <button
          onClick={() => handleSetMode('encode')}
          className={`px-4 py-2 transition ${
            mode === 'encode'
              ? 'border-b-2 border-gray-800 dark:border-gray-100 font-semibold text-gray-800 dark:text-gray-100'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Encode
        </button>
      </div>

      <textarea
        rows={6}
        className="w-full border border-gray-300 dark:border-gray-700 focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-3 rounded-lg font-mono text-sm resize-y transition"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={mode === 'decode' ? 'Paste base64 to decode' : 'Paste string to encode...'}
      />

      <div className="flex flex-wrap gap-3">
        <Button onClick={mode === 'decode' ? handleDecode : handleEncode}>
          {mode === 'decode' ? 'Decode' : 'Encode'}
        </Button>

        <Button onClick={handleClear} variant="outline">
          Clear
        </Button>
      </div>

      {error && (
        <div className="text-red-600 dark:text-red-400 font-medium bg-red-100 dark:bg-red-900 p-3 rounded-lg border border-red-300 dark:border-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              {mode === 'encode' ? 'Encoded' : 'Decoded'} value
            </h3>
            <button
              onClick={() => handleCopy(result)}
              className="text-sm text-gray-500 dark:text-gray-400 hover:underline"
            >
              Copy
            </button>
          </div>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm break-all font-mono text-gray-800 dark:text-gray-100">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}