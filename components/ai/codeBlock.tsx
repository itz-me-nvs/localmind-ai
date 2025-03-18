import React from "react";

const CodeBlock = ({children, inline, className, ...props}: {
    className?: string;
  children: React.ReactNode;
  inline: boolean;
}) => {

return(
  <div className="p-4 rounded-md overflow-x-auto text-sm bg-gray-100 dark:bg-gray-800">

  <code>{children}</code>
  </div>
//   <pre className="p-4 rounded-md overflow-x-auto text-sm bg-gray-100 dark:bg-gray-800">
// </pre>
)
  // return <code className={className} {...props}>{children}</code>

//   const match = /language-(\w+)/.exec(className || '');
//   console.log("inline", inline, match, children);

//     // Convert children to string properly
//     const code = Array.isArray(children)
//     ? children.join("")
//     : String(children || "");

//   return !inline && match ? (
//     <SyntaxHighlighter
//       style={vscDarkPlus}
//       language={match[1]}
//       PreTag="div"
//       {...props}
//     >
//       {code.replace(/\n$/, '')}
//     </SyntaxHighlighter>
//   ) : (
// <code className={className} {...props}>{children}</code>
//     );
};

export default CodeBlock;
