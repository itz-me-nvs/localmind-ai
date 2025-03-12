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
  PaintbrushIcon,
  PencilIcon,
  ShieldCheckIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
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
});

const rewriteScheme = z.object({
  message: z.string().min(1, {
    message: "Prompt is required",
  }),
  tone: z.string().min(1, {
    message: "Tone is required",
  }),
  contentLength: z.string().min(1, {
    message: "Content Length is required",
  }),
  // context:  z.string().min(1, {
  //   message: "Content Length is required",
  // }),
});



export default function PromptEnhancerModal({
  open,
  onOpenChange,
}: PromptEnhancerModalProps) {
  const [toolType, setToolType] = useState<number>(0);
  const [tone, setTone] = useState("Professional");
  const [contentLength, setContentLength] = useState("Short");
  const [context, setContext] = useState("");
  const [promptCopyStatus, setPromptCopyStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [promptEnhanceResult, setPromptEnhanceResult] = useState<string>("");

  const COLOR_CODE = FANCY_COLORS;

  const toolList = [
    {
      id: 0,
      name: "Prompt Enhancer",
      icon: SparklesIcon,
    },
    {
      id: 1,
      name: "Rewrite sentence",
      icon: PencilIcon,
    },
    {
      id: 2,
      name: "Summarize",
      icon: FileIcon,
    },
    {
      id: 3,
      name: "Bug Fix",
      icon: BugIcon,
    },
    {
      id: 4,
      name: "Refactor Code",
      icon: ShieldCheckIcon,
    },
    {
      id: 5,
      name: "Design UI",
      icon: PaintbrushIcon,
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


  const promptEnhancerForm = useForm<z.infer<typeof promptEnhanceScheme>>({
    resolver: zodResolver(promptEnhanceScheme),
    defaultValues: {
      prompt: "",
    },
  });

  const rewriteForm = useForm<z.infer<typeof rewriteScheme>>({
    resolver: zodResolver(rewriteScheme),
    defaultValues: {
      message: "",
      tone: '1',
      contentLength: '1',
      // context: "",
    },
  });


  const handleLengthLabel = (value: number) => {
    if (value <= 40) return lengthLabels[0];
    if (value <= 80) return lengthLabels[1];
    if (value <= 120) return lengthLabels[2];
    if (value <= 160) return lengthLabels[3];
    return lengthLabels[4];
  };

  async function OnSubmitPromptEnhance(
    data: z.infer<typeof promptEnhanceScheme>
  ) {
    if (data.prompt) {
      const response = await axios.post("/api/ollama/generate", {
        model: "qwen2.5:0.5b",
        prompt: `Improve the clarity, effectiveness, and engagement of the following prompt **without answering it**. Do not provide a response to the prompt itself; just refine its wording for better AI interaction:\n\n"${data.prompt}"`,
        stream: false,
      });

      const enhancedPrompt = response?.data?.response || "";
      setPromptEnhanceResult(enhancedPrompt);

      console.log("response", enhancedPrompt);
    }
  }

  async function OnSubmitRewriteEnhance(data: z.infer<typeof rewriteScheme>) {
    // if (data.prompt) {
    //   const response = await axios.post("/api/ollama/generate", {
    //     model: "qwen2.5:0.5b",
    //     prompt: `Improve the clarity, effectiveness, and engagement of the following prompt **without answering it**. Do not provide a response to the prompt itself; just refine its wording for better AI interaction:\n\n"${data.prompt}"`,
    //     stream: false,
    //   });

    //   const enhancedPrompt = response?.data?.response || "";
    //   setPromptEnhanceResult(enhancedPrompt);

    //   console.log("response", enhancedPrompt);
    // }
    console.log("data", data);

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

  const renderToolBasedFormUI = () => {
    switch (toolType) {
      case 0:
        return (
          // <FormProvider {...promptEnhancerForm}>
            <Form
             {...promptEnhancerForm}
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

<Textarea
            placeholder="Add context for better output (optional)"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="mt-4 w-full grid"
          />


              <Button
                type="submit"
                className="flex items-center w-full mt-4"
              >
                <SparklesIcon className="h-5 w-5 mr-1" />
                Enhance
              </Button>

            </Form>
          // </FormProvider>
        );

      case 1:
       return (
        // <FormProvider {...rewriteForm}>
        <form
          onSubmit={rewriteForm.handleSubmit(OnSubmitRewriteEnhance)}
          className="grid gap-4"
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

          <div className="grid grid-cols-2 gap-4 items-center">
            <FormField
              control={rewriteForm.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <label className="block text-sm font-medium">Tone</label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id.toString()}>
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
                  <label className="block text-sm font-medium">Length</label>
                  <Select
                 onValueChange={field.onChange}
                 defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  {lengthLabels.map((option) => (
                    <SelectItem key={option.id} value={option.id.toString()}>
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

          <Textarea
            placeholder="Add context for better output (optional)"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="mt-4"
          />

          <Button type="submit" className="flex items-center w-full mt-4">
            <PencilIcon className="h-5 w-5 mr-2" /> Enhance Content
          </Button>


        </form>
      // </FormProvider>
       )

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] w-full max-h-[800px] h-auto overflow-auto">
        <DialogHeader>
          <DialogTitle>Prompt Enhancer </DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4 h-full">
          <div className="col-span-3 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
            {renderToolBasedFormUI()}
           {
            promptEnhanceResult != "" &&  <div className="grid w-full gap-2 relative mt-4">
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
           }
          </div>

          {/* <Separator /> */}

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">⚙️ Tools List</h3>

            <ul className="space-y-2 text-sm">
              {toolList.map((tool, index) => (
                <li
                  onClick={() => setToolType(tool.id)}
                  key={tool.id}
                  className={`flex items-center ${
                    toolType == tool.id
                      ? "bg-gray-200 dark:bg-gray-700"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  } p-2 rounded-md cursor-pointer`}
                >
                  <tool.icon
                    className={`h-5 w-5 mr-2`}
                    style={{ color: COLOR_CODE[index % COLOR_CODE.length] }}
                  />
                  <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap">
                    {tool.name}
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
