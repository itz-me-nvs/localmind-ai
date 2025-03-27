
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
      className="w-full flex space-y-2 p-4 overflow-y-auto"
    >
      <div className="max-h-[70vh] max-w-screen-md w-full m-auto flex flex-col space-y-4 p-3">
        {chatList.map((item) => (
          <div key={item.id} className={`${item.id == 0 ? "hidden" : ""}`}>
            <div
              className={`flex w-full items-start gap-3 text-wrap break-words whitespace-pre-wrap ${
                item.role === "user" ? "justify-end" : "justify-start mb-6"
              }`}
            >
              {item.role == "assistant" && (
                <div className="rounded-xl flex items-center justify-center w-9 h-9 flex-shrink-0">
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
                className={`rounded-3xl ${
                  item.role == "user" ? "px-5 py-2.5" : ""
                } text-wrap ${
                  item.role === "user"
                    ? "bg-background-message text-black dark:text-white"
                    : "bg-white dark:bg-transparent"
                }`}
              >
                {item.isError ? (
                  <div className="flex items-center justify-between border-red-300 dark:border-red-900 bg-background-message border p-3 rounded-lg">
                    <div className="flex items-center">
                      <p className="text-red-500">
                        {item.content} +{" "}
                        {
                          " If this issue persists please contact us through our help center at https://ollama.ai/help"
                        }
                      </p>
                    </div>

                    <Button className="flex items-center  bg-white dark:border-none text-black hover:bg-gray-100 border border-gray-200 rounded-lg shadow-none p-3">
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
                        return <CodeBlock className={`${className} rounded-lg`} {...props}>{children}</CodeBlock>;
                      }
                    }}
                  >
                    {item.content}
                  </Markdown>

                //   <Markdown
                //   components={{
                //    code({className, children, ...rest}){
                //     const match = /language-(\w+)/.exec(className || "");

                //     return match ? (
                //       <SyntaxHighlighter
                //       {...rest}
                //       PreTag="div"
                //       children={String(children).replace(/\n$/, "")}
                //       language={match[1]}
                //       style={dark}
                //       />
                //     ) : (
                //       <code className={className} {...rest}>
                //         {children}
                //       </code>
                //     )
                //    }
                //   }}
                 
                // >
                //   {item.content}
                // </Markdown>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center justify-start">
            <div className="flex items-center justify-center p-2 rounded-lg">
              <Image
                src="/logo/logo.svg" // Ensure the correct path is set
                alt="Ollama UI"
                width={30}
                height={30}
              />
            </div>

            <div className="flex space-x-2 ml-2">
              <div className="h-3 w-3 bg-orange-600 rounded-full animate-bounce [animation-delay:100ms]"></div>
              <div className="h-3 w-3 bg-orange-600 rounded-full animate-bounce [animation-delay:200ms]"></div>
              <div className="h-3 w-3 bg-orange-600 rounded-full animate-bounce [animation-delay:300ms]"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
