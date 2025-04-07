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
    <Card className="w-full mx-auto p-4 bg-white dark:bg-gray-900 border-none shadow-none rounded-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Git Command Generator</h1>

      <div>
        <Label className="mb-1 block">Select Common Git Task</Label>
        <Select onValueChange={setTask} value={task}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a task" />
          </SelectTrigger>
          <SelectContent>
            {gitTasks.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-1 block">Or Describe Your Own Task</Label>
        <Textarea
          rows={3}
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

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {command && (
        <Card className="p-4 bg-gray-100 dark:bg-gray-800 relative">
          <Label className="text-gray-900 dark:text-gray-100">Generated Git Command</Label>
          <Button
            size="sm"
            className="absolute top-4 right-4"
            onClick={() => {
              navigator.clipboard.writeText(command);
            }}
          >
            Copy
          </Button>
          <pre className="mt-2 whitespace-pre-wrap p-4 rounded-md text-sm font-mono text-gray-900 dark:text-gray-100">
            {command}
          </pre>
        </Card>
      )}
    </Card>
  );
}
