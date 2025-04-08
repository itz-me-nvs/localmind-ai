"use client";

import ToolsModal2 from "@/components/page/dialogs/toolsModal2";
import OllamaChat from "@/components/page/ollamaChat";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  API_ERROR_CODE,
  API_ERROR_MESSAGES,
  OLLAMA_BASE_URL,
} from "@/lib/constants/common.constant";
import {
  ChatHistoryModel,
  ChatModel,
  OllamaAPIChatRequestModel,
  OllamaModelList,
} from "@/lib/model/chatModel";
import {
  addMessage,
  clearMessages,
  getAllMessages,
  getMessages,
  renameChat,
} from "@/lib/services/db/indexedDB";
import {
  selectTheme,
  toggleTheme,
} from "@/lib/state/features/theme/themeSlice";
import { selectKeepChatMemory, selectModel, setKeepChatMemory, setModel } from "@/lib/state/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/state/hooks";
import { formatBytes } from "@/lib/utils";
// import { addMessage, getMessages } from "@/lib/services/db/indexedDB";
import "@uiw/react-textarea-code-editor/dist.css";
import axios, { AxiosError } from "axios";
import {
  CircleStopIcon,
  Columns2Icon,
  EarthIcon,
  MessageSquareIcon,
  MoonIcon,
  MoreHorizontalIcon,
  PencilLine,
  SearchIcon, SettingsIcon,
  SunIcon, WrenchIcon
} from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { redirect, useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";


export default function ChatPage({ slugParam }: { slugParam: string }) {
  const [input, setInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<ChatModel[]>([
    {
      role: "system",
      content:
        "Act as an AI Assistant and provide clear, concise, and accurate responses in English. Maintain a professional and respectful tone, avoiding offensive language. If you do not know the answer, simply respond with 'I don't know' without making up information.",
      id: 0,
      isError: false,
    },
  ]);
  const [modelList, setModelList] = useState<OllamaModelList[]>([]);
  const [promptModelOpen, setPromptModelOpen] = useState<boolean>(false);
  const [toolModelOpen, setToolModelOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [chatContainerFocus, setChatContainerFocus] = useState(false);

  const inputContainerRef = useRef<HTMLFormElement>(null);
  const placeHolderRef = useRef<HTMLParagraphElement>(null);
  const renameInputsRef = useRef<HTMLInputElement[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatID, setChatID] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatHistoryModel[]>([]);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);


  const theme = useAppSelector(selectTheme);
  const selectedModel = useAppSelector(selectModel);
  const keepChatMemory = useAppSelector(selectKeepChatMemory);  
  const dispatch = useAppDispatch();

  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string[] | undefined;

  const MAX_MESSAGES = 5;
  const MAX_TOKEN = 4000;

  useEffect(() => {
    sidebarChatHistory();

    if (!slug) {
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

        const modelArr: OllamaModelList[] = [];

        if (data?.models) {
          data?.models.forEach((model: OllamaModelList) => {
            modelArr.push({
              model: model.model,
              size: formatBytes(Number(model.size)),
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

  // scroll to bottom based on new chat.
  useEffect(() => {
    if (chatContainerFocus) {
      scrollToBottom();
    }
  }, [chatContainerFocus]);



  const scrollToBottom = () => {
    if (chatContainerRef.current) {     
      chatContainerRef.current?.scrollTo({behavior: 'smooth', top: chatContainerRef.current.scrollHeight});
    }
  };

  const sidebarChatHistory = async () => {
    const loadAllMessages = await getAllMessages();

    const messageTitles = loadAllMessages.map((item: any) => {
      return {
        id: item.id,
        title: item.title,
        dateInFormat: moment(
          item.messages ? item.messages[0]?.timestamp : Date.now()
        ).fromNow(),
        date: item.messages ? item.messages[0]?.timestamp : Date.now(),
        dataClosed: true,
      };
    });

    setChatHistory(messageTitles.sort((a, b) => b.date - a.date));
    console.log("messageTitles", messageTitles);
  };

  const fetchMessages = async (chatId: string) => {
    const updatedChats: ChatModel[] = [
      {
        role: "system",
        content:
          "Act as an AI Assistant and provide clear, concise, and accurate responses in English. Maintain a professional and respectful tone, avoiding offensive language. If you do not know the answer, simply respond with 'I don't know' without making up information.",
        id: 0,
        isError: false,
        keepChat: false,
      },
    ];

    const currentChatMessages = await getMessages(chatId);
    if (currentChatMessages) {
      console.log("loadMessages", currentChatMessages);
      currentChatMessages.messages.forEach((message: any) => {
        const chatMessage = JSON.parse(message.message);
        console.log("chatMessage", chatMessage);

        if (chatMessage && chatMessage.length > 0) {
          setIsSubmitted(true);

          chatMessage.forEach((item: ChatModel) => {
            updatedChats.push({
              id: updatedChats.length + 1,
              content: item.content,
              isError: false,
              role: item.role,
              keepChat: message.keepChat || false,
            });
          });

          setChat(updatedChats);

          // scroll to bottom
          requestAnimationFrame(scrollToBottom);
         }
      });
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
    console.log("name", name);

    dispatch(setModel(name));
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
        keepChat: keepChatMemory
      },
    ]);

    setChatContainerFocus(true);
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
        const content = (chat.length < MAX_MESSAGES ? chat
        .slice(1) : chat.slice(-MAX_MESSAGES))
        .filter(el => el.keepChat == true)
          .map((item: ChatModel) => `${item.role}: ${item.content}`)
          .join(" ");

          console.log("content", content);

          console.log("keepChat contents", chat); 
          
          

        const response = await axios.post(
          "/api/ollama/generate",
          {
            model: selectedModel,
            prompt: `Summarize the following chat history in 1-2 sentences. Focus on remembering specific information shared by the user such as their name, location, preferences, or any questions asked. Do not add unnecessary generalizations. Be concise and keep useful memory context. Chat History: ${content}`,
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

    const abortController = new AbortController();
    setAbortController(abortController);

    if(keepChatMemory){
      chatSummary = await summarizeChatHistory();
    }

    messages = [
      {
        role: "system",
        content: `You are a helpful, respectful AI assistant. Provide accurate, concise responses in English. Avoid guessing. If you don’t know something, reply with "I don't know". Remember any information the user shares about their name, location, or preferences. Here's a summary of the prior chat: ${chatSummary}`
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
        signal: abortController.signal,
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
          keepChat: keepChatMemory,
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

      setAbortController(null);

      const newMessage = [
        {
          role: "user",
          content: input,
        },
        {
          role: "assistant",
          content: result,
        },
      ];

      let summarizeResponse = null;

      console.log("chat.length", chat.length, chat);
      

      if(chat.length < 2){
        summarizeResponse = await axios.post(
          "/api/ollama/generate",
          {
            model: selectedModel || "qwen2.5:0.5b",
            prompt: `Give me a very small title for the following chat history: ${JSON.stringify(
              result
            )}`,
            stream: false,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      const responseTitle = summarizeResponse?.data?.response || "";
      console.log(responseTitle);

      await addMessage(
        chatID,
        JSON.stringify(newMessage),
        responseTitle ?? "",
        "assistant",
        keepChatMemory
      );
    } catch (error: any) {

      if(error?.name == 'AbortError'){
        return;
      }
      
      toast.error("Something went wrong", {
        style: {
          backgroundColor: "hsl(var(--destructive))",
          color: "hsl(var(--destructive-foreground))",
        },
      });
      throw error;
    }
    finally {
      setIsLoading(false);
      setAbortController(null);
      setChatContainerFocus(false);
    }
  };

  const togglePageTheme = () => {
    dispatch(toggleTheme(theme));
  };

  const navigateToChat = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.preventDefault();
    router.push(`/chat/${id}`);
  };

  const chatMoreOptionHandler = (
    e: React.MouseEvent<HTMLDivElement>,
    id: string
  ) => {
    e.stopPropagation();
    console.log("id", id);
  };

  const handleDeleteChat = async (
    e: React.MouseEvent<HTMLDivElement>,
    id: string
  ) => {
    try {
      e.stopPropagation();
    console.log("id", id);
    await clearMessages(id);

    const filteredChat = chatHistory.filter(i => i.id != id);
    setChatHistory(filteredChat);
    toast.success('Chat deleted successfully');
    } catch (error) {
      toast.error(API_ERROR_MESSAGES[501])
    }
  };

  const onChatTitleFocus = (e: React.FocusEvent<HTMLInputElement>, id: string)=> {
    console.log("event", e);
    
    e.preventDefault()
    e.stopPropagation()
  }

  const handleChatRename = async (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    setChatHistory((prev) => prev.map((item, i) => {
      if(i == index) {
        item.dataClosed = false
      }
      return item
    }));

    // focus into the input
     // Focus input after state updates
  setTimeout(() => {
    renameInputsRef.current[index]?.focus();
  }, 10); // Small delay to ensure the input is visible
  }

  const onBlurChatInput = (e: React.FocusEvent<HTMLInputElement>, chatIndex: number)=> {
    console.log("blur", e);
    
    setChatHistory((prev)=> prev.map((item, index) => {
      if(chatIndex == index){
        item.dataClosed = true

        if(item.title != renameInputsRef.current[chatIndex].value){
          item.title = renameInputsRef.current[chatIndex].value || item.title || item.title;
        }
      }
      return item;
    }))
  }

  const chatRenameInputOnEnter = async(e: React.KeyboardEvent<HTMLInputElement>, chatIndex: number, chatId: string)=> {    
    if(e.key == 'Enter'){
      if(renameInputsRef.current[chatIndex]){
        let chatTitle = ''
        setChatHistory((prev)=> prev.map((item, index) => {
          if(chatIndex == index){
            item.title = renameInputsRef.current[chatIndex].value || item.title;
            chatTitle = item.title;
            item.dataClosed = true;
          }
          return item;
        }))

        await renameChat(chatId, chatTitle)
      }
    }
  }

  const addToChatFromTools = useCallback((response: string)=> {
    console.log("response", response);
    if(response){
      setInput(response);
    }
  }, [])

  const stopRequestedChat = ()=> {
    if(abortController){
      abortController.abort();
      setAbortController(null);
    }
  }

  const messageEditHandler = async(message: string, id: number) => {
    console.log("message", message, id, chat);

    let messages: OllamaAPIChatRequestModel[] = []
    let chatSummary = "";

    const abortController = new AbortController();
    setAbortController(abortController);
    if(keepChatMemory){
      chatSummary = await summarizeChatHistory();
    }


    messages = [
      {
        role: "system",
        content: `You are a helpful, respectful AI assistant. Provide accurate, concise responses in English. Avoid guessing. If you don’t know something, reply with "I don't know". Remember any information the user shares about their name, location, or preferences. Here's a summary of the prior chat: ${chatSummary}`
      },      
      {
        role: "user",
        content: message,
      },
    ];

    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel || "qwen2.5:0.5b", // Adjust model as needed
          messages: messages ?? [],
          stream: true,
        }),
        signal: abortController.signal,
      });

      if (!response.body) throw new Error("Readable stream not available");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

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

                return updatedChat.map((item) => {
                  if((item.id + 1) && (item.id == id + 1 && item.role == 'assistant')){
                    return {
                      ...item,
                      content: result
                    }
                  }
                  return item;
                });
              });
            }
          } catch (error) {
            toast.error("Something went wrong", {
              style: {
                backgroundColor: "hsl(var(--destructive))",
                color: "hsl(var(--destructive-foreground))",
              },
            });
          }
        }
      }

      // const newMessage = [
      //   {
      //     role: "user",
      //     content: input,
      //   },
      //   {
      //     role: "assistant",
      //     content: result,
      //   },
      // ];

      // await addMessage(
      //   chatID,
      //   JSON.stringify(newMessage),
      //   "",
      //   "assistant",
      //   keepChatMemory
      // );
    } catch (error: any) {

      if(error?.name == 'AbortError'){
        return;
      }
      
      toast.error("Something went wrong", {
        style: {
          backgroundColor: "hsl(var(--destructive))",
          color: "hsl(var(--destructive-foreground))",
        },
      });
      throw error;
    }

    finally {
      setIsLoading(false);
      setAbortController(null);
      // setChatContainerFocus(false);
    }

  }

  return (
    <div className="h-screen mb-3 text-gray-900 dark:text-gray-100 overflow-hidden bg-gray-100 dark:bg-gray-900">
      {
        !toolModelOpen ? (
          <>
          {/* Header */}
      <header
        className={`flex justify-between items-center sticky top-5 right-5 z-10`}
      >
        <div className="flex items-center">
          <div
            className={`text-2xl font-bold transition-all duration-500 ${
              sidebarOpen ? "pl-[calc(18rem+20px)]" : "pl-[calc(5rem+20px)]"
            }`}
          >
            LocalMind AI
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild className="ml-2">
                <button
                  className="h-10 px-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                  onClick={() => router.push("/", { scroll: false })}
                >
                  <PencilLine className="h-6 w-6 cursor-pointer text-gray-700 dark:text-gray-300" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center space-x-3 pr-5">
          <div className="flex items-center gap-2">
          <Select
            onValueChange={(value) => handleModelChange(value)}
            defaultValue={selectedModel}
          >
            <SelectTrigger className="w-[220px] focus:ring-0 border-gray-300 dark:border-gray-700 dark:bg-gray-800">
              <SelectValue placeholder="Models" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              {modelList.map((item) => (
                <SelectItem key={item.id} value={item.model}>
                 <div className="flex justify-between items-center w-full">
          <span>{item.model}</span>
          <Badge className="ml-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">{item.size}</Badge> 
        </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <SettingsIcon className="ml-2 cursor-pointer text-sm text-gray-700 dark:text-gray-300" />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col shadow-xl bg-gray-100 dark:bg-gray-800 transition-all duration-300 ease-in-out
      ${sidebarOpen ? "w-72" : "w-20"} overflow-hidden`}
      >
        {/* Top Section */}
        <div className="flex h-16 items-center justify-between border-b border-gray-300 dark:border-gray-700 px-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="h-10 px-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
          >
            <Columns2Icon className="h-6 w-6 cursor-pointer text-gray-700 dark:text-gray-300" />
          </button>

          {/* Icons Only Show When Sidebar is Open */}
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <button className="h-10 px-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all">
                <SearchIcon className="h-6 w-6 cursor-pointer text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4 overflow-x-hidden">
          <div className="space-y-2">
            {chatHistory.map((chat, index) => (
              <button
                onClick={(e) => navigateToChat(e, chat.id)}
                title={chat.title}
                key={chat.id}
                className={`w-full h-[3rem] group relative flex items-center rounded-lg p-3 text-left ${
                  chat.id == chatID ? "bg-gray-200 dark:bg-gray-700" : ""
                } hover:bg-gray-200 dark:hover:bg-gray-700 transition-all`}
              >
                {/* Icon Always Visible */}
                <MessageSquareIcon className="text-gray-500 dark:text-gray-400 h-5 w-5 shrink-0" />

                {/* Text Appears Only When Sidebar is Open */}
                <div
                  className={`ml-3 transition-opacity ${
                    sidebarOpen
                      ? "opacity-100"
                      : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                 {
                   chat.dataClosed && <p className={`text-sm font-medium text-gray-800 dark:text-gray-100 overflow-hidden whitespace-nowrap max-w-44`}>
                   {chat.title}
                 </p>
                 }

                  <input
                 ref={(element: any) => renameInputsRef.current[index] = element}
                  className="text-sm font-medium bg-transparent block h-auto data-[state=open]:block data-[state=closed]:hidden data-[state=open]:opacity-1 rounded-sm p-1 focus:outline-none focus:border-blue-500 focus:border text-gray-800 dark:text-gray-100 overflow-hidden whitespace-nowrap max-w-44"
                  defaultValue={chat.title || ''}
                  data-state={chat.dataClosed ? 'closed' : 'open'}
                    type="text"
                    onClick={(e)=> {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onBlur={(e)=> onBlurChatInput(e, index)}
                    onKeyDown={(e)=> chatRenameInputOnEnter(e, index, chat.id)}
                    />

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {chat.dateInFormat}
                  </p>
                </div>

                {sidebarOpen && (
                  <div
                    onClick={(e) => chatMoreOptionHandler(e, chat.id)}
                    className={`absolute right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-100`}
                  >
                    <DropdownMenu>
                      {/* Wrap the trigger inside a div to avoid <button> nesting issues */}
                      <div>
                        <DropdownMenuTrigger asChild>
                          <MoreHorizontalIcon className="h-6 w-6 cursor-pointer text-gray-700 dark:text-gray-300" />
                        </DropdownMenuTrigger>
                      </div>
                      <DropdownMenuContent className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-lg">
                        <DropdownMenuItem className="cursor-pointer">Share</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={(e) => handleChatRename(e, index)}>Rename</DropdownMenuItem>
                        <DropdownMenuItem
                        className="cursor-pointer"
                          onClick={(e) => handleDeleteChat(e, chat.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex justify-start items-center px-7 pb-4">
          <button onClick={togglePageTheme}>
            {theme === "dark" ? (
              <SunIcon className="h-6 w-6 cursor-pointer text-gray-700 dark:text-gray-300" />
            ) : (
              <MoonIcon className="h-6 w-6 cursor-pointer text-gray-700 dark:text-gray-300" />
            )}
          </button>
          <p
            className={`ml-3 text-sm font-medium text-gray-800 dark:text-gray-100 transition-opacity duration-100 truncate ${
              sidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            {theme === "dark" ? "Dark Mode" : "Light Mode"}
          </p>
        </div>
      </aside>

      <main
  className={`flex flex-col h-screen transition-all mt-10 ${
    sidebarOpen ? "ml-72" : "ml-20"
  }`}
>
  {/* Chat Content Area */}
  <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-6 mt-5 mb-8">
    {isSubmitted ? (
      <OllamaChat chatList={chat} isLoading={isLoading} messageEditHandler={messageEditHandler}/>
    ) : (
      <div className="flex justify-center items-center h-full z-50">
        <Image
          src="/logo/logo.svg"
          alt="Ollama UI"
          width={150}
          height={150}
        />
      </div>
    )}
  </div>

  {/* Fixed Input Form */}
  <form
    onSubmit={handleSubmit}
    ref={inputContainerRef}
    className={`px-3 py-2 sticky bottom-2 z-10 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700
      w-full max-w-screen-md mx-auto shadow-md rounded-lg
      transition-all duration-300`}
  >
    <div className="flex justify-between items-center">
    <Textarea
      onInput={handleInputChange as any}
      onKeyDown={handleKeyDown as any}
      className="w-full text-xl focus-visible:ring-0 focus:outline-none  border-none focus:ring-0 shadow-none outline-none break-words resize-none overflow-auto min-h-[44px] max-h-32 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
      placeholder="Ask a question"
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />

    {
      abortController && (
        <CircleStopIcon onClick={stopRequestedChat} className="h-6 w-6 text-gray-700 dark:text-gray-300" />
      )
    }

    </div>

    <div className="flex justify-between items-center mt-3 px-2">
      <div className="flex items-center gap-3">
        {/* Tools Button */}
        <div
          className="py-2 px-3 flex items-center gap-2 rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          onClick={() => setToolModelOpen(true)}
        >
          <WrenchIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <span className="text-gray-700 dark:text-gray-300">Tools</span>
        </div>

        {/* Disabled Search & Fine Tune */}
        <div className="py-2 px-3 flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-background-secondary opacity-70 pointer-events-none">
          <EarthIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <span className="text-gray-700 dark:text-gray-300">Search</span>
        </div>
        <div className="py-2 px-3 flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-background-secondary opacity-70 pointer-events-none">
          <EarthIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <span className="text-gray-700 dark:text-gray-300">Fine tune</span>
        </div>
      </div>

      {/* Keep Memory Switch */}
      <div className="flex items-center space-x-2">
        <Switch
          id="airplane-mode"
          checked={keepChatMemory}
          onCheckedChange={(checked) => {
            dispatch(setKeepChatMemory(checked));
          }}
          className="data-[state=checked]:bg-blue-500 data-[state=checked]:dark:bg-blue-500 bg-gray-300 dark:bg-gray-700 transition-colors"
        />
        <Label htmlFor="airplane-mode">Keep chat memory</Label>
      </div>
    </div>
  </form>
</main> 
          </>) : (
                  <ToolsModal2 open={toolModelOpen} onOpenChange={setToolModelOpen} addToChatFromToolsHandler={addToChatFromTools} />

          )
        
      }


    </div>
  );
}
