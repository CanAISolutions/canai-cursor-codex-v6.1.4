# Make.com Webhook Setup Checklist

## 🎯 **Required Webhook Endpoints**

### **1. Emotional Sovereignty Orchestrator**
- **Purpose**: Process every prompt interaction with emotional intelligence
- **URL**: `https://hook.us1.make.com/emotional-sovereignty-orchestrator`
- **Trigger**: Real-time on every user prompt submission
- **Priority**: **CRITICAL** - Core functionality

### **2. User Intelligence Aggregator** 
- **Purpose**: Update user profiles and predictive insights
- **URL**: `https://hook.us1.make.com/user-intelligence-aggregator`
- **Trigger**: Session completion or major user interaction
- **Priority**: **HIGH** - Personalization engine

### **3. SparkSplit Processor**
- **Purpose**: Handle trust transparency comparisons
- **URL**: `https://hook.us1.make.com/sparksplit-processor`
- **Trigger**: When trust score qualifies for SparkSplit
- **Priority**: **CRITICAL** - Competitive advantage

### **4. SparkSplit Selection Handler**
- **Purpose**: Process user selections from comparisons
- **URL**: `https://hook.us1.make.com/sparksplit-selection`
- **Trigger**: User chooses between CanAI vs sterile AI
- **Priority**: **HIGH** - Trust building validation

---

## 🛠️ **Configuration Steps**

### **Step 1: Access Make.com Dashboard**
1. Log into your Make.com account
2. Navigate to "Scenarios" 
3. Click "Create a new scenario"

### **Step 2: Create Webhook Modules**
For each webhook above:

1. **Add Webhook Module**:
   - Search for "Webhooks" in modules
   - Select "Custom webhook" 
   - Click "Add"

2. **Configure Webhook Settings**:
   - **Webhook name**: Use descriptive names (e.g., "Emotional Sovereignty Orchestrator")
   - **IP restrictions**: Leave blank for development, restrict for production
   - **Data structure**: Set to "Auto-determine" initially

3. **Get Webhook URL**:
   - Copy the generated webhook URL
   - Format will be: `https://hook.us1.make.com/[unique-id]`

### **Step 3: Configure Webhook Processing Logic**

#### **For Emotional Sovereignty Orchestrator:**
```json
{
  "modules": [
    {
      "id": 1,
      "module": "webhook:customWebhook",
      "version": 1
    },
    {
      "id": 2, 
      "module": "builtin:BasicRouter",
      "filter": {
        "conditions": [[{
          "a": "{{1.trustScore}}",
          "b": "4.2", 
          "o": "number:gte"
        }]]
      }
    },
    {
      "id": 3,
      "module": "supabase:insertRecord",
      "parameters": {
        "table": "prompt_logs",
        "connection": "{{connections.supabase}}"
      }
    }
  ]
}
```

#### **For SparkSplit Processor:**
```json
{
  "modules": [
    {
      "id": 1,
      "module": "webhook:customWebhook", 
      "version": 1
    },
    {
      "id": 2,
      "module": "http:ActionSendData",
      "mapper": {
        "url": "{{env.CANAI_API_URL}}/api/sparksplit/generate-comparison",
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer {{env.CANAI_API_KEY}}"
        }
      }
    },
    {
      "id": 3,
      "module": "supabase:insertRecord",
      "parameters": {
        "table": "sparksplit_comparisons"
      }
    }
  ]
}
```

### **Step 4: Set Up Supabase Connections**

1. **Add Supabase App**:
   - In Make.com, go to "Connections"
   - Search for "Supabase" 
   - Click "Add connection"

2. **Configure Supabase Connection**:
   - **Supabase URL**: `https://your-project.supabase.co`
   - **Service Role Key**: Your Supabase service role key
   - **Test connection** to verify

### **Step 5: Environment Variables**

Set these in your Make.com organization settings:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# CanAI API
CANAI_API_URL=https://api.canai.so  
CANAI_API_KEY=your-canai-api-key

# Webflow Integration
WEBFLOW_WEBHOOK_URL=https://your-webflow-site.com/webhook
WEBFLOW_API_KEY=your-webflow-api-key
```

---

## 🔧 **Webhook Data Structure Definitions**

### **Emotional Sovereignty Webhook Payload**
```typescript
interface EmotionalSovereigntyPayload {
  sessionId: string;
  userId: string; 
  timestamp: string;
  promptType: 'business_plan' | 'email_campaign' | 'spark_split';
  inputFields: Record<string, any>;
  output: Record<string, any>;
  trustScore: number; // 0-5
  resonanceScore: number; // 0-1
  emotionalDepth: number;
  
