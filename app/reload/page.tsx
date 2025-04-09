"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OllamaNotRunningPage() {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCopy = () => {
    navigator.clipboard.writeText("ollama serve");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background text-foreground">
      <div className="max-w-xl w-full space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">
          🚫 Ollama is not running
        </h1>
        <p className="text-muted-foreground text-lg">
          To use the application, you need to start Ollama locally.
        </p>

        <Card className="bg-muted">
          <CardContent className="py-6 space-y-4">
            <ol className="list-decimal text-left space-y-2 pl-6 text-base">
              <li>Open your terminal.</li>
              <li>Run the following command:</li>
            </ol>

            <div className="bg-black text-white px-4 py-3 rounded-lg flex items-center justify-between text-sm font-mono">
              <span>ollama serve</span>
              <Button
                variant="secondary"
                size="sm"
                className="ml-4"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <ClipboardCheck className="h-4 w-4 mr-1" /> Copied
                  </>
                ) : (
                  <>
                    <Clipboard className="h-4 w-4 mr-1" /> Copy
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-lg">
          Haven’t installed Ollama yet? Get it here:
        </p>
        <a
          href="https://ollama.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="default" size="lg">
            Install Ollama
          </Button>
        </a>

        <Button
          onClick={() => router.push("/")}
          variant="outline"
          size="lg"
          className="mt-4 mx-2"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}
