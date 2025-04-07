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
      setError('Please enter a base64 string.');
      return;
    }

    try {
      const decodedBase64 = atob(value);
      console.log("decodeBase64", decodedBase64);
      
      setResult(decodedBase64);
    } catch {
      setError('Failed to decode base64.');
    }
  };

  const handleEncode = () => {
    setError('');
    try {
        const decodedBase64 = btoa(value)
        setResult(decodedBase64);
    } catch (err) {
      setError('Invalid JSON in header or payload');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
   setValue('')
   setError('')
  };

  const handleSetMode = (newMode: 'decode' | 'encode') => {
   if(mode !== newMode){
    setMode(newMode);
    setValue('')
    setResult('')
   }
  };

  return (
    <div className="w-full p-2 mx-auto rounded-xl">
       <h1 className="text-3xl font-bold text-gray-800 mb-3">Base64 Encoder</h1>
      <div className="flex border-b mt-4">
        <button
          onClick={() => {
           handleSetMode('decode'); 
          }}
          className={`px-4 py-2 ${mode === 'decode' ? 'border-b-2 border-gray-600 font-semibold' : 'text-gray-500'}`}
        >
          Decode
        </button>
        <button
          onClick={() => {
            handleSetMode('encode'); 
          }}
          className={`px-4 py-2 ${mode === 'encode' ? 'border-b-2 border-gray-600 font-semibold' : 'text-gray-500'}`}
        >
          Encode
        </button>
      </div>
      <>
          <textarea
            rows={4}
            className="w-full border p-3 rounded-md mb-4 font-mono text-sm"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={mode == 'decode' ? 'Paste base64 to decode' : 'Paste string to encode...'}
          />
          <div className="flex gap-2 mb-4">

<Button onClick={mode == 'decode' ? handleEncode : handleDecode}>
              {mode == 'decode' ? 'Encode' : 'Decode'}
            </Button>

            
            <Button onClick={handleClear} variant={"outline"}>
            Clear
            </Button>
          </div>
        </>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {result && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">{mode == 'encode' ? 'Encoded' : 'Decoded'} value</h3>
            <button
              onClick={() => handleCopy(result)}
              className="text-sm text-blue-600 hover:underline"
            >
              Copy
            </button>
          </div>
          <pre className="bg-gray-100 p-4 rounded-md text-sm break-all">{result}</pre>
        </div>
      )}
    </div>
  );
}
