/**
 * @file selfcheck-dashboard.tsx
 * @description Lightweight visual dashboard for viewing API selfcheck results.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { useEffect, useState } from "react";

interface SelfcheckResults {
  success: boolean;
  results: Record<string, boolean>;
}

export default function SelfcheckDashboard() {
  const [results, setResults] = useState<SelfcheckResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchSelfcheck() {
      try {
        const res = await fetch("/api/devtools/selfcheck-api");
        const data = await res.json();
        setResults(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSelfcheck();
  }, []);

  if (loading) {
    return <div>Loading selfcheck results...</div>;
  }

  if (error || !results) {
    return <div>Failed to load selfcheck results.</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🛡️ API Selfcheck Dashboard</h1>
      <p>Status: {results.success ? "✅ Healthy" : "❌ Issues Detected"}</p>
      <ul>
        {Object.entries(results.results).map(([check, passed]) => (
          <li key={check}>
            {passed ? "✅" : "❌"} {check}
          </li>
        ))}
      </ul>
    </div>
  );
}
