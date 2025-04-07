"use client";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/comboBox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SNIPPETS } from "@/lib/constants/codeSnippets.constant";
import { useState } from "react";

export default function CommonSnippets() {
  const [selectedKey, setSelectedKey] = useState("debounce");
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({
    functionName: "debounce",
    waitTime: "300",
    arrayName: "myArray",
    chunkSize: "2",
  });

  const snippet = SNIPPETS[selectedKey as keyof typeof SNIPPETS];
  const code = snippet.template(inputValues as any);

  const handleSnippetChange = (key: string) => {
    setSelectedKey(key);
    const { inputs, defaultValues } = SNIPPETS[key as keyof typeof SNIPPETS];
    const newInputValues: { [key: string]: string } = {};
    inputs.forEach((input, i) => {
      newInputValues[input] = defaultValues[i] || "";
    });
    setInputValues(newInputValues);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="max-w-5xl mx-auto p-3">
      <h2 className="text-3xl font-bold mb-6 text-foreground">
        Common Code Snippets
      </h2>

      <div className="mb-4">
        <Label className="mb-1 block text-sm text-muted-foreground">
          Select Snippet
        </Label>
     
        <Combobox defaultValue="debounce" comboBoxList={Object.keys(SNIPPETS).map((key) => ({value: key, label: SNIPPETS[key as keyof typeof SNIPPETS].title}))} selectedItemHandler={handleSnippetChange}/>
      </div>

      <div className="grid gap-4 mb-4">
        {snippet.inputs.map((inputName) => (
          <Input
            key={inputName}
            name={inputName}
            value={inputValues[inputName] || ""}
            onChange={handleInputChange}
            placeholder={`Enter ${inputName}`}
          />
        ))}
      </div>

      <Button onClick={handleCopy} className="mb-4">
        Copy Snippet
      </Button>

      <ScrollArea className="max-h-96 rounded-md border bg-muted px-4 py-3 font-mono text-sm overflow-auto">
        <pre className="whitespace-pre-wrap">{code}</pre>
      </ScrollArea>
    </div>
  );
}
