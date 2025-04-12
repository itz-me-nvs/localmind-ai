'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const toCamelCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());

const toPascalCase = (str: string) =>
  str
    .replace(/(\w)(\w*)/g, (_, firstChar, rest) => firstChar.toUpperCase() + rest.toLowerCase())
    .replace(/[^a-zA-Z0-9]/g, '');

const toSnakeCase = (str: string) =>
  str.trim().toLowerCase().replace(/\s+/g, '_');

const toKebabCase = (str: string) =>
  str.trim().toLowerCase().replace(/\s+/g, '-');

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
    <Card className="w-full mx-auto border-none shadow-none bg-white dark:bg-gray-900 space-y-6 p-4 rounded-xl">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Text Case Converter</h1>

      <Textarea
        rows={5}
        className="font-mono text-sm resize-y outline-none focus:outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your text..."
      />

      <div className="flex flex-wrap gap-4 items-center">
        <Select value={caseType} onValueChange={setCaseType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select case type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="uppercase">UPPERCASE</SelectItem>
            <SelectItem value="lowercase">lowercase</SelectItem>
            <SelectItem value="camelCase">camelCase</SelectItem>
            <SelectItem value="PascalCase">PascalCase</SelectItem>
            <SelectItem value="snake_case">snake_case</SelectItem>
            <SelectItem value="kebab-case">kebab-case</SelectItem>
            <SelectItem value="Title Case">Title Case</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleConvert}>Convert</Button>
        <Button onClick={handleCopy} variant="secondary">Copy</Button>
      </div>

      {converted && (
        <CardContent className="space-y-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">Converted Output</h3>
          <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-4 rounded-md border font-mono text-sm text-gray-800 dark:text-gray-100">
            {converted}
          </pre>
        </CardContent>
      )}
    </Card>
  );
}