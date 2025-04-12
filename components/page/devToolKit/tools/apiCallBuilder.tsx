'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const LANGUAGES = ['JavaScript (fetch)', 'Python (requests)', 'cURL'];

export default function APIRequestBuilder() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [language, setLanguage] = useState('JavaScript (fetch)');
  const [snippet, setSnippet] = useState('');
  const [isBodyValid, setIsBodyValid] = useState(true);

  const generateSnippet = () => {
    let headerObject: { [key: string]: string | string[] } = {};
    headers.forEach((h) => {
      if (h.key) headerObject[h.key] = h.value;
    });
    const headerString = JSON.stringify(headerObject, null, 2);

    let parsedBody = {};
    if (method !== 'GET') {
      try {
        parsedBody = body ? JSON.parse(body) : {};
        setIsBodyValid(true);
      } catch (err) {
        setIsBodyValid(false);
        setSnippet('');
        return;
      }
    }

    let snippetText = '';

    switch (language) {
      case 'JavaScript (fetch)':
        snippetText = `fetch('${url}', {
  method: '${method}',
  headers: ${headerString},
  ${method !== 'GET' ? `body: JSON.stringify(${JSON.stringify(parsedBody, null, 2)}),` : ''}
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`;
        break;

      case 'Python (requests)':
        snippetText = `import requests

url = "${url}"
headers = ${headerString}
${method !== 'GET' ? `data = ${JSON.stringify(parsedBody, null, 2)}

` : ''}response = requests.${method.toLowerCase()}(url, ${
          method !== 'GET' ? 'json=data, ' : ''
        }headers=headers)
print(response.json())`;
        break;

      case 'cURL':
        const curlHeaders = headers
          .filter((h) => h.key)
          .map((h) => `-H "${h.key}: ${h.value}"`)
          .join(' ');
        snippetText = `curl -X ${method} ${curlHeaders} \\
  ${method !== 'GET' ? `-d '${JSON.stringify(parsedBody)}' \\\n  ` : ''}${url}`;
        break;

      default:
        snippetText = '';
    }

    setSnippet(snippetText);
  };

  const handleHeaderChange = (index: number, key: string, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = { key, value };
    setHeaders(newHeaders);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  return (
    <Card className="w-full mx-auto p-4 bg-white dark:bg-gray-900 border-none shadow-none rounded-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        HTTP & API Request Builder
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label className="mb-1 block text-gray-700 dark:text-gray-200">Method</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              {METHODS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2">
          <Label className="mb-1 block text-gray-700 dark:text-gray-200">URL</Label>
          <Input
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/data"
          />
        </div>
      </div>

      <div>
        <Label className="mb-1 block text-gray-700 dark:text-gray-200">Headers</Label>
        {headers.map((h, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <Input
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
              placeholder="Key"
              value={h.key}
              onChange={(e) => handleHeaderChange(i, e.target.value, h.value)}
            />
            <Input
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700"
              placeholder="Value"
              value={h.value}
              onChange={(e) => handleHeaderChange(i, h.key, e.target.value)}
            />
          </div>
        ))}
        <Button variant="outline" onClick={addHeader}>
          + Add Header
        </Button>
      </div>

      {method !== 'GET' && (
        <div>
          <Label className="mb-1 block text-gray-700 dark:text-gray-200">Request Body (JSON)</Label>
          <Textarea
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{ "key": "value" }'
            className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
              isBodyValid ? 'border-gray-300 dark:border-gray-700' : 'border-red-500'
            }`}
          />
          {!isBodyValid && (
            <p className="text-red-500 text-sm mt-1">
              Invalid JSON format. Please correct it before generating.
            </p>
          )}
        </div>
      )}

      <div>
        <Label className="mb-1 block text-gray-700 dark:text-gray-200">Generate Snippet For</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            {LANGUAGES.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={generateSnippet}>Generate Snippet</Button>

      {snippet && (
        <Card className="p-4 bg-gray-100 dark:bg-gray-800 relative mt-4">
          <Label className="text-gray-900 dark:text-gray-100">Generated Code</Label>
          <Button
            size="sm"
            className="absolute top-4 right-4"
            onClick={() => navigator.clipboard.writeText(snippet)}
          >
            Copy
          </Button>
          <pre className="mt-2 whitespace-pre-wrap p-4 rounded-md text-sm font-mono text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            {snippet}
          </pre>
        </Card>
      )}
    </Card>
  );
}
