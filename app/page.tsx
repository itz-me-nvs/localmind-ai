"use client";

import OllamaChat from "@/components/page/ollamaChat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChatModel } from "@/lib/model/chatModel";
import { EarthIcon, MoonIcon, PaperclipIcon, SunIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [input, setInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<ChatModel[]>([]);

  const inputContainerRef = useRef<HTMLFormElement>(null);
  const placeHolderRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const localTheme = localStorage.getItem("theme") || "light";
    setTheme(localTheme);
    document.documentElement.classList.toggle("dark", localTheme === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleInputChange = (e: React.FormEvent<HTMLDivElement>) => {
    const textContent = e.currentTarget.textContent || "";
    setInput(textContent);
    console.log(textContent.length, placeHolderRef);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(input);

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

  const ollamaChatCompletion = async () => {
    try {
      // const response = await axios.post(`/api/ollama`, {
      //   model: "qwen2.5:0.5b", // llama3.2:latest
      //   prompt: input,
      //   stream: true,
      // });

      const response = await fetch("/api/ollama", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "qwen2.5:0.5b", // llama3.2:latest
        prompt: input,
        stream: true,
        }),
      });

       const reader = response.body!.getReader();
      const decoder = new TextDecoder();

      let result = "";

      while(true){
        const { value } = await reader.read();
        const text = decoder.decode(value || new Uint8Array(),{stream: true});

        console.log("text", text);
      }




      // while (true) {
      //   const { value, done } = await reader.read();
      //   console.log("value", value);

      // }

      // const rawResponse = await response.text();
      // console.log("rawResponse", rawResponse);

      // const responseObjects = rawResponse.trim().split("\n").map(line => JSON.parse(line));
      // console.log("responseObjects", responseObjects);

      // // console.log("responseObjects", responseObjects);

      // responseObjects.forEach((response) => {
      //   try {

      //     const jsonString = response.data.trim().split("\n")
      //     const parsedResponses = jsonString.map((json:any) => JSON.parse(json));

      //     console.log("parsedResponses", parsedResponses);


      //   } catch (error) {
      //     console.error(error);
      //   }
      // }
      // );



      // const reader = response.body!.getReader();
      // const decoder = new TextDecoder();

      // let result = "";

      // while (true) {
      //   const { value, done } = await reader.read();
      //   if (done) break;

      //   const chunk = decoder.decode(value, {stream: true});
      //   const data = chunk.trim().split("\n").filter(Boolean);

      //   console.log(data);


      //   for (const line of data) {
      //    try {
      //     const parsed = JSON.parse(line);
      //     console.log("Parsed Chunk:", parsed.response);

      //     result += parsed.response;

      //     console.log("Streamed Chunk:", parsed.response);
      //    } catch (error) {
      //       console.error(error);
      //    }
      //   }
      // }

      // console.log(result);


      // setChat((prev) => [
      //   ...prev,
      //   {
      //     id: prev.length + 1,
      //     name: response.data.data.response || "",
      //     role: "Assistant",
      //     isError: false,
      //   },
      // ]);

      // setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      const { response } = error;

      let message = "";

      if (!response) {
        toast.error("Something went wrong");
        message = "Something went wrong,";
      }
      toast.error(response.data?.error || "Something went wrong");
      message = response.data?.error || "Something went wrong,";

      setChat((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          name: message,
          role: "Assistant",
          isError: true,
        },
      ]);
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
          <Select>
            <SelectTrigger className="w-[180px] focus:ring-0 dark:border-background-message dark:border">
              <SelectValue placeholder="Models" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">llama 3</SelectItem>
              <SelectItem value="2">deepseek</SelectItem>
              <SelectItem value="3">claude 2</SelectItem>
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
          <OllamaChat chatList={chat} />
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
        } -translate-y-1/2 p-3 absolute transition-all duration-700 m-auto -translate-x-1/2 left-1/2 flex flex-col border border-gray-300 dark:border-gray-900 shadow-lg rounded-lg bg-background max-w-screen-md w-full`}
      >
        <div
          contentEditable={true}
          translate="no"
          onInput={handleInputChange}
          onKeyDown={handleKeyDown}
          suppressContentEditableWarning={true}
          className="group ProseMirror border-none focus-visible:ring-0 focus:outline-none break-words overflow-auto min-h-[44px] max-h-32"
          id="prompt-textarea"
          data-virtualkeyboard="true"
        >
          <p
            ref={placeHolderRef}
            className="whitespace-pre-wrap text-gray-500 empty:before:content-[attr(data-placeholder)] dark:text-gray-400 placeholder"
            data-placeholder="Ask a question"
          ></p>
        </div>

        <div className="flex justify-between items-center mt-3 px-2">
          <div className="flex items-center gap-3">
            <div className="relative p-2 rounded-lg cursor-pointer bg-gray-200 dark:bg-background-secondary">
              <PaperclipIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </div>

            <div className="relative p-2 rounded-lg cursor-pointer bg-gray-200 dark:bg-background-secondary">
              <EarthIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
