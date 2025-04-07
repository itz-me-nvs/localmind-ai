'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

export default function FileToBase64Converter() {
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState('');
  const [error, setError] = useState('');
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('File size exceeds the maximum limit of 5MB.');
        setBase64('');
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError('');
      setBase64('');

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
    if (base64) navigator.clipboard.writeText(base64);
  };

  return (
    <Card className="w-full mx-auto p-2 border-none shadow-none space-y-4 bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">File to Base64 Converter</h2>

      <div className="space-y-2">
        <Label className="text-sm">Choose a file to convert (max 5MB)</Label>
        <Input
          type="file"
          accept=".txt,.pdf,.jpg,.jpeg,.png,.json,.csv,.xml,.doc,.docx,.xls,.xlsx"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={handleClear}>Clear</Button>
        {base64 && (
          <Button onClick={handleCopy} className="bg-green-600 hover:bg-green-700 text-white">
            Copy Base64
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {base64 && (
        <div className="space-y-2">
          <Label className="text-sm text-gray-900 dark:text-gray-200">Base64 Output</Label>
          <Textarea
            className="w-full h-60 font-mono text-sm bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
            value={base64}
            readOnly
          />
        </div>
      )}
    </Card>
  );
}