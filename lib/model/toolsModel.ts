export interface ToolsModel {
    id: number;
    category: string;
    tools: Tool[];
}

export interface Tool {
    id: number;
    name: string;
    description: string;
}

export type PromptEnhanceFormType = {
    id: number,
    prompt: string,
    result: string
}

export type ToolDropdownType = {
    id: number,
    label: string,
    description?: string
}