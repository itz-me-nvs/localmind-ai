import { FormScheme } from "@/app/chat/[...slug]/page";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCheckIcon, CopyIcon, SparklesIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import z from "zod";


type PromptEnhancerModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    OnSubmitPromptEnhanceHandler: (data: z.infer<typeof FormScheme>) => void,
    promptEnhanceResult: string,
    handleCopyPromptEnhance: () => void,
    promptCopyStatus: "idle" | "success" | "error"
}

export default function PromptEnhancerModal({open, onOpenChange, OnSubmitPromptEnhanceHandler, promptEnhanceResult, handleCopyPromptEnhance, promptCopyStatus}: PromptEnhancerModalProps){
    const {handleSubmit, getFieldState, control} = useFormContext()
    const [toolType, setToolType] = useState<number>(0);


    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[700px] max-h-[800px] h-auto overflow-auto">
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
        <SparklesIcon className="h-5 w-5 mr-2" />
        <span>Enhance</span>
      </Button>
    </form>

    <div className="grid w-full gap-2 relative mt-4">
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
  </div>

            {/* <Separator /> */}

            <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">⚙️ Tools List</h3>
    <ul className="space-y-2 text-sm">
      <li className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer">
        ✨Prompt Enhancer
      </li>
      <li className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer">
        📄 Document Generator
      </li>
      <li className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer">
        🎨 Image Generator
      </li>
      <li className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer">
        🤖 Code Refactor
      </li>
      <li className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md cursor-pointer">
        📜 Text Summarizer
      </li>
    </ul>
            </div>
          </div>
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
        </DialogContent>
      </Dialog>
    );

}


// <form
//               onSubmit={handleSubmit(OnSubmitPromptEnhanceHandler as any)}
//               className="grid grid-cols-4 items-center gap-4"
//             >
//               <FormField
//                 control={control}
//                 name="prompt"
//                 render={({ field }) => (
//                   <FormItem className="col-span-3">
//                     <Input
//                       className="focus-visible:ring-0"
//                       placeholder="Type your prompt here."
//                       {...field}
//                     />

//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button
//                 type="submit"
//                 className="flex items-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
//               >
//                 <SparklesIcon className="h-5 w-5" />
//                 <span>Enhance</span>
//               </Button>
//             </form>