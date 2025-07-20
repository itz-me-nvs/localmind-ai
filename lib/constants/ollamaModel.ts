import { ChatOllama } from "@langchain/ollama";
import { OLLAMA_BASE_URL } from "./common.constant";

export const ollamaLLM = new ChatOllama({
  model: "qwen2.5:0.5b",
  temperature: 0,
  maxRetries: 2,
  baseUrl: OLLAMA_BASE_URL,
  // other params...
});