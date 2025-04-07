'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <Card className="w-full mx-auto p-4 bg-white dark:bg-gray-900 border-none shadow-none rounded-xl space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mock Data Generator</h2>

      <div className="flex flex-wrap items-center gap-4">
        <Label htmlFor="recordCount">Number of Records:</Label>
        <Input
          id="recordCount"
          type="number"
          min={1}
          value={recordCount}
          onChange={(e) => setRecordCount(Number(e.target.value))}
          className="w-24"
        />
        <Button onClick={generateData}>Generate</Button>
        <Button onClick={handleCopy} variant="outline">Copy JSON</Button>
      </div>

      {mockData.length > 0 && (
        <CardContent className="space-y-2">
          <h4 className="font-semibold text-gray-700 dark:text-gray-200">Generated JSON</h4>
          <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-4 rounded-md border font-mono text-sm text-gray-900 dark:text-gray-100">
            {JSON.stringify(mockData, null, 2)}
          </pre>
        </CardContent>
      )}
    </Card>
  );
}
