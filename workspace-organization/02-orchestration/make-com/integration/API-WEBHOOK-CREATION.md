#!/usr/bin/env node

/**
 * Make.com Webhook Creation Script
 * Creates all required webhook scenarios programmatically
 */

require('dotenv').config({ path: '.env.local' });
const https = require('https');

const MAKE_API_KEY = process.env.MAKE_API_KEY;
const MAKE_TEAM_ID = process.env.MAKE_TEAM_ID;
const MAKE_ORGANIZATION_ID = process.env.MAKE_ORGANIZATION_ID;

if (!MAKE_API_KEY) {
  console.error('❌ MAKE_API_KEY not found in .env.local');
  process.exit(1);
}

/**
 * Make API request helper
 */
async function makeApiRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'us2.make.com',
      path: `/api/v2${path}`,
      method: method,
      headers: {
        'Authorization': `Token ${MAKE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${response.message || body}`));
          }
        } catch (e) {
          reject(new Error(`Parse Error: ${body}`));
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Webhook scenario configurations
 */
const webhookScenarios = [
  {
    name: "Emotional Sovereignty Orchestrator",
    description: "Process every prompt interaction with emotional intelligence and trust scoring",
    folder: "CanAI Emotional Intelligence",
    blueprint: {
      "name": "Emotional Sovereignty Orchestrator",
      "flow": [
        {
          "id": 1,
          "module": "webhook:customWebhook",
          "version": 1,
          "parameters": {
            "hook": 1,
            "ip_restrictions": ""
          },
          "mapper": {},
          "metadata": {
            "designer": {
              "x": 0,
              "y": 0
            },
            "restore": {},
            "parameters": [
              {
                "name": "hook",
                "type": "hook",
                "label": "Webhook",
                "required": true
              }
            ]
          }
        },
        {
          "id": 2,
          "module": "builtin:BasicRouter",
          "version": 1,
          "routes": [
            {
              "flow": [
                {
                  "id": 3,
                  "module": "util:SetVariables",
                  "version": 1,
                  "parameters": {},
                  "mapper": {
                    "variables": [
                      {
                        "name": "sessionId",
                        "value": "{{1.sessionId}}"
                      },
                      {
                        "name": "trustScore",
                        "value": "{{1.trustScore}}"
                      },
                      {
                        "name": "emotionalCompass",
                        "value": {
                          "awe": "{{1.aweScore}}",
                          "ownership": "{{1.ownershipScore}}",
                          "wonder": "{{1.wonderScore}}",
                          "calm": "{{1.calmScore}}",
                          "power": "{{1.powerScore}}"
                        }
                      }
                    ]
                  }
                }
              ]
            }
          ],
          "filter": {
            "name": "Trust Score Router",
            "conditions": [
              [
                {
                  "a": "{{1.trustScore}}",
                  "b": "4.2",
                  "o": "number:gte"
                }
              ]
            ]
          }
        }
      ]
    }
  },
  {
    name: "User Intelligence Aggregator", 
    description: "Aggregate user profile data and predictive insights",
    folder: "CanAI User Intelligence",
    blueprint: {
      "name": "User Intelligence Aggregator",
      "flow": [
        {
          "id": 1,
          "module": "webhook:customWebhook",
          "version": 1,
          "parameters": {
            "hook": 1
          }
        },
        {
          "id": 2,
          "module": "util:SetVariables",
          "version": 1,
          "mapper": {
            "variables": [
              {
                "name": "userId",
                "value": "{{1.userId}}"
              },
              {
                "name": "sessionMetrics",
                "value": "{{1.sessionMetrics}}"
              },
              {
                "name": "userProfile",
                "value": "{{1.userProfile}}"
              }
            ]
          }
        }
      ]
    }
  },
  {
    name: "SparkSplit Processor",
    description: "Handle trust transparency comparisons between CanAI and sterile AI",
    folder: "CanAI SparkSplit Engine",
    blueprint: {
      "name": "SparkSplit Processor", 
      "flow": [
        {
          "id": 1,
          "module": "webhook:customWebhook",
          "version": 1,
          "parameters": {
            "hook": 1
          }
        },
        {
          "id": 2,
          "module": "util:SetVariables",
          "version": 1,
          "mapper": {
            "variables": [
              {
                "name": "sessionId",
                "value": "{{1.sessionId}}"
              },
              {
                "name": "canaiOutput",
                "value": "{{1.canaiOutput}}"
              },
              {
                "name": "trustDelta", 
                "value": "{{1.trustDelta}}"
              }
            ]
          }
        }
      ]
    }
  },
  {
    name: "SparkSplit Selection Handler",
    description: "Process user selections from SparkSplit comparisons",
    folder: "CanAI SparkSplit Engine", 
    blueprint: {
      "name": "SparkSplit Selection Handler",
      "flow": [
        {
          "id": 1,
          "module": "webhook:customWebhook",
          "version": 1,
          "parameters": {
            "hook": 1
          }
        },
        {
          "id": 2,
          "module": "util:SetVariables",
          "version": 1,
          "mapper": {
            "variables": [
              {
                "name": "userSelection",
                "value": "{{1.userSelection}}"
              },
              {
                "name": "timeToSelection",
                "value": "{{1.timeToSelection}}"
              },
              {
                "name": "wouldRefer",
                "value": "{{1.wouldRefer}}"
              }
            ]
          }
        }
      ]
    }
  }
];

/**
 * Create folder if it doesn't exist
 */
async function createFolder(folderName) {
  try {
    const folders = await makeApiRequest('GET', `/folders?teamId=${MAKE_TEAM_ID}`);
    const existingFolder = folders.find(f => f.name === folderName);
    
    if (existingFolder) {
      console.log(`📁 Folder "${folderName}" already exists`);
      return existingFolder.id;
    }

    const newFolder = await makeApiRequest('POST', '/folders', {
      name: folderName,
      teamId: parseInt(MAKE_TEAM_ID)
    });
    
    console.log(`📁 Created folder "${folderName}"`);
    return newFolder.id;
  } catch (error) {
    console.warn(`⚠️  Could not create folder "${folderName}": ${error.message}`);
    return null;
  }
}

/**
 * Create webhook scenario
 */
async function createWebhookScenario(scenarioConfig) {
  try {
    console.log(`🔄 Creating scenario: ${scenarioConfig.name}`);
    
    const folderId = await createFolder(scenarioConfig.folder);
    
    const scenarioData = {
      name: scenarioConfig.name,
      blueprint: scenarioConfig.blueprint,
      teamId: parseInt(MAKE_TEAM_ID),
      ...(folderId && { folderId: folderId })
    };

    const scenario = await makeApiRequest('POST', '/scenarios', scenarioData);
    
    console.log(`✅ Created scenario: ${scenarioConfig.name}`);
    console.log(`   ID: ${scenario.id}`);
    
    // Get the webhook URL
    const webhooks = await makeApiRequest('GET', `/scenarios/${scenario.id}/webhooks`);
    const webhookUrl = webhooks[0]?.url;
    
    if (webhookUrl) {
      console.log(`   Webhook URL: ${webhookUrl}`);
      return {
        name: scenarioConfig.name,
        id: scenario.id,
        webhookUrl: webhookUrl
      };
    } else {
      console.warn(`⚠️  No webhook URL found for ${scenarioConfig.name}`);
      return {
        name: scenarioConfig.name,
        id: scenario.id,
        webhookUrl: null
      };
    }
    
  } catch (error) {
    console.error(`❌ Failed to create scenario ${scenarioConfig.name}: ${error.message}`);
    return null;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Creating Make.com webhooks for CanAI Emotional Sovereignty...\n');
  
  const results = [];
  
  for (const scenarioConfig of webhookScenarios) {
    const result = await createWebhookScenario(scenarioConfig);
    if (result) {
      results.push(result);
    }
    // Wait between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📋 **WEBHOOK CREATION SUMMARY**\n');
  
  if (results.length === 0) {
    console.log('❌ No webhooks were created successfully');
    return;
  }
  
  console.log('✅ **Successfully Created Webhooks:**\n');
  
  // Generate environment variables
  console.log('🔧 **Environment Variables for .env.local:**\n');
  console.log('```env');
  
  results.forEach(result => {
    if (result.webhookUrl) {
      const envVarName = result.name
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/[^A-Z0-9_]/g, '');
      
      console.log(`MAKE_${envVarName}_WEBHOOK=${result.webhookUrl}`);
    }
  });
  
  console.log('```\n');
  
  // Generate test commands
  console.log('🧪 **Test Commands:**\n');
  console.log('```bash');
  
  results.forEach((result, index) => {
    if (result.webhookUrl) {
      console.log(`# Test ${result.name}`);
      console.log(`curl -X POST ${result.webhookUrl} \\`);
      console.log(`  -H "Content-Type: application/json" \\`);
      console.log(`  -d '{"test": "webhook${index + 1}", "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'\n`);
    }
  });
  
  console.log('```\n');
  
  console.log('🎉 **Next Steps:**');
  console.log('1. Add the environment variables to your .env.local file');
  console.log('2. Test each webhook using the curl commands above');
  console.log('3. Configure Supabase connections in Make.com dashboard');
  console.log('4. Add processing logic to each scenario');
  
  console.log('\n✨ Your Make.com webhook infrastructure is ready for Emotional Sovereignty!');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createWebhookScenario, webhookScenarios }; 