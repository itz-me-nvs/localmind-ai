import dynamic from "next/dynamic";
import React from "react";
import "@uiw/react-textarea-code-editor/dist.css";

const CodeEditor = dynamic(()=> import("@uiw/react-textarea-code-editor").then(mod => mod.default), {ssr: false});

export default function CodeBlock({language, placeholder, readOnly = false, ...props}: {language?: string, placeholder?: string, readOnly?: boolean}) {
  const [code, setCode] = React.useState(
    `function add(a, b) {\n  return a + b;\n}`
  );
    return (
     <div className="w-full max-h-[400px] overflow-auto">
       <CodeEditor
      value={code}
      language="js"
      data-color-mode="dark"
      readOnly={readOnly}
      placeholder={placeholder || 'Write your code here...'}
      onChange={(evn) => setCode(evn.target.value)}
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