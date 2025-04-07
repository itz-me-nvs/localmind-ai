'use client';

import { Button } from '@/components/ui/button';
import JSON5 from 'json5';
import { Check, Clipboard } from 'lucide-react';
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
    <div className="w-full mx-auto bg-white space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">JSON Formatter & Validator</h1>

      <div className="space-y-2">
        <label className="font-semibold text-gray-700">Raw JSON Input</label>
        <textarea
          rows={10}
          className="w-full border border-gray-300 focus:outline-none rounded-lg p-3 font-mono text-sm resize-y transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste or type your JSON here...'
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-between">

       <div className='flex gap-2'>
       <Button  onClick={handleFormat}
        
        >
          Format & Validate
        </Button>

        <Button  onClick={handleClear}
       variant={'outline'}
        
        >
          Clear
        </Button>
       </div>

        {formatted && (
          <Button
          variant={'ghost'}
            onClick={handleCopy}
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
          </Button>
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
