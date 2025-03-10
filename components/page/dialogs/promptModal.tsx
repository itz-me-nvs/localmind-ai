import { FormScheme } from "@/app/chat/[...slug]/page";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { FANCY_COLORS } from "@/lib/constants/common.constant";
import { BugIcon, CheckCheckIcon, CopyIcon, FileIcon, PaintbrushIcon, PencilIcon, ShieldCheckIcon, SparklesIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import z from "zod";

type PromptEnhancerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  OnSubmitPromptEnhanceHandler: (data: z.infer<typeof FormScheme>) => void;
  promptEnhanceResult: string;
  handleCopyPromptEnhance: () => void;
  promptCopyStatus: "idle" | "success" | "error";
};

export default function PromptEnhancerModal({
  open,
  onOpenChange,
  OnSubmitPromptEnhanceHandler,
  promptEnhanceResult,
  handleCopyPromptEnhance,
  promptCopyStatus,
}: PromptEnhancerModalProps) {
  const { handleSubmit, getFieldState, control } = useFormContext();
  const [toolType, setToolType] = useState<number>(0);
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState(50);
  const [context, setContext] = useState("");

  const COLOR_CODE = FANCY_COLORS;

  const toolList =  [
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
      name: 'Refactor Code',
      icon: ShieldCheckIcon,
    },
    {
      id: 5,
      name: 'Design UI',
      icon: PaintbrushIcon
    }
  ];

  const toneOptions = ["Professional", "Casual", "Friendly", "Concise", "Formal"];
  const lengthLabels = ["Very Short", "Short", "Medium", "Long", "Very Long"];


  const handleLengthLabel = (value: number) => {
    if (value <= 40) return lengthLabels[0];
    if (value <= 80) return lengthLabels[1];
    if (value <= 120) return lengthLabels[2];
    if (value <= 160) return lengthLabels[3];
    return lengthLabels[4];
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] w-full max-h-[800px] h-auto overflow-auto">
        <DialogHeader>
          <DialogTitle>
            Prompt Enhancer{" "}
            {/* <Badge className="ml-1" variant="secondary">
              New
            </Badge> */}
          </DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-4 py-4 h-full">
          <div className="col-span-3 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
           {
            toolType == 0 ? (
              <form
              onSubmit={handleSubmit(OnSubmitPromptEnhanceHandler as any)}
              className="grid grid-cols-4 items-center gap-4"
            >
              <FormField
                control={control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <Input
                      className="focus-visible:ring-0 w-full"
                      placeholder="Type your prompt here."
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded-md"
              >
                <SparklesIcon className="h-5 w-5 mr-1" />
                <span>Enhance</span>
              </Button>
            </form>
            ) : (
              <form
              onSubmit={handleSubmit(OnSubmitPromptEnhanceHandler as any)}
              className="grid gap-4"
            >
              <FormField
                control={control}
                name="prompt"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Tone</label>
                  <Select onValueChange={setTone} defaultValue={tone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((option) => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Length</label>
                  <Slider
                    value={[length]}
                    onValueChange={(value) => setLength(value[0])}
                    min={10}
                    max={200}
                    step={10}
                  />
                  <span className="text-sm">{handleLengthLabel(length)}</span>
                </div>
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
            )
           }

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
                  <CheckCheckIcon
                    className="h-5 w-5 absolute top-2 right-2 text-green-500"
                  />
                )}
                {promptCopyStatus === "error" && (
                  <XIcon
                    className="h-5 w-5 absolute top-2 right-2 text-red-500"
                  />
                )}
              </div>
          </div>

          {/* <Separator /> */}

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">⚙️ Tools List</h3>

            <ul className="space-y-2 text-sm">
              {
                toolList.map((tool, index) => (
                  <li onClick={()=> setToolType(tool.id)} key={tool.id} className={`flex items-center ${toolType == tool.id ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-200 dark:hover:bg-gray-700"} p-2 rounded-md cursor-pointer`}>
                    <tool.icon className={`h-5 w-5 mr-2`} style={{ color: COLOR_CODE[index % COLOR_CODE.length] }} />
                    <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap">{tool.name}</span>
                  </li>
                ))
              }
            </ul>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



 {/* <DialogFooter>
            <div className="grid w-full gap-2 relative">
              <Textarea
                rows={1}
                cols={1}
                readOnly
                value={promptEnhanceResult}
                className="min-h-[80px] focus-visible:ring-0 pr-10"
              />
              {promptCopyStatus == "idle" && (
                <CopyIcon
                  className="h-5 w- absolute top-2 right-2 cursor-pointer"
                  onClick={handleCopyPromptEnhance}
                />
              )}

              {promptCopyStatus == "success" && (
                <CheckCheckIcon
                  className="h-5 w- absolute top-2 right-2"
                  onClick={handleCopyPromptEnhance}
                />
              )}

              {promptCopyStatus == "error" && (
                <XIcon
                  className="h-5 w- absolute top-2 right-2"
                  onClick={handleCopyPromptEnhance}
                />
              )}
            </div>
          </DialogFooter> */}