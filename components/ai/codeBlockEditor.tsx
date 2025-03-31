import "@uiw/react-textarea-code-editor/dist.css";
import dynamic from "next/dynamic";
import React from "react";

const CodeEditor = dynamic(()=> import("@uiw/react-textarea-code-editor").then(mod => mod.default), {ssr: false});

export default function CodeBlock({className, defaultCode, language, placeholder, readOnly = false,isInput = true, ...props}: {className?: string, defaultCode?: string, isInput?: boolean, language?: string, placeholder?: string, readOnly?: boolean}) {
  const [code, setCode] = React.useState(
    `${defaultCode}`
  );
    return (
     <div className={`"w-full min-h-[100px] ${isInput ? 'max-h-[150px]' : 'max-h-[350px]'} overflow-auto border rounded-lg shadow-sm ${className}`}>
       <CodeEditor
      value={code}
      language="js"
      data-color-mode="dark"
      readOnly={readOnly}
      placeholder={placeholder || 'Write your code here...'}
      onChange={(evn) => !readOnly && setCode(evn.target.value)}
      padding={15}
      style={{
        fontSize: 12,
        borderRadius: 4,
        fontFamily:
          "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
      }}
      {...props}
    />
     </div>
    )
}