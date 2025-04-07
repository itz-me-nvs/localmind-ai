'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function JWTTool() {
  const [mode, setMode] = useState<'decode' | 'encode'>('decode');
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [decodedValues, setDecodedValues] = useState<{header: string, payload: string }>({header: '', payload: ''});
  const [payload, setPayload] = useState('');
  const [error, setError] = useState('');

  const encodeBase64 = (obj: object) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

  const decodeBase64 = (str: string) => {
    try {
      return decodeURIComponent(
        atob(str.replace(/-/g, '+').replace(/_/g, '/'))
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch {
      return null;
    }
  };

  const handleDecode = () => {
    setError('');
    setHeader('');
    setPayload('');

    if (!token) {
      setError('Please enter a JWT.');
      return;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      setError('Invalid JWT. Must contain 3 parts.');
      return;
    }

    const [headerStr, payloadStr] = parts;

    const decodedHeader = decodeBase64(headerStr);
    const decodedPayload = decodeBase64(payloadStr);

    try {
      const header = JSON.stringify(JSON.parse(decodedHeader!), null, 2);
      const payload = JSON.stringify(JSON.parse(decodedPayload!), null, 2);

      setDecodedValues({ header, payload });
    } catch {
      setError('Failed to parse token. Invalid format.');
    }
  };

  const handleEncode = () => {
    setError('');
    try {
      const headerObj = JSON.parse(header);
      const payloadObj = JSON.parse(payload);
      const encodedHeader = encodeBase64(headerObj);
      const encodedPayload = encodeBase64(payloadObj);
      const fakeSignature = 'signature-placeholder';
      setToken(`${encodedHeader}.${encodedPayload}.${fakeSignature}`);
    } catch (err) {
      setError('Invalid JSON in header or payload');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    setToken('');
    setHeader('');
    setPayload('');
    setError('');
  };

  const handleSetMode = (newMode: 'decode' | 'encode') => {
   if(mode !== newMode){
    setMode(newMode);
   }
  };

  return (
    <div className="w-full p-2 mx-auto rounded-xl">
             <h1 className="text-3xl font-bold text-gray-800">JWT Encoder</h1>

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

      {mode === 'decode' && (
        <>
          <textarea
            rows={4}
            className="w-full border p-3 rounded-md mb-4 font-mono text-sm focus:outline-none"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste JWT to decode..."
          />
          <div className="flex gap-2 mb-4">
            {/* <button onClick={handleDecode} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 dark:hover:bg-gray-600 dark:bg-gray-700 transition">
              Decode
            </button> */}

<Button
onClick={handleDecode}
className="flex items-center rounded transition"
>
<span>Decode</span>
</Button>

<Button
onClick={handleClear}
variant={'outline'}
>
<span>Clear</span>
</Button>

            {/* <button onClick={handleClear} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition">
              Clear
            </button> */}
          </div>
        </>
      )}

      {mode === 'encode' && (
        <>
          <textarea
            rows={4}
            className="w-full border p-3 rounded-md mb-3 font-mono text-sm focus:outline-none"
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            placeholder='Header: { "alg": "HS256", "typ": "JWT" }'
          />
          <textarea
            rows={6}
            className="w-full border p-3 rounded-md mb-3 font-mono text-sm focus:outline-none"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder='Payload: { "user": "navas", "admin": true }'
          />
          <div className="flex gap-2 mb-4">

            <Button
onClick={handleEncode}
className="flex items-center rounded transition"
>
<span>Encode</span>
</Button>

            <Button
onClick={handleClear}
variant={'outline'}
>
<span>Clear</span>
</Button>
          </div>
        </>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {mode === 'decode' && decodedValues.header.length && (
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Decoded Header</h3>
          <pre className="bg-gray-100 p-4 rounded-md text-sm">{decodedValues.header}</pre>
        </div>
      )}
      {mode === 'decode' && decodedValues.payload.length && (
        <div className="mb-4">
          <h3 className="font-semibold mb-1">Decoded Payload</h3>
          <pre className="bg-gray-100 p-4 rounded-md text-sm">{decodedValues.payload}</pre>
        </div>
      )}

      {mode === 'encode' && token && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Encoded JWT</h3>
            <button
              onClick={() => handleCopy(token)}
              className="text-sm text-gray-500 hover:underline"
            >
              Copy
            </button>
          </div>
          <pre className="bg-gray-100 p-4 rounded-md text-sm break-all">{token}</pre>
        </div>
      )}
    </div>
  );
}
