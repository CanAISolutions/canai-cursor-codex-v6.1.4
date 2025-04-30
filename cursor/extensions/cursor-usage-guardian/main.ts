import { addSidebarWidget, onTokenUsage } from "cursor-sdk";
import { estimateCost } from "./utils/costEstimator";

let totalTokens = 0;
let totalCost = 0;
let provider = "openai"; // default
let promptType = "general"; // fallback default

onTokenUsage(({ tokens, metadata }) => {
  totalTokens += tokens;
  
  // Assume metadata has 'provider' and 'promptType' if sent
  if (metadata?.provider) provider = metadata.provider;
  if (metadata?.promptType) promptType = metadata.promptType;
  
  const cost = estimateCost(provider, tokens);
  totalCost += cost;

  // Publish updates to the UI
  postMessage({
    type: "USAGE_UPDATE",
    payload: {
      totalTokens,
      totalCost,
      provider,
      promptType
    }
  });
});

addSidebarWidget({
  title: "Usage Guardian",
  src: "ui.tsx",
});
