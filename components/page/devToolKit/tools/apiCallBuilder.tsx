'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  const generateSnippet = () => {
    let headerObject: {[key: string]: string | string[]} = {};
    headers.forEach(h => {
      if (h.key) headerObject[h.key] = h.value;
    });
    const headerString = JSON.stringify(headerObject, null, 2);

    let snippetText = '';

    switch (language) {
      case 'JavaScript (fetch)':
        snippetText = `fetch('${url}', {
  method: '${method}',
  headers: ${headerString},
  ${method !== 'GET' ? `body: JSON.stringify(${body || '{}'}),` : ''}
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`;
        break;
      case 'Python (requests)':
        snippetText = `import requests

url = "${url}"
headers = ${headerString}
${method !== 'GET' ? `data = ${body || '{}'}
` : ''}response = requests.${method.toLowerCase()}(url, ${method !== 'GET' ? 'json=data, ' : ''}headers=headers)
print(response.json())`;
        break;
      case 'cURL':
        const curlHeaders = headers
          .filter(h => h.key)
          .map(h => `-H "${h.key}: ${h.value}"`)
          .join(' ');
        snippetText = `curl -X ${method} ${curlHeaders} \
  ${method !== 'GET' ? `-d '${body || '{}'}' \
  ` : ''}${url}`;
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
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">HTTP & API Request Builder</h1>

      <Card className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Method</Label>
            <select
              className="w-full border p-2 rounded"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              {METHODS.map(m => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <Label>URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com/data" />
          </div>
        </div>

        <div>
          <Label>Headers</Label>
          {headers.map((h, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input
                placeholder="Key"
                value={h.key}
                onChange={(e) => handleHeaderChange(i, e.target.value, h.value)}
              />
              <Input
                placeholder="Value"
                value={h.value}
                onChange={(e) => handleHeaderChange(i, h.key, e.target.value)}
              />
            </div>
          ))}
          <Button variant="outline" onClick={addHeader}>+ Add Header</Button>
        </div>

        {(method !== 'GET') && (
          <div>
            <Label>Request Body (JSON)</Label>
            <Textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder='{ \"key\": \"value\" }'
            />
          </div>
          )
        }

        <div>
          <Label>Generate Snippet For</Label>
          <select
            className="w-full border p-2 rounded"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGES.map(l => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>

        <Button className="bg-blue-600 text-white" onClick={generateSnippet}>Generate Snippet</Button>
      </Card>

      {snippet && (
        <Card className="p-4">
          <Label>Generated Code</Label>
          <pre className="mt-2 whitespace-pre-wrap bg-gray-100 p-4 rounded-md text-sm font-mono">
            {snippet}
          </pre>
        </Card>
      )}
    </div>
  );
}