'use client';

import { useState } from "react";

const toCamelCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());

const toPascalCase = (str: string) =>
  str
    .replace(/(\w)(\w*)/g, (_, firstChar, rest) => firstChar.toUpperCase() + rest.toLowerCase())
    .replace(/[^a-zA-Z0-9]/g, '');

const toSnakeCase = (str: string) =>
  str.trim().toLowerCase().replace(/\s+/g, "_");

const toKebabCase = (str: string) =>
  str.trim().toLowerCase().replace(/\s+/g, "-");

const toTitleCase = (str: string) =>
  str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());

export default function TextCaseConverter() {
  const [input, setInput] = useState('');
  const [converted, setConverted] = useState('');
  const [caseType, setCaseType] = useState('lowercase');

  const handleConvert = () => {
    let result = input;
    switch (caseType) {
      case 'uppercase':
        result = input.toUpperCase();
        break;
      case 'lowercase':
        result = input.toLowerCase();
        break;
      case 'camelCase':
        result = toCamelCase(input);
        break;
      case 'PascalCase':
        result = toPascalCase(input);
        break;
      case 'snake_case':
        result = toSnakeCase(input);
        break;
      case 'kebab-case':
        result = toKebabCase(input);
        break;
      case 'Title Case':
        result = toTitleCase(input);
        break;
    }
    setConverted(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(converted);
  };

  return (
    <div className="max-w-5xl mx-auto p-2  rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Text Case Converter</h2>
      <textarea
        rows={5}
        className="w-full border p-3 rounded-md mb-4 font-mono text-sm"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your text..."
      />
      <div className="flex gap-4 mb-4">
        <select
          className="border p-2 rounded-md"
          value={caseType}
          onChange={(e) => setCaseType(e.target.value)}
        >
          <option value="uppercase">UPPERCASE</option>
          <option value="lowercase">lowercase</option>
          <option value="camelCase">camelCase</option>
          <option value="PascalCase">PascalCase</option>
          <option value="snake_case">snake_case</option>
          <option value="kebab-case">kebab-case</option>
          <option value="Title Case">Title Case</option>
        </select>
        <button
          onClick={handleConvert}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Convert
        </button>
        <button
          onClick={handleCopy}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Copy
        </button>
      </div>
      {converted && (
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md border font-mono text-sm">
          {converted}
        </pre>
      )}
    </div>
  );
}
