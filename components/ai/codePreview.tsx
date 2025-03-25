import axios from "axios";
import React from "react";
import { BounceLoader } from "../ui/bounceLoader";

interface CodePreviewProps {
    code: string;
}

const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
    const iframeRef = React.useRef<HTMLIFrameElement>(null);
    const [srcDoc, setSrcDoc] = React.useState("");
    const [isPreviewAvailable, setIsPreviewAvailable] = React.useState(true);
    const [isFormating, setIsFormating] = React.useState(false);

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
                    fetchFormatedCode()
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


    const fetchFormatedCode = async () => {
        try {
            setIsFormating(true);
            const prompt = `generate complete html code for the following code.
  Important: Only return the formatted code, no explanations, no comments, no descriptions.
  ${code}`;
            const response = await axios.post("/api/ollama/generate", {
                model: "llama3:latest",
                prompt: prompt,
                stream: false,
            });
            const formattedCode = response?.data?.response || "";
            setIsFormating(false);
      
            let html = extractHTML(code);
            if(html){
                setSrcDoc(formattedCode);
                setIsPreviewAvailable(true)
            }
            else {
                setIsPreviewAvailable(false)
            }

        } catch (error) {
            setIsFormating(false);
            throw error;
        }
    };
    return (
       <>
       {
           isPreviewAvailable ? (
               <div className="flex justify-center h-full border p-2 rounded-lg">
                <iframe
                   ref={iframeRef}
                   title="Code Preview"
                   srcDoc={srcDoc}
                   className="w-full h-full"
               />
               </div>
           ) : (
            isFormating ? <BounceLoader /> :  <div className="text-center flex items-center justify-center h-full bg-red-50 text-gray-500 dark:text-gray-400">Preview not available</div>
           )
       }
       </>
    );
};

export default CodePreview;