import CodeBlockEditor from "@/components/ai/codeBlockEditor";
import CodePreview from "@/components/ai/codePreview";
import { BounceLoader } from "@/components/ui/bounceLoader";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog, DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FANCY_COLORS } from "@/lib/constants/common.constant";
import { ToolDropdownType } from "@/lib/model/toolsModel";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import axios from "axios";
import { CommandList } from "cmdk";
import {
  BotIcon,
  BrainIcon,
  BrushIcon,
  BugIcon,
  CheckCheckIcon,
  CogIcon,
  CopyIcon,
  FileIcon,
  LanguagesIcon,
  NotebookPenIcon,
  PencilIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type ToolsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// Prompt Enhancer Formgroup
const promptEnhanceScheme = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required",
  }),
  context: z.string().optional(),
});

const rewriteScheme = z.object({
  message: z.string().min(1, {
    message: "Message is required",
  }),
  tone: z.string().min(1, {
    message: "Tone is required",
  }),
  contentLength: z.string().min(1, {
    message: "Content Length is required",
  }),
  context: z.string().optional(),
});

const summarizeScheme = z.object({
  message: z.string().min(1, {
    message: "Message is required",
  }),
  length: z.string().min(1, {
    message: "Length is required",
  }),
  style: z.string().min(1, {
    message: "Summarization Style is required",
  }),
  emphasis: z.string().min(1, {
    message: "Emphasis is required",
  }),
  context: z.string().optional(),
});

const bugFixScheme = z.object({
  code: z.string().min(1, {
    message: "",
  }),
  detection: z.string().min(1, {
    message: "Bug Detection is required",
  }),
  analysis: z.string().min(1, {
    message: "Bug Analysis is required",
  }),
});

const langTranslateScheme = z.object({
  code: z.string().min(1, {
    message: "",
  }),
  targetLanguage: z.string().min(1, {
    message: "Target Language is required",
  }),
  context: z.string().optional(),
});

const designUIScheme = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required",
  }),
  framework: z.string().min(1, {
    message: "Framework is required",
  }),
  context: z.string().optional(),
});

const unitTestScheme = z.object({
  code: z.string().min(1, {
    message: "",
  }),
  targetFrameWork: z.string().min(1, {
    message: "Target framework is required",
  }),
  context: z.string().optional(),
});

