"use client";

import OllamaChat from "@/components/page/ollamaChat";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OLLAMA_BASE_URL } from "@/lib/constants/common.constant";
import {
  ChatModel,
  OllamaAPIChatRequestModel,
  OllamaModelList,
} from "@/lib/model/chatModel";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  CheckCheckIcon,
  CopyIcon,
  EarthIcon,
  MoonIcon,
  PlusIcon,
  SparklesIcon,
  SunIcon,
  WrenchIcon,
  XIcon,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const FormScheme = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required",
  }),
});

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [input, setInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<ChatModel[]>([
    {
      role: "system",
      name: "Act as an AI Assistant and provide clear, concise, and accurate responses in English. Maintain a professional and respectful tone, avoiding offensive language. If you do not know the answer, simply respond with 'I don't know' without making up information.",
      id: 0,
      isError: false,
    },
  ]);
  const [modelList, setModelList] = useState<OllamaModelList[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [promptModelOpen, setPromptModelOpen] = useState<boolean>(false);
  const [promptEnhanceResult, setPromptEnhanceResult] = useState<string>("");

  const inputContainerRef = useRef<HTMLFormElement>(null);
  const placeHolderRef = useRef<HTMLParagraphElement>(null);
  const [promptCopyStatus, setPromptCopyStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Prompt Enhancer Formgroup
  const form = useForm<z.infer<typeof FormScheme>>({
    resolver: zodResolver(FormScheme),
    defaultValues: {
      prompt: "",
    },
  });

  const MAX_MESSAGES = 5;
  const MAX_TOKEN = 4000;

  useEffect(() => {
    const localTheme = localStorage.getItem("theme") || "light";
    setTheme(localTheme);
    document.documentElement.classList.toggle("dark", localTheme === "dark");

    const getOllamaModels = async () => {
      const response = await axios.get(`api/ollama/getModels`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      let modelArr: OllamaModelList[] = [];

      if (data?.models) {
        data?.models.forEach((model: OllamaModelList) => {
          modelArr.push({
            model: model.model,
            size: model.size,
            id: model.model,
          });
        });

        setModelList(modelArr);
      }
    };

    getOllamaModels();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (promptModelOpen) {
      form.reset(); // reset the form on intial render
      setPromptEnhanceResult("");
    }
  }, [promptModelOpen]);

  const handleInputChange = (e: React.FormEvent<HTMLDivElement>) => {
    const textContent = e.currentTarget.textContent || "";
    setInput(textContent);

    if (placeHolderRef.current && textContent.length <= 0) {
      placeHolderRef.current.setAttribute("data-placeholder", "Ask anything");
      placeHolderRef.current.textContent = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleModelChange = (name: string) => {
    setSelectedModel(name);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitted(true);
    setInput("");

    if (placeHolderRef.current) {
      placeHolderRef.current.setAttribute(
        "data-placeholder",
        "Ask anything..."
      );
      placeHolderRef.current.textContent = "";
    }

    setChat((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: input,
        role: "user",
        isError: false,
      },
    ]);

    setIsLoading(true);
    ollamaChatCompletion();
  };

  const summarizeChatHistory = async (
    maxSummaryToken: number = 1000
  ): Promise<string> => {
    if (chat.length > 1) {
      let content = chat
        .slice(1, -MAX_MESSAGES)
        .map((item: ChatModel) => `${item.role}: ${item.name}`)
        .join(" ");

      const response = await axios.post(
        "/api/ollama/generate",
        {
          model: selectedModel || "qwen2.5:0.5b",
          prompt: `Summarize the following chat history: ${content}`,
          stream: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const fullSummary = response?.data?.response || "";
      console.log(fullSummary);

      if (fullSummary.length <= maxSummaryToken) return fullSummary;

      const summary = fullSummary.substring(0, maxSummaryToken);

      return `${summary}...`;
    }

    return "";
  };

  const ollamaChatCompletion = async () => {
    try {
      let messages: OllamaAPIChatRequestModel[] = [];
      let chatSummary = "";

      chatSummary = await summarizeChatHistory();
      messages = [
        {
          role: "system",
          content: `Act as an AI Assistant and provide clear, concise, and accurate responses in English. Maintain a professional and respectful tone, avoiding offensive language. If you do not know the answer, simply respond with 'I don't know' without making up information. ${chatSummary}`,
        },
        {
          role: "user",
          content: input,
        },
      ];
      console.log(chatSummary);

      const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel || "qwen2.5:0.5b", // Adjust model as needed
          messages: messages ?? [],
          stream: true,
        }),
      });

      if (!response.body) throw new Error("Readable stream not available");
      setIsLoading(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      setChat((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: "",
          role: "Assistant",
          isError: false,
        },
      ]);

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });

        // Ensure new messages are properly split
        const messages = textChunk.trim().split("\n").filter(Boolean);

        for (const message of messages) {
          try {
            const parsed = JSON.parse(message);
            if (parsed.message) {
              result += parsed.message?.content;

              setChat((prev) => {
                const updatedChat = [...prev];

                return updatedChat.map((_, index) => {
                  if (index == updatedChat.length - 1) {
                    return {
                      ..._,
                      name: result,
                    };
                  }
                  return _;
                });
              });
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setIsLoading(false);
    }
  };

  async function OnSubmitPromptEnhance(data: z.infer<typeof FormScheme>) {
    if (data.prompt) {
      const response = await axios.post("/api/ollama/generate", {
        model: selectedModel || "qwen2.5:0.5b",
        prompt: `Improve the clarity, effectiveness, and engagement of the following prompt **without answering it**. Do not provide a response to the prompt itself; just refine its wording for better AI interaction:\n\n"${data.prompt}"`,
        stream: false,
      });

      const enhancedPrompt = response?.data?.response || "";
      setPromptEnhanceResult(enhancedPrompt);

      console.log("response", enhancedPrompt);
    }
  }

  const handleCopyPromptEnhance = async () => {
    try {
      await navigator.clipboard.writeText(promptEnhanceResult);
      setPromptCopyStatus("success");
      setTimeout(() => {
        setPromptCopyStatus("idle");
      }, 1000);
    } catch (error) {
      setPromptCopyStatus("error");
      console.error("Failed to copy text:", error);
    }
  };

  return (
    <div className="h-screen p-3 mb-3 bg-background-secondary text-gray-900 dark:text-gray-100 overflow-hidden">
      <header className="flex justify-between items-center">
        {theme === "light" ? (
          <SunIcon
            className="h-6 w-6 cursor-pointer text-yellow-500"
            onClick={() => setTheme("dark")}
          />
        ) : (
          <MoonIcon
            className="h-6 w-6 cursor-pointer text-blue-300"
            onClick={() => setTheme("light")}
          />
        )}

        <div className="flex items-center space-x-3">
          <Select onValueChange={(value) => handleModelChange(value)}>
            <SelectTrigger className="w-[180px]  focus:ring-0 dark:border-background-message dark:border">
              <SelectValue placeholder="Models" />
            </SelectTrigger>
            <SelectContent>
              {modelList.map((item, index) => (
                <SelectItem key={item.id} value={item.model}>
                  {item.model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <main
        className={`relative flex bg-red ${
          isSubmitted
            ? "justify-start min-h-[80vh]"
            : "justify-center min-h-screen"
        } items-center h-full flex-col`}
      >
        {isSubmitted ? (
          <OllamaChat chatList={chat} isLoading={isLoading} />
        ) : (
          <div className="flex items-center justify-center p-2 rounded-lg">
            <Image
              src="/logo/logo.svg" // Ensure the correct path is set
              alt="Ollama UI"
              width={150}
              height={150}
            />
          </div>
        )}
      </main>

      <form
        onSubmit={handleSubmit}
        ref={inputContainerRef}
        className={` ${
          isSubmitted ? "top-[90%]" : "top-[70%]"
        } -translate-y-1/2 p-3 absolute transition-all duration-300 m-auto -translate-x-1/2 left-1/2 flex flex-col border border-gray-300 dark:border-gray-900 shadow-lg rounded-lg bg-background max-w-screen-md w-full`}
      >
        <div
          contentEditable={true}
          translate="no"
          onInput={handleInputChange}
          onKeyDown={handleKeyDown}
          suppressContentEditableWarning={true}
          className="group flex items-center ProseMirror border-none focus-visible:ring-0 focus:outline-none break-words overflow-auto min-h-[44px] max-h-32"
          id="prompt-textarea"
          data-virtualkeyboard="true"
        >
          <p
            ref={placeHolderRef}
            className="whitespace-pre-wrap text-gray-500 empty:before:content-[attr(data-placeholder)] dark:text-gray-400 placeholder ml-[10px]"
            data-placeholder="Ask a question"
          ></p>
        </div>

        <div className="flex justify-between items-center mt-3 px-2">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 relative py-2 px-3 rounded-lg cursor-pointer bg-gray-200 dark:bg-background-secondary"
              onClick={() => setPromptModelOpen(true)}
            >
              <PlusIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300">Prompt</span>
            </div>

            <div className="relative py-2 px-3 flex items-center gap-2 rounded-lg cursor-pointer bg-gray-100 dark:bg-background-secondary">
              <WrenchIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300">Tools</span>
            </div>

            <div className="relative py-2 px-3 flex items-center gap-2 rounded-lg cursor-pointer bg-gray-100 dark:bg-background-secondary opacity-70 pointer-events-none">
              <EarthIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300">Search</span>
            </div>
          </div>
        </div>
      </form>

      <Dialog open={promptModelOpen} onOpenChange={setPromptModelOpen}>
        <DialogContent className="max-w-[600px] max-h-[600px] h-auto overflow-auto">
          <DialogHeader>
            <DialogTitle>
              Prompt Enhancer{" "}
              {/* <Badge className="ml-1" variant="secondary">
                New
              </Badge> */}
            </DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(OnSubmitPromptEnhance)}
                className="grid grid-cols-4 items-center gap-4"
              >
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <Input
                        className="focus-visible:ring-0"
                        placeholder="Type your prompt here."
                        {...field}
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <SparklesIcon className="h-5 w-5" />
                  <span>Enhance</span>
                </Button>
              </form>
            </Form>
          </div>
          <DialogFooter>
            <div className="grid w-full gap-2 relative">
              <Textarea
                rows={1}
                cols={1}
                readOnly
                value={promptEnhanceResult}
                className="min-h-[80px] focus-visible:ring-0 pr-10"
              />
              {promptCopyStatus == "idle" && (
                <CopyIcon
                  className="h-5 w- absolute top-2 right-2 cursor-pointer"
                  onClick={handleCopyPromptEnhance}
                />
              )}

              {promptCopyStatus == "success" && (
                <CheckCheckIcon
                  className="h-5 w- absolute top-2 right-2"
                  onClick={handleCopyPromptEnhance}
                />
              )}

              {promptCopyStatus == "error" && (
                <XIcon
                  className="h-5 w- absolute top-2 right-2"
                  onClick={handleCopyPromptEnhance}
                />
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
