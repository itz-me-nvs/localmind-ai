'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function JWTTool() {
  const [mode, setMode] = useState<'decode' | 'encode'>('decode');
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [decodedValues, setDecodedValues] = useState<{ header: string; payload: string }>({ header: '', payload: '' });
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
    setDecodedValues({ header: '', payload: '' });

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
    } catch {
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
    setDecodedValues({ header: '', payload: '' });
  };

  const handleSetMode = (newMode: 'decode' | 'encode') => {
    if (mode !== newMode) {
      handleClear();
      setMode(newMode);
    }
  };

  return (
    <div className="w-full p-4 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
      <h1 className="text-3xl font-bold mb-4 text-foreground">JWT {mode === 'decode' ? 'Decoder' : 'Encoder'}</h1>

      <div className="flex border-b border-border mb-4">
        <button
          onClick={() => handleSetMode('decode')}
          className={`px-4 py-2 ${
            mode === 'decode'
              ? 'border-b-2 border-primary text-primary font-medium'
              : 'text-muted-foreground hover:text-foreground'
          } transition`}
        >
          Decode
        </button>
        <button
          onClick={() => handleSetMode('encode')}
          className={`px-4 py-2 ${
            mode === 'encode'
              ? 'border-b-2 border-primary text-primary font-medium'
              : 'text-muted-foreground hover:text-foreground'
          } transition`}
        >
          Encode
        </button>
      </div>

      {mode === 'decode' && (
        <>
          <textarea
            rows={4}
            className="w-full border border-border p-3 rounded-md mb-4 font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste JWT to decode..."
          />
          <div className="flex gap-2 mb-4">
            <Button onClick={handleDecode}>Decode</Button>
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
          </div>
        </>
      )}

      {mode === 'encode' && (
        <>
          <textarea
            rows={4}
            className="w-full border border-border p-3 rounded-md mb-3 font-mono text-sm bg-background text-foreground focus:outline-none"
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            placeholder='Header: { "alg": "HS256", "typ": "JWT" }'
          />
          <textarea
            rows={6}
            className="w-full border border-border p-3 rounded-md mb-3 font-mono text-sm bg-background text-foreground focus:outline-none"
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder='Payload: { "user": "navas", "admin": true }'
          />
          <div className="flex gap-2 mb-4">
            <Button onClick={handleEncode}>Encode</Button>
            <Button onClick={handleClear} variant="outline">
              Clear
            </Button>
          </div>
        </>
      )}

      {error && <p className="text-destructive mb-4 font-medium">{error}</p>}

      {mode === 'decode' && decodedValues.header.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-foreground mb-1">Decoded Header</h3>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">{decodedValues.header}</pre>
        </div>
      )}
      {mode === 'decode' && decodedValues.payload.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-foreground mb-1">Decoded Payload</h3>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">{decodedValues.payload}</pre>
        </div>
      )}

      {mode === 'encode' && token && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-foreground">Encoded JWT</h3>
            <button
              onClick={() => handleCopy(token)}
              className="text-sm text-muted-foreground hover:underline"
            >
              Copy
            </button>
          </div>
          <pre className="bg-muted p-4 rounded-md text-sm break-all overflow-auto">{token}</pre>
        </div>
      )}
    </div>
  );
}
