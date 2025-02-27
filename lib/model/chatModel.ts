export interface ChatModel {
    id: number;
    name: string;
    role: string;
    isError: boolean
}

export interface OllamaModelList {
    model: string;
    size: string;
    id: string;
}