export default function ToolsModal({ open, onOpenChange }: ToolsModalProps) {
  const toolList = [
    {
      id: 0,
      title: "Prompt Enhancer",
      description:
        "Enhance your prompts and rewrite content with AI assistance",
      icon: SparklesIcon,
    },
    {
      id: 1,
      title: "Rewrite sentence",
      description: "Rewrite your sentences with AI assistance",
      icon: PencilIcon,
    },
    {
      id: 2,
      title: "Summarize",
      description: "Summarize your content with different style and emphasis",
      icon: FileIcon,
    },
    {
      id: 3,
      title: "Bug Fix",
      description:
        "Efficiently fix bugs in your code and provide suggestions for improvement",
      icon: BugIcon,
    },
    {
      id: 4,
      title: "Language Translation",
      description:
        "Translate Language or Programming Language from one to another",
      icon: LanguagesIcon,
    },
    {
      id: 5,
      title: "Design UI",
      description:
        "Design a user interface for your web application, mobile app, or website",
      icon: BrushIcon,
    },
    {
      id: 6,
      title: "Unit Testing",
      description:
        "Effiently write unit tests for your code, don't need manual testing",
      icon: CogIcon,
    },
    {
      id: 7,
      title: "Project Memorization",
      description:
        "To supercharge your coding speed, dive deep into your project's codebase and surroundings!",
      icon: BrainIcon,
      disable: true,
    },
    {
      id: 8,
      title: "Technical Writing",
      description:
        "Craft compelling and informative technical content with our AI-powered writing assistant.",
      icon: NotebookPenIcon,
      disable: true,
    },

    {
      id: 9,
      title: "Coding Assistant",
      description:
        "Transform your project with the help of our AI coding assistant, making it easier and more efficient.",
      icon: BotIcon,
      disable: true,
    },
  ];

  const toneOptions = [
    { id: 1, name: "Professional" },
    { id: 2, name: "Casual" },
    { id: 3, name: "Friendly" },
    { id: 4, name: "Concise" },
    { id: 5, name: "Formal" },
  ];

  const lengthLabels = [
    { id: 1, name: "Very Short" },
    { id: 2, name: "Short" },
    { id: 3, name: "Medium" },
    { id: 4, name: "Long" },
    { id: 5, name: "Very Long" },
  ];

  // Summarization lists

  const summaryLengths = [
    { label: "Short", value: "short", description: "1-2 sentences" },
    { label: "Medium", value: "medium", description: "1-2 paragraphs" },
    { label: "Long", value: "long", description: "Detailed but concise" },
  ];

  const summarizationStyles = [
    {
      label: "Key Points",
      value: "key_points",
      description: "Summarized as bullet points",
    },
    {
      label: "Concise",
      value: "concise",
      description: "Compact paragraph format",
    },
    {
      label: "Detailed",
      value: "detailed",
      description: "Structured summary with key details",
    },
  ];

  const contextEmphasis = [
    {
      label: "General Summary",
      value: "general",
      description: "Covers the main ideas broadly",
    },
    {
      label: "Actionable Steps",
      value: "actionable",
      description: "Focuses on steps or instructions",
    },
    {
      label: "Technical Details",
      value: "technical",
      description: "Highlights technical concepts",
    },
    {
      label: "Emotional Tone",
      value: "emotional",
      description: "Preserves the sentiment and tone",
    },
  ];

  // refactor code

  const aiBugDetectionOptions = [
    {
      label: "Auto-Detect Issues",
      value: "auto_detect",
      description: "Let AI find the most probable bugs",
    },
    {
      label: "Syntax & Typo Check",
      value: "syntax_typo",
      description: "AI scans for syntax errors and missing characters",
    },
    {
      label: "Undefined Variables",
      value: "undefined_vars",
      description: "Detect variables that are not declared or assigned",
    },
    {
      label: "Memory Leaks & Performance",
      value: "memory_performance",
      description: "AI checks for memory leaks and inefficiencies",
    },
    {
      label: "Security Vulnerabilities",
      value: "security_scan",
      description: "Find potential security issues in code",
    },
  ];

  const aiCodeAnalysis = [
    {
      label: "Fix Issue",
      value: "fix_suggestions",
      description: "AI generates potential solutions",
    },
    {
      label: "Refactor Code",
      value: "refactor_code",
      description: "AI suggests code refactoring options",
    },
    {
      label: "Explain the Issue",
      value: "explain_issue",
      description: "AI provides a beginner-friendly explanation of the bug",
    },
    {
      label: "Compare with Best Practices",
      value: "best_practices",
      description: "Check how similar issues are solved in best practices",
    },
    {
      label: "Provide Code Snippet Fix",
      value: "code_snippet_fix",
      description: "AI generates an improved version of the buggy code",
    },
  ];

  // Design UI

  const styleFramework = [
    {
      id: 0,
      label: "CSS",
    },
    {
      id: 1,
      label: "Tailwind CSS",
    },

    {
      id: 2,
      label: "Bootstrap",
    },
  ];

  const UIComponentList = [
    {
      id: 0,
      label: "Button",
    },
    {
      id: 1,
      label: "Input",
    },
    {
      id: 2,
      label: "Textarea",
    },
    {
      id: 3,
      label: "Select",
    },
    {
      id: 4,
      label: "Radio",
    },
    {
      id: 5,
      label: "Checkbox",
    },
    {
      id: 6,
      label: "Switch",
    },
    {
      id: 7,
      label: "Slider",
    },
  ];

  // Language Translation
  const targetLanguages = [
    {
      label: "Javascript",
      id: 0,
    },
    {
      label: "Python",
      id: 1,
    },
    {
      label: "React",
      id: 3,
    },
    {
      label: "Angular",
      id: 4,
    },
  ];

  // Unit testing
  const targetUnitFrameworks = [
    {
      label: "Mocha",
      id: 0,
    },
    {
      label: "Jest",
      id: 1,
    },
  ];

  const [toolType, setToolType] = useState<number>(0);
  const [ToolItem, setToolItem] = useState(toolList[0]);
  const [context, setContext] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [promptCopyStatus, setPromptCopyStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [promptEnhanceResult, setPromptEnhanceResult] = useState<string>("");
  const [markdown, setMarkdown] = useState<string>("");
  const [IsComponentMention, setIsComponentMention] = useState<boolean>(false);
  const [filteredComponents, setFilteredComponents] = useState<
    ToolDropdownType[]
  >([]);
  const promptEnhancerRef = useRef<HTMLDivElement | null>(null);

  const COLOR_CODE = FANCY_COLORS;

  // Create separate form instances with unique IDs to prevent field interference
  const promptEnhancerForm = useForm<z.infer<typeof promptEnhanceScheme>>({
    resolver: zodResolver(promptEnhanceScheme),
    defaultValues: {
      prompt: "",
      context: "",
    },
    mode: "onChange", // Add this to enable validation as user types
  });

  const rewriteForm = useForm<z.infer<typeof rewriteScheme>>({
    resolver: zodResolver(rewriteScheme),
    defaultValues: {
      message: "",
      tone: "1",
      contentLength: "1",
      context: "",
    },
    mode: "onChange", // Add this to enable validation as user types
  });

  const summarizeForm = useForm<z.infer<typeof summarizeScheme>>({
    resolver: zodResolver(summarizeScheme),
    defaultValues: {
      message: "",
      style: "key_points",
      emphasis: "general",
      context: "",
      length: "short",
    },
    mode: "onChange", // Add this to enable validation as user types
  });

  const bugFixForm = useForm<z.infer<typeof bugFixScheme>>({
    resolver: zodResolver(bugFixScheme),
    defaultValues: {
      code: "",
      analysis: "fix_suggestions",
      detection: "auto_detect",
    },
    mode: "onChange", // Add this to enable validation as user types
  });

  const langTranslationForm = useForm<z.infer<typeof langTranslateScheme>>({
    resolver: zodResolver(langTranslateScheme),
    defaultValues: {
      code: "",
      targetLanguage: "0",
      context: "",
    },
    mode: "onChange", // Add this to enable validation as user types
  });

  const designUIForm = useForm<z.infer<typeof designUIScheme>>({
    resolver: zodResolver(designUIScheme),
    defaultValues: {
      prompt: "",
      framework: "0",
      context: "",
    },
    mode: "onChange", // Add this to enable validation as user types
  });

  const unitTestForm = useForm<z.infer<typeof unitTestScheme>>({
    resolver: zodResolver(unitTestScheme),
    defaultValues: {
      code: "",
      context: "",
      targetFrameWork: "0",
    },
    mode: "onChange", // Add this to enable validation as user types
  });

  const toolsForms = [
    promptEnhancerForm,
    rewriteForm,
    summarizeForm,
    bugFixForm,
    langTranslationForm,
    designUIForm,
    unitTestForm,
  ];

  // reset tools on load
  useEffect(() => {
    if (open) {
      toolsForms.forEach((item) => item.reset());
      setToolType(0);
      setPromptEnhanceResult("");
    }
  }, [open]);

  const promptEnhancerScroll = ()=> {
    if(promptEnhancerRef.current){
      promptEnhancerRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }

  // scroll to the prompt enhancer on submit

  useEffect(() => {
    let animationFrameId: number;
    animationFrameId = requestAnimationFrame(promptEnhancerScroll);

    return ()=> {
      cancelAnimationFrame(animationFrameId);
    }
  }, [promptEnhanceResult])

  // Reset forms when tool type changes
  const handleToolTypeChange = (newToolType: number) => {
    setToolType(newToolType);
    setPromptEnhanceResult("");

    // reset the forms exclude the current selected form
    toolsForms.forEach((item, index) => {
      if (index != newToolType) {
        item.reset();
      }
    });

    const selectedTool =
      toolList.find((t) => t.id === newToolType) || toolList[0];
    setToolItem(selectedTool);

    // Only reset the forms when switching between them
    if (newToolType === 0) {
      rewriteForm.reset();
    } else if (newToolType === 1) {
      promptEnhancerForm.reset();
    }
  };

  async function OnSubmitPromptEnhance(
    data: z.infer<typeof promptEnhanceScheme>
  ) {
    if (data.prompt) {
      try {
        setIsLoading(true);
        setPromptEnhanceResult("");
        const response = await axios.post("/api/ollama/generate", {
          model: "qwen2.5:0.5b",
          prompt: `Improve the clarity, effectiveness, and engagement of the following prompt **without answering it**. Do not provide a response to the prompt itself; just refine its wording for better AI interaction:\n\n"${data.prompt}"`,
          stream: false,
        });
        const enhancedPrompt = response?.data?.response || "";
        setPromptEnhanceResult(enhancedPrompt);
        setIsLoading(false);

        console.log("response", enhancedPrompt);
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    }
  }

  async function OnSubmitRewriteEnhance(data: z.infer<typeof rewriteScheme>) {
    try {
      setIsLoading(true);
      setPromptEnhanceResult("");

      const selectedTone = toneOptions.find(
        (t) => t.id.toString() == data.tone
      )?.name;
      const selectedLength = lengthLabels.find(
        (t) => t.id.toString() == data.contentLength
      )?.name;

      console.log("data", data);

      // Implementation for rewrite enhancement
      const response = await axios.post("/api/ollama/generate", {
        model: "llama3.2:latest", // qwen2.5:0.5b
        prompt: `You are a text rewriting assistant. Rewrite the following content with a ${selectedTone} tone and make it ${selectedLength} in length.
      Important: Only provide the rewritten text. Do not include any explanations,
      Original Text: "${data.message}",
      ${data.context ? `\nAdditional context: ${data.context}` : ""}`,
        stream: false,
      });
      const enhancedContent = response?.data?.response || "";
      setPromptEnhanceResult(enhancedContent);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }

  async function OnSubmitSummarizeEnhance(
    data: z.infer<typeof summarizeScheme>
  ) {
    try {
      setIsLoading(true);
      setPromptEnhanceResult("");

      const summaryLength = summaryLengths.find(
        (t) => t.value === data.length
      )?.description;
      const summaryStyle = summarizationStyles.find(
        (t) => t.value == data.style
      )?.description;

      const summaryEmphasis = contextEmphasis.find(
        (t) => t.value == data.emphasis
      )?.description;

      console.log("data", data);

      // Implementation for rewrite enhancement
      const response = await axios.post("/api/ollama/generate", {
        model: "llama3.2:latest", // qwen2.5:0.5b
        prompt: `Summarize the following text based on the given parameters, Summary Length: ${summaryLength}, Summary Style: ${summaryStyle}, Emphasis: ${summaryEmphasis}.
      Important: Only provide the summary. Do not include any explanations,
      Original Text: "${data.message}",
      ${data.context ? `\nAdditional context: ${data.context}` : ""}`,
        stream: false,
      });
      const enhancedContent = response?.data?.response || "";
      setPromptEnhanceResult(enhancedContent);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }

  async function OnSubmitBugFix(data: z.infer<typeof bugFixScheme>) {
    try {
      setIsLoading(true);
      setPromptEnhanceResult("");

      const detection = aiBugDetectionOptions.find(
        (t) => t.value === data.detection
      )?.description;
      const codeAnalysis = aiCodeAnalysis.find(
        (t) => t.value == data.analysis
      )?.description;

      const bugFixPrompt = `Analyze the following code snippet to find any **syntax errors, typos, and logical issues**.
    If any errors are found, **identify and fix them accordingly**. 
    
    **Bug Detection Criteria:**
    ${detection}

    **Code Analysis Focus:**
    ${codeAnalysis}  

    ---  
    **Original Code:**  
    \`\`\`
    ${data.code}
    \`\`\`
    
    **Important:** The AI **must prioritize** syntax issues first before addressing logic errors. If any issue found then return only the corrected code in the same format. Do **NOT** add unnecessary text or explanations beyond the required details. if not bug found then response only like this "No Bug Found"`;
      // Enhanced Bug Fixing Prompt
      const response = await axios.post("/api/ollama/generate", {
        model: "llama3.2:latest", // or any preferred model
        prompt: bugFixPrompt.trim(),
        stream: false,
      });

      const enhancedContent = response?.data?.response || "";
      setPromptEnhanceResult(enhancedContent);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }

  async function OnSubmitDesignUI(data: z.infer<typeof designUIScheme>) {
    try {
      setIsLoading(true);
      setPromptEnhanceResult("");

      const framework = styleFramework.find(
        (s) => s.id == Number(data.framework)
      )?.label;

      const designUIPrompt = `Generate a **fully functional, responsive, and visually appealing UI component** based on the following requirements:

### **Component Details**:
- **Description**: ${data.prompt}
- **Framework**: ${framework}

### **Requirements**:
- Provide a **complete and valid HTML document** that includes:
  - \`<!DOCTYPE html>\`, \`<html>\`, \`<head>\`, \`<body>\`, and all necessary elements.
  - Full CSS styling (either within a \`<style>\` tag or external file reference).
  - If using JavaScript (e.g., interactive elements), include it inside a \`<script>\` tag within the HTML.
  - Ensure the component is **fully responsive** and **accessible** (ARIA attributes where needed).
- **Do not** provide code snippets; the response should always contain a **full, standalone HTML document**.
- **Do not** include explanations, comments, or descriptions.  

${data.context ? `\n### **Additional Context**: ${data.context}` : ""}`;

      // Enhanced Bug Fixing Prompt
      const response = await axios.post("/api/ollama/generate", {
        model: "llama3.2:latest", // or any preferred model
        prompt: designUIPrompt.trim(),
        stream: false,
      });
      const enhancedContent = response?.data?.response || "";
      setPromptEnhanceResult(enhancedContent);
      setIsLoading(false);
    } catch (error) {
      console.log("i am heere", error);

      setIsLoading(false);
      const response = (error as any)?.response?.data?.error;
      console.log("response", response);

      if (response) {
        toast.error(response, {
          style: {
            backgroundColor: "hsl(var(--destructive))",
            color: "hsl(var(--destructive-foreground))",
          },
        });
      }
    }
  }

  async function OnSubmitLangTranslation(
    data: z.infer<typeof langTranslateScheme>
  ) {
    try {
      setIsLoading(true);
      setPromptEnhanceResult("");

      const sourceLang = "Javascript";
      const targetLang = targetLanguages.find(
        (t) => t.id == Number(data.targetLanguage)
      )?.label;

      const translationPrompt = `Translate the follow code from Javascript to ${targetLang}. Ensure accuracy and best practices.
       Important: Only return the translated code, no extra comments. If user input is not valid then return the response "Invalid Input".

        Original Code: \`\`\`${sourceLang}
  ${data.code}
  \`\`\`

   If applicable, replace libraries or functions with equivalent ones in ${targetLang}.
      `;

      // Enhanced translation prompt
      const response = await axios.post("/api/ollama/generate", {
        model: "llama3.2:latest", // or any preferred model
        prompt: translationPrompt.trim(),
        stream: false,
      });

      const enhancedContent = response?.data?.response || "";
      setPromptEnhanceResult(enhancedContent);
      setIsLoading(false);
    } catch (error) {
      console.log("err", error);
    }
  }

  async function OnSubmitUnitTest(data: z.infer<typeof unitTestScheme>) {
    try {
      setIsLoading(true);
      setPromptEnhanceResult("");

      const sourceLang = "Javascript";
      const targetFrameWork = targetUnitFrameworks.find(
        (t) => t.id == Number(data.targetFrameWork)
      )?.label;

      const translationPrompt = `Generate unit tests for the following function using ${targetFrameWork}
       **Function:**
  \`\`\`
  ${data.code}
  \`\`\`

    **Requirements:**
  - Use ${targetFrameWork} as the testing framework.
  - Cover edge cases, including invalid inputs.
  - Mock any external dependencies.
  - Ensure correct assertions are used.

   Output:
  - Well-structured test cases following best practices.
  - Short explanation for each test case.
  - Ensure test functions are isolated and independent.
      `;

      // Enhanced translation prompt
      const response = await axios.post("/api/ollama/generate", {
        model: "llama3.2:latest", // or any preferred model
        prompt: translationPrompt.trim(),
        stream: false,
      });

      const enhancedContent = response?.data?.response || "";
      setPromptEnhanceResult(enhancedContent);
      setIsLoading(false);
    } catch (error) {
      console.log("err", error);
    }
  }

  const handleCopyPromptEnhance = async () => {
    try {
      await navigator.clipboard.writeText(promptEnhanceResult);
      setPromptCopyStatus("success");
      setTimeout(() => {
        setPromptCopyStatus("idle");
      }, 1000);
    } catch (error) {
      setPromptCopyStatus("error");
      console.error("Failed to copy text:", error);
    }
  };

  const handleDesignUiInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    designUIForm.setValue("prompt", value);
    console.log("value", value);

    // check if value match with @
    const match = value.match(/@(\w*)$/);
    console.log(match);

    if (match) {
      setIsComponentMention(true);
      setFilteredComponents(
        UIComponentList.filter((c) =>
          c.label.toLowerCase().includes(match[1].toLowerCase())
        ) ?? []
      );
    } else {
      setIsComponentMention(false);
    }
  };

  const handleComponentSelect = (item: ToolDropdownType) => {
    const replacedPrompt = designUIForm
      .getValues()
      .prompt.replace(/@\w*$/, item.label);
    console.log("replacedPrompt", replacedPrompt);

    designUIForm.setValue("prompt", replacedPrompt);
    setIsComponentMention(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
    // onCodeChange(e.target.value);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-[95%] h-[95%] overflow-hidden">
        <div className="h-full">
          <DialogHeader>
            <DialogTitle>{ToolItem.title}</DialogTitle>
            <DialogDescription>{ToolItem.description}</DialogDescription>
            {/* <DialogClose className="bg-red-500"/> */}
          </DialogHeader>
          <div className="grid grid-cols-4 gap-4 py-6 h-full my-10">
            <div className="col-span-3 bg-white dark:bg-gray-900 p-2 rounded-lg h-full  overflow-auto" style={{maxHeight: "min(100vh - 2em, 600px"}}>
              {toolType === 0 && (
                <Form {...promptEnhancerForm}>
                  <form
                    onSubmit={promptEnhancerForm.handleSubmit(
                      OnSubmitPromptEnhance
                    )}
                  >
                    <FormField
                      control={promptEnhancerForm.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem>
                          <Input
                            className="focus-visible:ring-0 w-full"
                            placeholder="Type your prompt here."
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={promptEnhancerForm.control}
                      name="context"
                      render={({ field }) => (
                        <FormItem>
                          <Textarea
                            placeholder="Add context for better output (optional)"
                            className="mt-4 w-full grid min-h-[150px]"
                            {...field}
                          />
                        </FormItem>
                      )}
                    />

                    <Button
                      disabled={isLoading}
                      type="submit"
                      className="flex items-center w-full mt-4"
                    >
                      {isLoading ? (
                        <BounceLoader />
                      ) : (
                        <div className="flex items-center">
                          <SparklesIcon className="h-5 w-5 mr-2" />
                          <span>Enhance</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              )}

              {toolType === 1 && (
                <Form {...rewriteForm}>
                  <form
                    onSubmit={rewriteForm.handleSubmit(OnSubmitRewriteEnhance)}
                  >
                    <FormField
                      control={rewriteForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <Input
                            className="focus-visible:ring-0 w-full"
                            placeholder="Type your content here..."
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4 items-center mt-4">
                      <FormField
                        control={rewriteForm.control}
                        name="tone"
                        render={({ field }) => (
                          <FormItem>
                            <label className="block text-sm font-medium">
                              Tone
                            </label>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a tone" />
                              </SelectTrigger>
                              <SelectContent>
                                {toneOptions.map((option) => (
                                  <SelectItem
                                    key={option.id}
                                    value={option.id.toString()}
                                  >
                                    {option.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={rewriteForm.control}
                        name="contentLength"
                        render={({ field }) => (
                          <FormItem>
                            <label className="block text-sm font-medium">
                              Length
                            </label>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select length" />
                              </SelectTrigger>
                              <SelectContent>
                                {lengthLabels.map((option) => (
                                  <SelectItem
                                    key={option.id}
                                    value={option.id.toString()}
                                  >
                                    {option.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={rewriteForm.control}
                      name="context"
                      render={({ field }) => (
                        <FormItem>
                          <Textarea
                            placeholder="Add context for better output (optional)"
                            className="mt-4 min-h-[150px]"
                            {...field}
                          />
                        </FormItem>
                      )}
                    />

                    <Button
                      disabled={isLoading}
                      type="submit"
                      className="flex items-center w-full mt-4"
                    >
                      {isLoading ? (
                        <BounceLoader />
                      ) : (
                        <div className="flex items-center">
                          <PencilIcon className="h-5 w-5 mr-2" />
                          <span>Enhance Content</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              )}

              {toolType === 2 && (
                <Form {...summarizeForm}>
                  <form
                    onSubmit={summarizeForm.handleSubmit(
                      OnSubmitSummarizeEnhance
                    )}
                  >
                    <FormField
                      control={summarizeForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <Input
                            className="focus-visible:ring-0 w-full"
                            placeholder="Type your content here..."
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4 items-center mt-4">
                      <FormField
                        control={summarizeForm.control}
                        name="length"
                        render={({ field }) => (
                          <FormItem>
                            <label className="block text-sm font-medium">
                              Style
                            </label>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select length" />
                              </SelectTrigger>
                              <SelectContent>
                                {summaryLengths.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={summarizeForm.control}
                        name="style"
                        render={({ field }) => (
                          <FormItem>
                            <label className="block text-sm font-medium">
                              Style
                            </label>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a style" />
                              </SelectTrigger>
                              <SelectContent>
                                {summarizationStyles.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={summarizeForm.control}
                      name="emphasis"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <label className="block text-sm font-medium">
                            Emphasis
                          </label>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select emphasis" />
                            </SelectTrigger>
                            <SelectContent>
                              {contextEmphasis.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label} ({option.description})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={summarizeForm.control}
                      name="context"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <Textarea
                            placeholder="Add context for better output (optional)"
                            className="mt-4 min-h-[150px]"
                            {...field}
                          />
                        </FormItem>
                      )}
                    />

                    <Button
                      disabled={isLoading}
                      type="submit"
                      className="flex items-center w-full mt-4"
                    >
                      {isLoading ? (
                        <BounceLoader />
                      ) : (
                        <div className="flex items-center">
                          <PencilIcon className="h-5 w-5 mr-2" />
                          <span>Enhance Content</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              )}

              {toolType === 3 && (
                <Form {...bugFixForm}>
                  <form onSubmit={bugFixForm.handleSubmit(OnSubmitBugFix)}>
                    <FormField
                      control={bugFixForm.control}
                      name="code"
                      render={({ field, formState, fieldState }) => (
                        <FormItem>
                          <CodeBlockEditor
                            language="javascript"
                            placeholder="Write your code here..."
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bugFixForm.control}
                      name="detection"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <label className="block text-sm font-medium">
                            Bug Type
                          </label>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select bug type" />
                            </SelectTrigger>
                            <SelectContent>
                              {aiBugDetectionOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label} ({option.description})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bugFixForm.control}
                      name="analysis"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <label className="block text-sm font-medium">
                            Code Analysis
                          </label>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a style" />
                            </SelectTrigger>
                            <SelectContent>
                              {aiCodeAnalysis.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label} ({option.description})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      disabled={isLoading}
                      type="submit"
                      className="flex items-center w-full mt-4"
                    >
                      {isLoading ? (
                        <BounceLoader />
                      ) : (
                        <div className="flex items-center">
                          <PencilIcon className="h-5 w-5 mr-2" />
                          <span>Enhance Content</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              )}

              {toolType === 4 && (
                <Form {...langTranslationForm}>
                  <form
                    onSubmit={langTranslationForm.handleSubmit(
                      OnSubmitLangTranslation
                    )}
                  >
                    <FormField
                      control={langTranslationForm.control}
                      name="code"
                      render={({ field, formState, fieldState }) => (
                        <FormItem>
                          <CodeBlockEditor
                            language="javascript"
                            placeholder="Write your code here..."
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={langTranslationForm.control}
                      name="targetLanguage"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <label className="block text-sm font-medium">
                            Target Language
                          </label>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a language" />
                            </SelectTrigger>
                            <SelectContent>
                              {targetLanguages.map((option) => (
                                <SelectItem
                                  key={option.id}
                                  value={option.id.toString()}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={langTranslationForm.control}
                      name="context"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <Textarea
                            placeholder="Add context for better output (optional)"
                            className="mt-4 min-h-[150px]"
                            {...field}
                          />
                        </FormItem>
                      )}
                    />
                    <Button
                      disabled={isLoading}
                      type="submit"
                      className="flex items-center w-full mt-4"
                    >
                      {isLoading ? (
                        <BounceLoader />
                      ) : (
                        <div className="flex items-center">
                          <PencilIcon className="h-5 w-5 mr-2" />
                          <span>Enhance Content</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              )}

              {toolType === 5 && (
                <Form {...designUIForm}>
                  <form onSubmit={designUIForm.handleSubmit(OnSubmitDesignUI)}>
                    <FormField
                      control={designUIForm.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem>
                          <Popover open={IsComponentMention}>
                            <PopoverTrigger asChild>
                              <div>
                                <Input
                                  placeholder="Describe about your design here.."
                                  onChange={handleDesignUiInputChange}
                                  value={field.value}
                                />
                                <Label className="text-xs text-gray-400 dark:text-gray-600">
                                  Type @component to list all UI components
                                  available
                                </Label>
                              </div>
                            </PopoverTrigger>

                            {IsComponentMention && (
                              <PopoverContent className="w-80 mt-[-30px]">
                                <Command className="rounded-lg border shadow-md md:min-w-[300px] -z-10">
                                  <CommandInput placeholder="Type a command or search..." />
                                  <ScrollArea className="h-52 rounded-md border">
                                    <CommandList>
                                      <CommandEmpty>
                                        No results found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {filteredComponents.length > 0 ? (
                                          filteredComponents.map((c) => (
                                            <CommandItem
                                              key={c.id}
                                              onSelect={() =>
                                                handleComponentSelect(c)
                                              }
                                            >
                                              {c.label}
                                            </CommandItem>
                                          ))
                                        ) : (
                                          <div className="p-2 text-sm text-gray-500">
                                            No results found
                                          </div>
                                        )}
                                      </CommandGroup>
                                    </CommandList>
                                  </ScrollArea>
                                </Command>
                              </PopoverContent>
                            )}
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={designUIForm.control}
                      name="framework"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <label className="block text-sm font-medium">
                            Style Framework
                          </label>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a style" />
                            </SelectTrigger>
                            <SelectContent>
                              {styleFramework.map((option) => (
                                <SelectItem
                                  key={option.id}
                                  value={option.id.toString()}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={designUIForm.control}
                      name="context"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <Textarea
                            placeholder="Add context for better output (optional)"
                            className="mt-4 min-h-[150px]"
                            {...field}
                          />
                        </FormItem>
                      )}
                    />

                    <Button
                      disabled={isLoading}
                      type="submit"
                      className="flex items-center w-full mt-4"
                    >
                      {isLoading ? (
                        <BounceLoader />
                      ) : (
                        <div className="flex items-center">
                          <PencilIcon className="h-5 w-5 mr-2" />
                          <span>Design UI</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              )}

              {toolType === 6 && (
                <Form {...unitTestForm}>
                  <form onSubmit={unitTestForm.handleSubmit(OnSubmitUnitTest)}>
                    <FormField
                      control={unitTestForm.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <CodeBlockEditor
                            language="javascript"
                            placeholder="Write your code here..."
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={unitTestForm.control}
                      name="targetFrameWork"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <label className="block text-sm font-medium">
                            Testing Framework
                          </label>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a style" />
                            </SelectTrigger>
                            <SelectContent>
                              {targetUnitFrameworks.map((option) => (
                                <SelectItem
                                  key={option.id}
                                  value={option.id.toString()}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={unitTestForm.control}
                      name="context"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <Textarea
                            placeholder="Add context for better output (optional)"
                            className="mt-4 min-h-[150px]"
                            {...field}
                          />
                        </FormItem>
                      )}
                    />

                    <Button
                      disabled={isLoading}
                      type="submit"
                      className="flex items-center w-full mt-4"
                    >
                      {isLoading ? (
                        <BounceLoader />
                      ) : (
                        <div className="flex items-center">
                          <PencilIcon className="h-5 w-5 mr-2" />
                          <span>Generate Unit Test</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              )}

              {promptEnhanceResult !== "" && (
                <div ref={promptEnhancerRef} className="grid w-full gap-2 relative mt-4">
                  {toolType !== 4 && toolType !== 6 && toolType !== 5 ? (
                    <Textarea
                      rows={1}
                      readOnly
                      value={promptEnhanceResult}
                      className="h-full focus-visible:ring-0 pr-10 min-h-[300px]"
                    />
                  ) : toolType === 5 ? (
                    <Tabs defaultValue="preview" className="w-full">
                      <TabsList>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="code">Code</TabsTrigger>
                      </TabsList>
                      <TabsContent value="preview" className="my-5 overflow-hidden">
                        <CodePreview code={promptEnhanceResult} />
                      </TabsContent>
                      <TabsContent value="code" className="my-5 overflow-hidden">
                        <CodeBlockEditor
                          language="javascript"
                          placeholder="Write your code here..."
                          defaultCode={promptEnhanceResult}
                          readOnly={true}
                          isInput={false}
                        />
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <CodeBlockEditor
                      language="javascript"
                      placeholder="Write your code here..."
                      defaultCode={promptEnhanceResult}
                      readOnly={true}
                      isInput={false}
                    />
                  )}
                  {promptCopyStatus === "idle" && (
                    <CopyIcon
                      className="h-5 w-5 absolute top-2 right-2 cursor-pointer"
                      onClick={handleCopyPromptEnhance}
                    />
                  )}
                  {promptCopyStatus === "success" && (
                    <CheckCheckIcon className="h-5 w-5 absolute top-2 right-2 text-green-500" />
                  )}
                  {promptCopyStatus === "error" && (
                    <XIcon className="h-5 w-5 absolute top-2 right-2 text-red-500" />
                  )}
                </div>
              )}
            </div>

            <div className="col-span-1 border-l border-gray-200 px-2">
              <h3 className="text-lg font-semibold mb-4">⚙️ Tools List</h3>
              <ul className="space-y-2 text-sm">
                {toolList.map((tool, index) => (
                  <li
                    onClick={() => handleToolTypeChange(tool.id)}
                    key={tool.id}
                    className={`flex items-center ${
                      toolType === tool.id
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    } p-2 rounded-md cursor-pointer ${
                      tool.disable ? "opacity-40 pointer-events-none" : ""
                    }`}
                  >
                    <tool.icon
                      className="h-5 w-5 mr-2"
                      style={{ color: COLOR_CODE[index % COLOR_CODE.length] }}
                    />
                    <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                      {tool.title}
                      {/* {
                      tool.isNewFeature && <Badge variant={"secondary"} className="ml-2 pb-1 px-3 text-xs rounded-2xl">New</Badge>
                    } */}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
