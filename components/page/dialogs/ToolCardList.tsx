import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ToolCardListType } from "@/lib/model/toolsModel"
import {
  BrushIcon,
  BugIcon,
  CogIcon,
  ComputerIcon, FileIcon, LanguagesIcon,
  ListCheckIcon, NotebookPenIcon,
  PencilIcon,
  SparklesIcon
} from "lucide-react"
interface Tool {
  id: number
  title: string
  icon: any
  description: string
  type: string
  disable?: boolean;
  tags: string[]
  action?: () => void
}



const toolList: Tool[] = [
    {
      id: 0,
      title: "Prompt Enhancer",
      description: "Enhance your prompts and rewrite content with AI assistance",
      icon: SparklesIcon,
      type: "AI Writing Tool",
      tags: ["Prompt", "Rewrite", "Enhance"],
    },
    {
      id: 1,
      title: "Rewrite sentence",
      description: "Rewrite your sentences with AI assistance",
      icon: PencilIcon,
      type: "AI Writing Tool",
      tags: ["Rewrite", "Content", "Sentence"],
    },
    {
      id: 2,
      title: "Summarize",
      description: "Summarize your content with different style and emphasis",
      icon: FileIcon,
      type: "AI Writing Tool",
      tags: ["Summarize", "Content", "AI"],
    },
    {
      id: 3,
      title: "Bug Fix",
      description: "Efficiently fix bugs in your code and provide suggestions for improvement",
      icon: BugIcon,
      type: "Developer Tool",
      tags: ["Bug", "Fix", "Code"],
    },
    {
      id: 4,
      title: "Language Translation",
      description: "Translate Language or Programming Language from one to another",
      icon: LanguagesIcon,
      type: "Translator Tool",
      tags: ["Translate", "Language", "Code"],
    },
    {
      id: 5,
      title: "Design UI",
      description: "Design a user interface for your web application, mobile app, or website",
      icon: BrushIcon,
      type: "Design Tool",
      tags: ["UI", "Design", "Wireframe"],
    },
    {
      id: 6,
      title: "Unit Testing",
      description: "Effiently write unit tests for your code, don't need manual testing",
      icon: CogIcon,
      type: "Developer Tool",
      tags: ["Testing", "Unit Test", "Automation"],
    },
    {
      id: 7,
      title: "Dev Toolkit",
      description: "A collection of essential tools to streamline your development workflow and boost productivity",
      icon: ComputerIcon,
      type: "Developer Tool",
      tags: ["Toolkit", "DevTools", "Utility"],
    },
    // {
    //   id: 8,
    //   title: "Project Memorization",
    //   description: "To supercharge your coding speed, dive deep into your project's codebase and surroundings!",
    //   icon: BrainIcon,
    //   type: "Developer Tool",
    //   tags: ["Memorization", "Project", "Productivity"],
    //   disable: true,
    // },
    {
      id: 8,
      title: "Technical Writing",
      description: "Craft compelling and informative technical content with our AI-powered writing assistant.",
      icon: NotebookPenIcon,
      type: "AI Writing Tool",
      tags: ["Writing", "Documentation", "AI"],
      disable: true,
    },
    {
      id: 9,
      title: "Daily checklist",
      description: "List of tasks to keep you organized and on track with your day-to-day tasks.",
      icon: ListCheckIcon,
      type: "Productivity Tool",
      tags: ["Checklist", "Tasks", "Daily"],
      disable: true,
    }
  ]
  

  export default function ToolCardList({toolSelectionHandler}: ToolCardListType) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 my-10">
        {toolList.map((tool, index) => {
          const isDisabled = tool.disable ?? false
  
          return (
            <Card
              key={index}
              className={`rounded-2xl border shadow-md transition-all duration-200 hover:shadow-xl bg-background p-1 relative ${
                isDisabled ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <tool.icon className="w-8 h-8 text-primary" />
                    <h3 className="text-xl font-semibold">{tool.title}</h3>
                  </div>
                  {tool.disable && (
                    <Badge variant="destructive" className="text-xs">
                      Coming Soon
                    </Badge>
                  )}
                </div>
  
                <p className="text-sm text-muted-foreground mb-4">
                  {tool.description}
                </p>
  
                <div className="flex flex-wrap gap-2 mb-5">
                  {tool.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="outline"
                      className="text-xs border-dashed px-2 py-0.5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
  
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-xs text-muted-foreground font-medium">
                    {tool.type}
                  </span>
                  <Button
                  onClick={() => toolSelectionHandler(tool.id)}
                    variant="default"
                    size="sm"
                    disabled={isDisabled}
                    className="rounded-full px-4 text-xs"
                  >
                    Use Tool
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }
  
