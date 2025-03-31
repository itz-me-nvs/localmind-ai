
import { Button } from "@/components/ui/button";
import { ChatModel } from "@/lib/model/chatModel";
import "highlight.js/styles/github-dark.css"; // Choose a highlight theme
import { RotateCcwIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "../ai/codeBlock";

export default function OllamaChat({
  chatList,
  isLoading,
}: {
  chatList: ChatModel[];
  isLoading: boolean;
}) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatList]);
  return (
    <div
    ref={chatContainerRef}
    className="w-full flex space-y-4 px-4 overflow-y-auto dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    <div className="max-h-[70vh] max-w-screen-md w-full m-auto flex flex-col space-y-4">
      {chatList.map((item) => (
        <div key={item.id} className={`${item.id == 0 ? "hidden" : ""}`}>
          <div
            className={`flex w-full items-start gap-3 text-wrap break-words whitespace-pre-wrap ${
              item.role === "user" ? "justify-end" : "justify-start mb-6"
            }`}
          >
            {item.role == "assistant" && (
              <div className="rounded-xl flex items-center justify-center w-9 h-9 flex-shrink-0 bg-white dark:bg-gray-800">
                <Image
                  src="/logo/logo.svg"
                  alt="Ollama UI"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
            )}

            <div
              className={`rounded-3xl px-4 py-2 text-wrap ${
                item.role === "user"
                  ? "bg-background-message text-black dark:text-white"
                  : "bg-white dark:bg-gray-800 dark:text-gray-100"
              }`}
            >
              {item.isError ? (
                <div className="flex items-center justify-between border-red-300 dark:border-red-900 bg-background-message border p-3 rounded-lg">
                  <div className="flex items-center">
                    <p className="text-red-500 dark:text-red-400">
                      {item.content} +
                      {
                        " If this issue persists please contact us through our help center at https://ollama.ai/help"
                      }
                    </p>
                  </div>

                  <Button className="flex items-center bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 text-black hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 rounded-lg shadow-none p-3">
                    <RotateCcwIcon className="mr-2 h-4 w-4" />
                    <span className="text-sm font-medium">Retry</span>
                  </Button>
                </div>
              ) : (
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code: ({ node, className, children, ...props }) => {
                      return (
                        <CodeBlock
                          className={`${className} rounded-lg bg-gray-200 dark:bg-gray-800 text-black dark:text-white`}
                          {...props}
                        >
                          {children}
                        </CodeBlock>
                      );
                    }
                  }}
                >
                  {item.content}
                </Markdown>
              )}
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex items-center justify-start">
          <div className="flex items-center justify-center p-2 rounded-lg">
            <Image
              src="/logo/logo.svg"
              alt="Ollama UI"
              width={30}
              height={30}
            />
          </div>

          <div className="flex space-x-2 ml-2">
            <div className="h-3 w-3 bg-orange-600 dark:bg-orange-400 rounded-full animate-bounce [animation-delay:100ms]"></div>
            <div className="h-3 w-3 bg-orange-600 dark:bg-orange-400 rounded-full animate-bounce [animation-delay:200ms]"></div>
            <div className="h-3 w-3 bg-orange-600 dark:bg-orange-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
          </div>
        </div>
      )}
    </div>
  </div>

  );
}
