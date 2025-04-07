'use client';

import JSON5 from 'json5';
import { Check, Clipboard, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function JSONFormatter() {
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
        console.log("value", input);
        
     if(!input){
       setError('❌ Input is empty');
       setFormatted('');
       return
     }

     const parsed = JSON5.parse(input);
     const pretty = JSON.stringify(parsed, null, 2);
     setFormatted(pretty);
     setError('');
    } catch (err: any) {
      setError('❌ Invalid JSON: ' + err.message);
      setFormatted('');
    }
  };

  const handleClear = () => {
    setInput('');
    setFormatted('');
    setError('');
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">🛠 JSON Formatter & Validator</h1>

      <div className="space-y-2">
        <label className="font-semibold text-gray-700">Raw JSON Input</label>
        <textarea
          rows={10}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-blue-200 focus:ring-2 rounded-lg p-3 font-mono text-sm resize-y transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste or type your JSON here...'
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleFormat}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
        >
          Format & Validate
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-200 hover:bg-gray-300 text-black px-5 py-2 rounded-lg transition flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Clear
        </button>
        {formatted && (
          <button
            onClick={handleCopy}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Clipboard className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="text-red-600 font-medium bg-red-100 p-3 rounded-lg border border-red-300">
          {error}
        </div>
      )}

      {formatted && (
        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Formatted Output</label>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-lg border font-mono text-sm max-h-[500px] overflow-auto">
            {formatted}
          </pre>
        </div>
      )}
    </div>
  );
}
