export interface ChatModel {
    id: number;
    content: string;
    role: string;
    isError: boolean
}

export interface OllamaModelList {
    model: string;
    size: string;
    id: string;
}

export interface OllamaAPIChatRequestModel {
    role: string;
    content: string;
}

export interface ChatHistoryModel {
    id: string;
    title: string;
    date: string;
}