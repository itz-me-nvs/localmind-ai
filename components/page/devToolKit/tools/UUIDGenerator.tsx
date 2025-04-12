'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function UUIDGenerator() {
  const [uuids, setUUIDs] = useState<string[]>([]);
  const [count, setCount] = useState(1);

  const generateUUIDs = () => {
    const generated = Array.from({ length: count }, () =>
      typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : generateUUIDv4Fallback()
    );
    setUUIDs(generated);
  };

  function generateUUIDv4Fallback(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const handleCopyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
  };

  const handleClear = () => {
    setUUIDs([]);
  };

  return (
    <Card className="w-full mx-auto border-none shadow-none bg-white dark:bg-gray-900 space-y-6 p-4 rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">UUID Generator</h1>

      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-col space-y-1">
          <Label htmlFor="count" className="text-sm text-gray-700 dark:text-gray-200">Count</Label>
          <Input
            id="count"
            type="number"
            value={count}
            min={1}
            max={100}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-24 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>
        <Button onClick={generateUUIDs}>
          Generate
        </Button>
        <Button onClick={handleClear} variant="secondary" className="bg-gray-300 dark:bg-gray-700 dark:text-white">
          Clear
        </Button>
        {uuids.length > 0 && (
          <Button onClick={handleCopyAll} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-100">
            Copy All
          </Button>
        )}
      </div>

      {uuids.length > 0 && (
        <CardContent className="space-y-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Generated UUIDs</h3>
          <ul className="bg-gray-100 dark:bg-gray-800 p-4 rounded font-mono text-sm space-y-1 text-gray-800 dark:text-gray-100">
            {uuids.map((uuid, index) => (
              <li key={index}>{uuid}</li>
            ))}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}
