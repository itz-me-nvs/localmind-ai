'use client';

import { selectModel } from '@/lib/state/features/user/userSlice';
import { useAppSelector } from '@/lib/state/hooks';
import axios from 'axios';
import React, { useState } from 'react';

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

  const handleGenerate = async() => {
    if (!task.trim()) {
      setError('Please enter a Git task description.');
      return;
    }

    try {
      const lowerTask = task.toLowerCase();
      let result = null;


      result = await axios.post(
        "/api/ollama/generate",
        {
          model: selectedModel || "qwen2.5:0.5b",
          prompt: `Return only the Git command(s) for the task: ${JSON.stringify(lowerTask)}. Do not include any explanation, comments, or extra text. Output must be plain command(s) only.`,

          stream: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const gitCommandResponse = result?.data?.response || "";
      console.log(gitCommandResponse);
      setCommand(gitCommandResponse);
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

  const handleSelectTask = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTask(e.target.value);
  };

  return (
    <div className="max-w-5xl mx-auto p-2 rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Git Command Generator</h2>

      <label className="block mb-2 font-medium">Select Common Git Task</label>
      <select
        className="w-full p-2 border rounded-md mb-4"
        value={task}
        onChange={handleSelectTask}
      >
        <option value="">-- Choose a task --</option>
        {gitTasks.map(({ label, value }) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>

      <textarea
        className="w-full border p-3 rounded-md mb-4 font-mono"
        rows={4}
        placeholder="Or describe your own task here..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Generate Command
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Clear
        </button>
      </div>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {command && (
        <pre className="bg-gray-100 border rounded p-4 whitespace-pre-wrap font-mono text-sm">
          {command}
        </pre>
      )}
    </div>
  );
}
