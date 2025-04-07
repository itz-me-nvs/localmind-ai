'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <Card className="w-full mx-auto p-4 bg-white dark:bg-gray-900 border-none shadow-none rounded-xl space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Encryption / Decryption Tester</h2>

      <div className="space-y-2">
        <Label htmlFor="text">Text</Label>
        <Input
          id="text"
          type="text"
          placeholder="Enter text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="secret">Secret Key</Label>
        <Input
          id="secret"
          type="text"
          placeholder="Enter secret key"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button onClick={handleEncrypt}>Encrypt</Button>
        <Button onClick={handleDecrypt}>Decrypt</Button>
        <Button onClick={handleClear} variant="secondary">Clear</Button>
      </div>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

      {encrypted && (
        <CardContent className="space-y-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-200">Encrypted</h4>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md break-all text-sm text-gray-900 dark:text-gray-100">
            {encrypted}
          </pre>
        </CardContent>
      )}

      {decrypted && (
        <CardContent className="space-y-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-200">Decrypted</h4>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm text-gray-900 dark:text-gray-100">
            {decrypted}
          </pre>
        </CardContent>
      )}
    </Card>
  );
}