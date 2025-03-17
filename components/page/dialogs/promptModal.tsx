import { BounceLoader } from "@/components/ui/bounceLoader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FANCY_COLORS } from "@/lib/constants/common.constant";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  BugIcon,
  CheckCheckIcon,
  CopyIcon,
  FileIcon,
  PencilIcon,
  ShieldCheckIcon,
  SparklesIcon,
  XIcon
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type PromptEnhancerModalProps = {
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

export default function PromptEnhancerModal({
  open,
  onOpenChange,
}: PromptEnhancerModalProps) {
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
      description:
        "Enhance your prompts and rewrite content with AI assistance",

      icon: PencilIcon,
    },
    {
      id: 2,
      title: "Summarize",
      description:
        "Enhance your prompts and rewrite content with AI assistance",
      icon: FileIcon,
    },
    {
      id: 3,
      title: "Bug Fix",
      description:
        "Enhance your prompts and rewrite content with AI assistance",
      icon: BugIcon,
    },
    {
      id: 4,
      title: "Refactor Code",
      description:
        "Enhance your prompts and rewrite content with AI assistance",
      icon: ShieldCheckIcon,
    },
    // {
    //   id: 5,
    //   title: "Design UI",
    //   description:
    //     "Enhance your prompts and rewrite content with AI assistance",
    //   icon: PaintbrushIcon,
    // },
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

  const [toolType, setToolType] = useState<number>(0);
  const [ToolItem, setToolItem] = useState(toolList[0]);
  const [context, setContext] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [promptCopyStatus, setPromptCopyStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [promptEnhanceResult, setPromptEnhanceResult] = useState<string>("");
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

  useEffect(() => {
    if (open) {
      promptEnhancerForm.reset();
      rewriteForm.reset();
      summarizeForm.reset();
      setToolType(0);
      setPromptEnhanceResult("");
    }
  }, [open]);

  // Reset forms when tool type changes
  const handleToolTypeChange = (newToolType: number) => {
    setToolType(newToolType);
    setPromptEnhanceResult("");

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] w-full max-h-[800px] h-auto overflow-auto">
        <DialogHeader>
          <DialogTitle>{ToolItem.title}</DialogTitle>
          <DialogDescription>{ToolItem.description}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4 h-full">
          <div className="col-span-3 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
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
                          className="mt-4 w-full grid"
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
                          className="mt-4"
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
                        <FormItem >
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
                          className="mt-4"
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

            {promptEnhanceResult !== "" && (
              <div className="grid w-full gap-2 relative mt-4">
                <Textarea
                  rows={1}
                  readOnly
                  value={promptEnhanceResult}
                  className="min-h-[120px] focus-visible:ring-0 pr-10"
                />
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

          <div className="col-span-1">
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
                  } p-2 rounded-md cursor-pointer`}
                >
                  <tool.icon
                    className="h-5 w-5 mr-2"
                    style={{ color: COLOR_CODE[index % COLOR_CODE.length] }}
                  />
                  <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                    {tool.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
