export interface ChatModel {
    id: number;
    messageId: number;
    content: string;
    role: string;
    isError: boolean
    keepChat?: boolean
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
    dateInFormat: string;
    date: string;
    dataClosed: boolean
}

export interface ChatMessageIndexDBSaveModel {
    role: string;
    content: string;
    messageId: number;
}