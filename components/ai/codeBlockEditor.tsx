import "@uiw/react-textarea-code-editor/dist.css";
import dynamic from "next/dynamic";
import React from "react";

const CodeEditor = dynamic(()=> import("@uiw/react-textarea-code-editor").then(mod => mod.default), {ssr: false});

export default function CodeBlock({defaultCode, language, placeholder, readOnly = false,isInput = true, ...props}: {defaultCode?: string, isInput?: boolean, language?: string, placeholder?: string, readOnly?: boolean}) {
  const [code, setCode] = React.useState(
    `${defaultCode}`
  );
    return (
     <div className={`"w-full ${isInput ? 'max-h-[150px]' : 'max-h-[350px]'} overflow-auto`}>
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
        border: "1px solid rgba(255, 255, 255, 0.1)",
        fontFamily:
          "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
      }}
      {...props}
    />
     </div>
    )
}