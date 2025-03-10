import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";



type ToolsModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // form: any,
    // OnSubmitPromptEnhanceHandler: (data: z.infer<typeof FormScheme>) => void,
    // promptEnhanceResult: string,
    // handleCopyPromptEnhance: () => void,
    // promptCopyStatus: "idle" | "success" | "error"
}

export default function ToolsModal({open, onOpenChange}: ToolsModalProps){
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
<DialogContent className="max-w-[600px] max-h-[600px] h-auto overflow-auto">
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

  <div className="grid gap-4 py-4">

    </div>


    <DialogFooter>

  </DialogFooter>
  </DialogContent>
    </Dialog>
    )
}