  // 5-Axis Emotional Compass
  aweScore: number;
  ownershipScore: number;
  wonderScore: number;
  calmScore: number;
  powerScore: number;
  
  analyticsMeta: {
    sessionMetrics: Record<string, any>;
    sparkSplitMetrics?: Record<string, any>;
    outputGoldmine: Record<string, any>;
    userAIProfile: Record<string, any>;
  };
}
```

### **SparkSplit Webhook Payload**
```typescript
interface SparkSplitPayload {
  sessionId: string;
  promptType: string;
  userInput: Record<string, any>;
  userContext: Record<string, any>;
  canaiOutput: Record<string, any>;
  sterileOutput: Record<string, any>;
  
  // Emotional comparison metrics
  canaiAweScore: number;
  canaiOwnershipScore: number;
  canaiWonderScore: number;
  canaiCalmScore: number;
  canaiPowerScore: number;
  
  sterileAweScore: number;
  sterileOwnershipScore: number;
  sterileWonderScore: number;
  sterileCalmScore: number;
  sterilePowerScore: number;
  
  // Trust transparency metrics
  trustDelta: number; // -1 to 1
  competitiveAdvantage: number; // 0-1
  trustTransparencyScore: number;
  emotionalEducationScore: number;
  
  // Validation flags
  sacredReversalPassed: boolean;
  userEmpowermentIncreased: boolean;
  emotionalSovereigntyPreserved: boolean;
}
```

---

## 🧪 **Testing Your Webhooks**

### **Step 1: Test Webhook Connectivity**
```bash
# Test basic webhook connectivity
curl -X POST https://hook.us1.make.com/your-webhook-id \
  -H "Content-Type: application/json" \
  -d '{"test": "connectivity", "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}'
```

### **Step 2: Test with Sample Data**
```bash
# Test Emotional Sovereignty webhook
curl -X POST https://hook.us1.make.com/emotional-sovereignty-orchestrator \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-123",
    "userId": "test-user-456", 
    "promptType": "business_plan",
    "trustScore": 4.5,
    "aweScore": 0.8,
    "ownershipScore": 0.9,
    "wonderScore": 0.7,
    "calmScore": 0.8,
    "powerScore": 0.85
  }'
```

### **Step 3: Validate Database Inserts**
After testing, check your Supabase tables to confirm:
- Records are being inserted correctly
- JSONB fields are properly formatted
- Constraints are respected
- Performance is acceptable (<100ms)

---

## 🚨 **Security Configuration**

### **Webhook Security**
1. **IP Restrictions**: Restrict webhook access to your application IPs
2. **Authentication Headers**: Add API key validation
3. **Request Validation**: Validate payload structure
4. **Rate Limiting**: Configure appropriate rate limits

### **Environment Security**
1. **Service Keys**: Use service role key for Supabase (not anon key)
2. **API Keys**: Rotate keys regularly
3. **Connection Encryption**: Ensure all connections use HTTPS
4. **Access Logging**: Enable webhook execution logging

---

## ✅ **Deployment Checklist**

- [ ] All 4 webhook scenarios created and configured
- [ ] Supabase connection established and tested
- [ ] Environment variables configured securely
- [ ] Webhook URLs documented and accessible
- [ ] Sample data tests pass successfully
- [ ] Database inserts confirmed working
- [ ] Error handling and retries configured
- [ ] Monitoring and alerting set up
- [ ] Security restrictions applied
- [ ] Documentation updated with webhook URLs

---

## 📞 **Integration Points**

### **From Your Application**
Your application should call these webhooks at these trigger points:

1. **After every prompt completion** → Emotional Sovereignty Orchestrator
2. **After user session ends** → User Intelligence Aggregator  
3. **When trust score ≥3.5** → SparkSplit Processor
4. **When user makes SparkSplit selection** → SparkSplit Selection Handler

### **Webhook URL Environment Variables**
```env
MAKE_EMOTIONAL_SOVEREIGNTY_WEBHOOK=https://hook.us1.make.com/your-emotional-id
MAKE_USER_INTELLIGENCE_WEBHOOK=https://hook.us1.make.com/your-intelligence-id
MAKE_SPARKSPLIT_WEBHOOK=https://hook.us1.make.com/your-sparksplit-id
MAKE_SPARKSPLIT_SELECTION_WEBHOOK=https://hook.us1.make.com/your-selection-id
```

This configuration creates the foundation for your **emotional sovereignty orchestration system** through Make.com webhooks. 