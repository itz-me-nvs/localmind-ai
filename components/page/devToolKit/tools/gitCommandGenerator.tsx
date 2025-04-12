'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { selectModel } from '@/lib/state/features/user/userSlice';
import { useAppSelector } from '@/lib/state/hooks';
import axios from 'axios';
import { useState } from 'react';

const gitTasks = [
  { label: 'Create New Branch and Push', value: 'create new branch and push' },
  { label: 'Commit Changes', value: 'commit changes' },
  { label: 'Push Changes', value: 'push changes' },
  { label: 'Pull Latest', value: 'pull latest' },
  { label: 'Clone Repository', value: 'clone repository' },
  { label: 'Merge Branches', value: 'merge branches' },
  { label: 'Rebase Branch', value: 'rebase branch' },
];

export default function GitCommandGenerator() {
  const [task, setTask] = useState('');
  const [command, setCommand] = useState('');
  const [error, setError] = useState('');
  const selectedModel = useAppSelector(selectModel);

  const handleGenerate = async () => {
    if (!task.trim()) {
      setError('Please enter or select a Git task.');
      return;
    }

    try {
      const response = await axios.post(
        '/api/ollama/generate',
        {
          model: selectedModel || 'qwen2.5:0.5b',
          prompt: `Return only the Git command(s) for the task: ${JSON.stringify(
            task.toLowerCase()
          )}. Do not include any explanation, comments, or extra text. Output must be plain command(s) only.`,
          stream: false,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const gitCommand = response?.data?.response || '';
      setCommand(gitCommand);
      setError('');
    } catch (err) {
      setError('Something went wrong.');
      setCommand('');
    }
  };

  const handleClear = () => {
    setTask('');
    setCommand('');
    setError('');
  };

  return (
    <Card className="w-full mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl space-y-6 transition-colors duration-300">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Git Command Generator</h1>

      <div>
        <Label className="mb-1 block text-gray-700 dark:text-gray-300">Select Common Git Task</Label>
        <Select onValueChange={setTask} value={task}>
          <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            <SelectValue placeholder="Choose a task" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
            {gitTasks.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1 block text-gray-700 dark:text-gray-300">Or Describe Your Own Task</Label>
        <Textarea
          rows={3}
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          placeholder="E.g., create a new branch and push to remote"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleGenerate}>Generate Command</Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {command && (
        <Card className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative rounded-xl transition-all duration-300">
          <Label className="text-gray-800 dark:text-gray-200">Generated Git Command</Label>
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-4 right-4"
            onClick={() => navigator.clipboard.writeText(command)}
          >
            Copy
          </Button>
          <pre className="mt-2 whitespace-pre-wrap p-4 rounded-md text-sm font-mono text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900">
            {command}
          </pre>
        </Card>
      )}
    </Card>
  );
}
