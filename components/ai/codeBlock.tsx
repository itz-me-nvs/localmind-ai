"use client";
// import { Check, Copy } from "lucide-react";
// import { useState } from "react";

// const CodeBlock = ({
//   inline,
//   className,
//   children,
// }: {
//   inline: boolean;
//   className?: string;
//   children: string;
// }) => {
//   const [copied, setCopied] = useState(false);

//   if (inline) {
//     return (
//       <code className="inline-code bg-gray-200 dark:bg-gray-800 px-1 rounded">
//         {children}
//       </code>
//     ); // Inline code styling
//   }

//   if (inline) {
//     return <code className="inline-code">{children}</code>; // Inline code (e.g., `const a = 10;`)
//   }

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(children).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1500);
//     });
//   };

//   return (
//     <div className="relative group">
//       <button
//         className="absolute top-2 right-2 bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
//         onClick={copyToClipboard}
//       >
//         {copied ? (
//           <Check className="w-4 h-4 text-green-500" />
//         ) : (
//           <Copy className="w-4 h-4" />
//         )}
//       </button>

//       <pre
//         className={`${className} p-4 rounded-md overflow-x-auto text-sm bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200`}
//       >
//         <code>{children}</code>
//       </pre>
//     </div>
//   );
// };

const CodeBlock = ({ node, children }: { node: any; children: React.ReactNode }) => {
  return (
    <pre className="p-4 rounded-md overflow-x-auto text-sm bg-gray-100 dark:bg-gray-800">
      <code>{children}</code>
    </pre>
  );
};

export default CodeBlock;
