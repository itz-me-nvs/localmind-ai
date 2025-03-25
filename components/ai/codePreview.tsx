import React from "react";

interface CodePreviewProps {
    code: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
    const iframeRef = React.useRef<HTMLIFrameElement>(null);
    //<!DOCTYPE html><html><body><h1>Heading 1</h1></body></html>
    const [srcDoc, setSrcDoc] = React.useState("");
    const [isPreviewAvailable, setIsPreviewAvailable] = React.useState(true);

    const extractHTML = (code: string) => {
      // Remove the backticks and the language specifier
      const cleanCode = code.replace(/(^```html\s*)|(```$)/gi, "").trim();

      // Extract only the HTML part using regex
      const match = cleanCode.match(/<(!DOCTYPE|html)[\s\S]*<\/html>/i);
      return match ? match[0] : "";
    };

    React.useEffect(() => {
        if (iframeRef.current) {
            const document = iframeRef.current.contentDocument;
            if (document) {
                document.open();

                let html = extractHTML(code);
                if (html) {
                    setSrcDoc(html);
                    setIsPreviewAvailable(true);
                }
                else {
                    setIsPreviewAvailable(false);
                    setSrcDoc(code);
                }

                // close the document
                document.close();
            }
        }

        // Clean up the iframe when the component unmounts
        return () => {
            if (iframeRef.current) {
                iframeRef.current.remove();
            }
        };
    }, [code]);

    return (
       <>
       {
           isPreviewAvailable ? (
               <iframe
                   ref={iframeRef}
                   title="Code Preview"
                   srcDoc={srcDoc}
                   className="w-full h-full"
               />
           ) : (
               <pre className="w-full h-full p-4 overflow-auto text-sm text-gray-500 bg-gray-900 rounded-lg">
                   {code}
               </pre>
           )
       }
       </>
    );
};

export default CodePreview;