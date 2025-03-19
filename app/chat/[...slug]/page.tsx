"use client";

import ToolsModal from "@/components/page/dialogs/toolsModal";
import OllamaChat from "@/components/page/ollamaChat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  API_ERROR_CODE,
  OLLAMA_BASE_URL,
} from "@/lib/constants/common.constant";
import {
  ChatModel,
  OllamaAPIChatRequestModel,
  OllamaModelList,
} from "@/lib/model/chatModel";
import { addMessage, getMessages } from "@/lib/services/db/indexedDB";
import {
  selectTheme,
  toggleTheme,
} from "@/lib/state/features/theme/themeSlice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
// import { addMessage, getMessages } from "@/lib/services/db/indexedDB";
import axios, { AxiosError } from "axios";
import {
  Columns2Icon,
  EarthIcon,
  MessageSquareIcon,
  MoonIcon,
  PencilLine,
  PlusIcon,
  SearchIcon,
  SunIcon,
  WrenchIcon
} from "lucide-react";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";


export default function ChatPage({ slugParam }: { slugParam: string }) {
  const [input, setInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<ChatModel[]>([
    {
      role: "system",
      content: "Act as an AI Assistant and provide clear, concise, and accurate responses in English. Maintain a professional and respectful tone, avoiding offensive language. If you do not know the answer, simply respond with 'I don't know' without making up information.",
      id: 0,
      isError: false,
    },
  ]);
  const [modelList, setModelList] = useState<OllamaModelList[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [promptModelOpen, setPromptModelOpen] = useState<boolean>(false);
  const [toolModelOpen, setToolModelOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const inputContainerRef = useRef<HTMLFormElement>(null);
  const placeHolderRef = useRef<HTMLParagraphElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatID, setChatID] = useState("");

  const theme = useAppSelector(selectTheme);
  const dispatch = useAppDispatch();
  // const router = useRouter();
  const params = useParams()
  const slug = params.slug as string[] | undefined;

  const chatHistory = [
    { id: 1, title: "Authentication Implementation", date: "Today" },
    { id: 2, title: "API Routes Discussion", date: "Yesterday" },
    { id: 3, title: "Database Setup", date: "2 days ago" },
  ];



  const MAX_MESSAGES = 5;
  const MAX_TOKEN = 4000;

  useEffect(() => {
    // if(params.slug)
    console.log("slug", slug);

    if (!slug) {
      console.log("here");
      const chatUid = uuidv4();
    setChatID(chatUid);

    } else {
      fetchMessages(slug[0]);
      setChatID(slug[0]);
    }
  }, []);

  useEffect(() => {
    const getOllamaModels = async () => {
      try {
        const response = await axios.get(`/api/ollama/getModels`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("response", response);

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
      } catch (error: any) {
        const response = error?.response;
        if (API_ERROR_CODE.INTERNAL_SERVER_ERROR === response?.status) {
          toast("Internal Server Error", {
            style: {
              backgroundColor: "hsl(var(--destructive))",
              color: "hsl(var(--destructive-foreground))",
            },
          });
        } else if (API_ERROR_CODE.SOMETHING_WENT_WRONG == response?.status) {
          // error style
          toast("Something went wrong", {
            style: {
              backgroundColor: "hsl(var(--destructive))",
              color: "hsl(var(--destructive-foreground))",
            },
          });
        } else if (API_ERROR_CODE.MODEL_NOT_FOUND == response?.status) {
          redirect("/reload");
        }
      }
    };

    getOllamaModels();
  }, []);

  // useEffect(() => {
  //   if (promptModelOpen) {
  //     form.reset(); // reset the form on intial render
  //     setPromptEnhanceResult("");
  //   }
  // }, [promptModelOpen]);

  const fetchMessages = async (chatId: string) => {
    let updatedChats: ChatModel[] = [{
      role: "system",
      content: "Act as an AI Assistant and provide clear, concise, and accurate responses in English. Maintain a professional and respectful tone, avoiding offensive language. If you do not know the answer, simply respond with 'I don't know' without making up information.",
      id: 0,
      isError: false,
    },];
    const loadMessages = await getMessages(chatId);
    if(loadMessages){
      console.log("loadMessages", loadMessages);
      loadMessages.messages.forEach((message: any)=> {
        const chatMessage = JSON.parse(message.message);
        console.log("chatMessage", chatMessage);

        if(chatMessage && chatMessage.length > 0){
          setIsSubmitted(true);

          chatMessage.forEach((item: ChatModel) => {
            updatedChats.push({
              id: updatedChats.length + 1,
              content: item.content,
              isError: false,
              role: item.role
            })
          });

          setChat(updatedChats);
        }
      })
    }
  };

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
        content: input,
        role: "user",
        isError: false,
      },
    ]);

    setIsLoading(true);

    if (chat.length - 1 < 1) {
      const newPath = `/chat/${chatID}`;
      window.history.replaceState(null, "", newPath);
    }
    ollamaChatCompletion();
  };

  const summarizeChatHistory = async (
    maxSummaryToken: number = 1000
  ): Promise<string> => {
    try {
      if (chat.length > 1) {
        let content = chat
          .slice(1, -MAX_MESSAGES)
          .map((item: ChatModel) => `${item.role}: ${item.content}`)
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
    } catch (err) {
      console.log("error", err);
      const error = ((err as AxiosError).response?.data as any)?.error;
      toast.error(error || "Something went wrong");
      setIsLoading(false);
      throw error;
    }
  };

  const ollamaChatCompletion = async () => {
    let messages: OllamaAPIChatRequestModel[] = [];
    let chatSummary = "";

    // chatSummary = await summarizeChatHistory();
    messages = [
      {
        role: "system",
        content: `Act as an AI Assistant and provide clear, concise, and accurate responses in English. Maintain a professional and respectful tone, avoiding offensive language. If you do not know the answer, simply respond with 'I don't know' without making up information.`,
      },
      {
        role: "user",
        content: input,
      },
    ];
    console.log(chatSummary);

    try {
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
          content: "",
          role: "assistant",
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
                      content: result,
                    };
                  }
                  return _;
                });
              });
            }
          } catch (error) {
            toast.error("Error parsing JSON", {
              style: {
                backgroundColor: "hsl(var(--destructive))",
                color: "hsl(var(--destructive-foreground))",
              },
            });
          }
        }
      }

      const newMessage = [
        {
          role: 'user',
          content: input
        },
        {
          role: 'assistant',
          content: result
        }
      ]

      await addMessage(chatID, JSON.stringify(newMessage), "assistant");
    } catch (error) {
      toast.error("Something went wrong", {
        style: {
          backgroundColor: "hsl(var(--destructive))",
          color: "hsl(var(--destructive-foreground))",
        },
      });
      throw error;
    }
  };

  const togglePageTheme = () => {
    dispatch(toggleTheme(theme));
  };

  return (
    <div
      className={`h-screen mb-3 text-gray-900 dark:text-gray-100 overflow-hidden`}
    >
      <header className="flex justify-between items-center fixed top-[20px] right-[20px]">
        <div className="flex items-center space-x-3">
          <Select
            onValueChange={(value) => handleModelChange(value)}
            defaultValue="qwen2.5:0.5b"
          >
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

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 h-full left-0 z-40 flex flex-col shadow-xl bg-sidebar-surface-primary transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-72" : "w-20"
        } overflow-hidden`}
      >
        {/* Top Section */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-10 px-2 hover:bg-token-surface-hover rounded-lg transition-all"
          >
            <Columns2Icon className="h-6 w-6 cursor-pointer" />
          </button>

          {/* Icons Only Show When Sidebar is Open */}
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <button className="h-10 px-3 hover:bg-token-surface-hover rounded-lg transition-all">
                <SearchIcon className="h-6 w-6 cursor-pointer" />
              </button>
              <button className="h-10 px-3 hover:bg-token-surface-hover rounded-lg transition-all">
                <PencilLine className="h-6 w-6 cursor-pointer" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                className="w-full h-[3rem] flex items-center rounded-lg p-3 text-left hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              >
                {/* Icon Always Visible */}
                <MessageSquareIcon
                  className={`text-gray-500 h-5 w-5 shrink-0 `}
                />

                {/* Text Appears Only When Sidebar is Open */}
                <div
                  className={`ml-3 transition-opacity ${
                    sidebarOpen
                      ? "opacity-100"
                      : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  <p className="text-sm font-medium text-gray-800">
                    {chat.title}
                  </p>
                  <p className="text-xs text-gray-500">{chat.date}</p>
                </div>
              </button>
            ))}
          </div>
        </div>


        <div className="flex justify-center pb-4">
        <button onClick={togglePageTheme}>
          {
            theme == 'dark' ? (<SunIcon className="h-6 w-6 cursor-pointer" />) : (
              <MoonIcon className="h-6 w-6 cursor-pointer" />
            )
          }
        </button>
        </div>


      </aside>

      <main
        className={`relative flex bg-red ${
          isSubmitted
            ? "justify-start min-h-[80vh] mt-20"
            : "justify-center min-h-screen"
        } items-center h-full flex-col transition-all ${
          isSubmitted && sidebarOpen ? "ml-72" : "ml-20"
        }`}
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
        className={`${
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
            <div className="relative py-2 px-3 flex items-center gap-2 rounded-lg cursor-pointer bg-gray-100 dark:bg-background-secondary"
              onClick={() => setToolModelOpen(true)}
            >
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
<ToolsModal open={toolModelOpen} onOpenChange={setToolModelOpen}
     />
    </div>
  );
}
