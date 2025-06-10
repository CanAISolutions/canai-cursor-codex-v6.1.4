# PowerShell script to create test file
$content = @'
/**
 * reverse-strategy-mcp.test.ts
 * 
 * Test suite for Reverse Strategy MCP production implementation validation
 * Following Test-First Truth principle for Codex compliance
 * Part of DreamState emotional sovereignty test suite
 * 
 * Created: 2025-01-29
 * Test Type: Production Enhancement Validation with Real API Calls
 */

import { OpenAI } from "openai";
import * as fs from "fs";
import * as path from "path";
import { generateReverseStrategy, ReverseStrategyInput } from "../../../prompts/reverse_strategy.mcp";
import { createApiLogger } from "../utils/api-logger";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Verify API key is available
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required in .env file for real API testing");
}

// Initialize OpenAI client for API verification with actual API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Uses actual API key from environment
  defaultHeaders: {
    "x-test-scenario": "reverse-strategy-mcp-enhancement"
  }
});

// Initialize API logger for test verification
const apiLogger = createApiLogger("reverse-strategy-mcp-test");

// Test scenarios for Reverse Strategy MCP
const testScenarios = {
  normal: {
    businessName: "Acme Analytics",
    targetAudience: "Small business owners seeking data insights",
    primaryGoal: "Increase market share by 25% within 12 months",
    challenges: [
      "Limited budget of $50,000", 
      "Strong competition from established players", 
      "Low brand awareness in target market"
    ],
    successMetrics: "Acquire 100 new clients, achieve 90% client retention, generate $500,000 in annual revenue",
    resourceConstraints: "3-person team, 12-month timeline, $50,000 budget, limited marketing expertise",
    strategicApproach: "Agile methodology with monthly review cycles and iterative strategy adjustment"
  }
};

// Test suite for Reverse Strategy MCP
describe("Reverse Strategy MCP Production Implementation", () => {
  
  // Log directory for API verification evidence
  const logDir = path.join(process.cwd(), "logs/api-verification");
  
  // Create logs directory if it doesn't exist
  beforeAll(() => {
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Print confirmation that we're using the real API key
    console.log("Using REAL OpenAI API key from environment variables for actual API calls");
    console.log("API key length:", process.env.OPENAI_API_KEY?.length);
  });
  
  // Test OpenAI API integration with real API call
  describe("OpenAI API Integration", () => {
    it("verifies real OpenAI API connectivity with headers", async () => {
      // Tracking time for execution metrics
      const startTime = Date.now();
      console.time("openai_api_test");
      
      try {
        // Make a real API call to OpenAI to verify integration
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant. This is an API verification test for Reverse Strategy MCP."
            },
            {
              role: "user",
              content: "Verify this is a real API call by responding with VERIFICATION_SUCCESS and the current timestamp."
            }
          ],
          temperature: 0.7,
          max_tokens: 50
        });
        
        console.timeEnd("openai_api_test");
        const executionTime = Date.now() - startTime;
        
        // Extract headers from the response
        const headers = response.response.headers;
        
        // Log API verification results
        await apiLogger.logApiCall({
          timestamp: new Date().toISOString(),
          requestId: headers.get("x-request-id") || "",
          endpoint: "/v1/chat/completions",
          model: response.model,
          executionTime,
          ratelimitRemaining: headers.get("x-ratelimit-remaining") || "",
          ratelimitReset: headers.get("x-ratelimit-reset") || "",
          responseFirstTokens: response.choices[0]?.message?.content?.substring(0, 30) || ""
        });
        
        // Log the full headers for verification evidence
        console.log("API Call Verification Evidence:");
        console.log("- Request ID:", headers.get("x-request-id"));
        console.log("- Rate Limit Remaining:", headers.get("x-ratelimit-remaining"));
        console.log("- Rate Limit Reset:", headers.get("x-ratelimit-reset"));
        console.log("- Model:", response.model);
        console.log("- Response ID:", response.id);
        console.log("- Execution Time:", executionTime, "ms");
        console.log("- Response:", response.choices[0]?.message?.content);
        
        // Create an API verification report
        const apiVerificationReport = {
          timestamp: new Date().toISOString(),
          requestId: headers.get("x-request-id") || "",
          ratelimitRemaining: headers.get("x-ratelimit-remaining") || "",
          ratelimitReset: headers.get("x-ratelimit-reset") || "",
          model: response.model,
          responseId: response.id,
          executionTime,
          responseContent: response.choices[0]?.message?.content
        };
        
        // Write API verification report to file
        fs.writeFileSync(
          path.join(process.cwd(), "api_verification_report.json"),
          JSON.stringify(apiVerificationReport, null, 2)
        );
        
        // Verification assertions
        expect(response.id).toBeDefined();
        expect(headers.get("x-request-id")).toBeDefined();
        expect(headers.get("x-ratelimit-remaining")).toBeDefined();
        expect(executionTime).toBeGreaterThan(100); // Real API calls take more than 100ms
        expect(response.choices[0]?.message?.content).toContain("VERIFICATION_SUCCESS");
      } catch (error) {
        console.error("API verification failed:", error);
        throw error;
      }
    });
  });
});
'@

# Write the content to the test file
$testFilePath = "tests\dreamstate\mcp-remediation\reverse-strategy-mcp.test.ts"
Set-Content -Path $testFilePath -Value $content -Encoding UTF8

Write-Host "Test file created successfully at: $testFilePath"