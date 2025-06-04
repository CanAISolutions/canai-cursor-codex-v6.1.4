# Make.com API Setup Guide

## 🔑 **Required API Credentials**

To use the webhook creation script, you need these values in your `.env.local`:

```env
# Make.com API Credentials
MAKE_API_KEY=your-api-key-here
MAKE_TEAM_ID=your-team-id-here
MAKE_ORGANIZATION_ID=your-organization-id-here
```

---

## 🚀 **How to Get Your API Credentials**

### **Step 1: Get Your API Key**
1. Log into [make.com](https://make.com)
2. Go to **Profile** (top right corner)
3. Navigate to **API** tab
4. Click **Generate API Key** 
5. Copy the key and add to `.env.local` as `MAKE_API_KEY`

### **Step 2: Get Your Team ID**
1. In Make.com dashboard, go to **Settings**
2. Click on **Teams** 
3. Your Team ID will be shown in the URL or team settings
4. Add to `.env.local` as `MAKE_TEAM_ID`

### **Step 3: Get Organization ID (if applicable)**
1. Go to **Organization Settings** (if you're part of an organization)
2. Find your Organization ID
3. Add to `.env.local` as `MAKE_ORGANIZATION_ID`

---

## ⚡ **Quick Run Commands**

Once you have your credentials set up:

### **Make the script executable:**
```bash
chmod +x workspace-organization/02-orchestration/make-com/integration/API-WEBHOOK-CREATION.md
```

### **Run the webhook creation script:**
```bash
node workspace-organization/02-orchestration/make-com/integration/API-WEBHOOK-CREATION.md
```

### **Or run directly:**
```bash
cd workspace-organization/02-orchestration/make-com/integration/
node API-WEBHOOK-CREATION.md
```

---

## 🧪 **What the Script Does**

The script automatically:

1. ✅ **Creates 4 webhook scenarios** for emotional sovereignty
2. ✅ **Organizes them into folders** for clean organization
3. ✅ **Generates webhook URLs** for each scenario
4. ✅ **Outputs environment variables** ready for your `.env.local`
5. ✅ **Provides test commands** to verify webhook connectivity

### **Scenarios Created:**
- **Emotional Sovereignty Orchestrator** - Core prompt processing
- **User Intelligence Aggregator** - User profile updates  
- **SparkSplit Processor** - Trust transparency comparisons
- **SparkSplit Selection Handler** - User choice processing

---

## 📝 **Expected Output**

After running the script, you'll get:

```
🚀 Creating Make.com webhooks for CanAI Emotional Sovereignty...

📁 Created folder "CanAI Emotional Intelligence"
✅ Created scenario: Emotional Sovereignty Orchestrator
   ID: 12345
   Webhook URL: https://hook.us1.make.com/abc123xyz

📁 Created folder "CanAI User Intelligence"  
✅ Created scenario: User Intelligence Aggregator
   ID: 12346
   Webhook URL: https://hook.us1.make.com/def456uvw

...

🔧 Environment Variables for .env.local:

MAKE_EMOTIONAL_SOVEREIGNTY_ORCHESTRATOR_WEBHOOK=https://hook.us1.make.com/abc123xyz
MAKE_USER_INTELLIGENCE_AGGREGATOR_WEBHOOK=https://hook.us1.make.com/def456uvw
MAKE_SPARKSPLIT_PROCESSOR_WEBHOOK=https://hook.us1.make.com/ghi789rst
MAKE_SPARKSPLIT_SELECTION_HANDLER_WEBHOOK=https://hook.us1.make.com/jkl012mno
```

---

## 🔧 **Troubleshooting**

### **"API Key not found" Error**
- Verify your `.env.local` has `MAKE_API_KEY` set
- Make sure the file is in your project root
- Check that the API key is valid in Make.com settings

### **"Team ID not found" Error**  
- Get your Team ID from Make.com Settings > Teams
- Make sure you have permission to create scenarios
- Verify you're on the correct team

### **API Rate Limiting**
- The script includes 1-second delays between requests
- If you hit rate limits, wait a few minutes and retry
- Consider upgrading your Make.com plan for higher limits

### **Folder Creation Issues**
- Folders are optional - scenarios will be created in root if folder creation fails
- You can manually organize scenarios into folders later
- Check your permissions for folder management

---

## ✅ **Verification Steps**

After running the script:

1. **Check Make.com Dashboard**:
   - Verify all 4 scenarios were created
   - Confirm webhooks are accessible
   - Test basic connectivity

2. **Update Environment Variables**:
   - Copy the generated env vars to your `.env.local`
   - Restart your application to load new variables

3. **Test Webhooks**:
   - Use the provided curl commands to test each webhook
   - Verify responses in Make.com execution logs

4. **Next Steps**:
   - Configure Supabase connections
   - Add processing logic to scenarios
   - Implement error handling and retries

---

This API approach saves you 30+ minutes of manual webhook creation and ensures consistent configuration across all scenarios! 