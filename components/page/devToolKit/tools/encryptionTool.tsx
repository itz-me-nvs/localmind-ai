'use client';

import CryptoJS from "crypto-js";
import { useState } from "react";

export default function EncryptionTester() {
  const [text, setText] = useState('');
  const [secret, setSecret] = useState('');
  const [encrypted, setEncrypted] = useState('');
  const [decrypted, setDecrypted] = useState('');
  const [error, setError] = useState('');

  const handleEncrypt = () => {
    try {
      if (!secret) {
        setError('Secret key is required for encryption.');
        return;
      }
      const enc = CryptoJS.AES.encrypt(text, secret).toString();
      setEncrypted(enc);
      setError('');
    } catch (err) {
      setError('Encryption error: ' + err);
    }
  };

  const handleDecrypt = () => {
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, secret);
      const dec = bytes.toString(CryptoJS.enc.Utf8);
      if (!dec) throw new Error("Decryption failed.");
      setDecrypted(dec);
      setError('');
    } catch (err) {
      setError('Decryption error: ' + err);
    }
  };

  const handleClear = () => {
    setText('');
    setSecret('');
    setEncrypted('');
    setDecrypted('');
    setError('');
  };

  return (
    <div className="max-w-5xl mx-auto p-2 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Encryption / Decryption Tester</h2>
      <input
        type="text"
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border p-3 rounded-md mb-3"
      />
      <input
        type="text"
        placeholder="Enter secret key"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        className="w-full border p-3 rounded-md mb-3"
      />
      <div className="flex gap-2 mb-4">
        <button onClick={handleEncrypt} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Encrypt
        </button>
        <button onClick={handleDecrypt} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Decrypt
        </button>
        <button onClick={handleClear} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
          Clear
        </button>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {encrypted && (
        <div className="mb-2">
          <h4 className="font-semibold">Encrypted:</h4>
          <pre className="bg-gray-100 p-3 rounded-md break-all">{encrypted}</pre>
        </div>
      )}
      {decrypted && (
        <div className="mb-2">
          <h4 className="font-semibold">Decrypted:</h4>
          <pre className="bg-gray-100 p-3 rounded-md">{decrypted}</pre>
        </div>
      )}
    </div>
  );
}
