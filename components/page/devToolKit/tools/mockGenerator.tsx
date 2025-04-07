'use client';

import { faker } from '@faker-js/faker';
import { useState } from 'react';

export default function MockDataGenerator() {
  const [recordCount, setRecordCount] = useState(5);
  const [mockData, setMockData] = useState<any[]>([]);

  const generateData = () => {
    const data = Array.from({ length: recordCount }).map(() => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.country()}`,
      company: faker.company.name(),
      date: faker.date.anytime().toISOString(),
    }));
    setMockData(data);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(mockData, null, 2));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Mock Data Generator</h2>
      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="recordCount" className="text-sm font-medium">Number of Records:</label>
        <input
          id="recordCount"
          type="number"
          min={1}
          className="border rounded p-2 w-24"
          value={recordCount}
          onChange={(e) => setRecordCount(Number(e.target.value))}
        />
        <button onClick={generateData} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Generate
        </button>
        <button onClick={handleCopy} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
          Copy JSON
        </button>
      </div>
      {mockData.length > 0 && (
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md border font-mono text-sm">
          {JSON.stringify(mockData, null, 2)}
        </pre>
      )}
    </div>
  );
}
