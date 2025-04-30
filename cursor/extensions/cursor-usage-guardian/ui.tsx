import React, { useEffect, useState } from "react";

export default function UsageGuardianWidget() {
  const [stats, setStats] = useState({
    totalTokens: 0,
    totalCost: 0,
    provider: "openai",
    promptType: "general"
  });

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const { type, payload } = event.data;
      if (type === "USAGE_UPDATE") {
        setStats(payload);
      }
    });
  }, []);

  return (
    <div style={{ padding: "12px", fontFamily: "Inter, sans-serif", fontSize: "13px" }}>
      <h3 style={{ marginBottom: "8px" }}>Usage Stats</h3>
      <div><strong>Tokens:</strong> {stats.totalTokens}</div>
      <div><strong>Cost:</strong> ${stats.totalCost.toFixed(4)}</div>
      <div><strong>Provider:</strong> {stats.provider}</div>
      <div><strong>PromptType:</strong> {stats.promptType}</div>
    </div>
  );
}
