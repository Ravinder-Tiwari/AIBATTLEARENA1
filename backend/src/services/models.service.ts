import { ChatGoogle } from "@langchain/google";
import {ChatMistralAI} from "@langchain/mistralai"
import {ChatCohere} from "@langchain/cohere";
import appConfig from "../config/config.js";

export const geminiModel = new ChatGoogle({
  apiKey: appConfig.GOOGLE_API_KEY,
  model: "gemini-flash-latest",
});


export const mistralModel = new ChatMistralAI({
  apiKey: appConfig.MISTRAL_API_KEY,
  model: "mistral-medium-latest",
});

export const cohereModel = new ChatCohere({
  apiKey: appConfig.COHERE_API_KEY,
  model: "command-a-03-2025",
});