'use client';

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
    <div className="max-w-5xl mx-auto p-2 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">UUID Generator</h2>

      <div className="flex gap-4 items-center mb-4">
        <label htmlFor="count" className="text-sm font-medium">Count:</label>
        <input
          id="count"
          type="number"
          value={count}
          min={1}
          max={100}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-20 px-3 py-1 border rounded"
        />
        <button
          onClick={generateUUIDs}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Generate
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Clear
        </button>
        {uuids.length > 0 && (
          <button
            onClick={handleCopyAll}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Copy All
          </button>
        )}
      </div>

      {uuids.length > 0 && (
        <ul className="bg-gray-100 p-4 rounded font-mono text-sm space-y-1">
          {uuids.map((uuid, index) => (
            <li key={index}>{uuid}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
