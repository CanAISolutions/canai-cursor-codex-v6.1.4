const https = require('https');

async function testDeployedService() {
    console.log('🔍 Testing what\'s actually working on canai-router.onrender.com...\n');
    
    // Test /generate endpoint that we know works
    try {
        const generateResponse = await makePostRequest('https://canai-router.onrender.com/generate', {
            userInput: 'Create a coffee shop business plan',
            promptType: 'business_plan',
            mode: 'sterile'
        });
        
        console.log('✅ /generate endpoint working');
        console.log('Response structure:', Object.keys(generateResponse));
        console.log('Response preview:', JSON.stringify(generateResponse, null, 2).substring(0, 400) + '...\n');
        
        // Now test what sterile output we get
        const sterileResponse = await makePostRequest('https://canai-router.onrender.com/generate', {
            userInput: {
                industry: 'coffee shop',
                goal: 'launch sustainable coffee business',
                businessModel: 'retail + online'
            },
            promptType: 'business_plan', 
            mode: 'sterile'
        });
        
        console.log('✅ Sterile output generation working!');
        console.log('Sterile business plan preview:');
        console.log(sterileResponse.data?.output?.substring(0, 300) + '...\n');
        
        // Test enhanced mode
        const enhancedResponse = await makePostRequest('https://canai-router.onrender.com/generate', {
            userInput: {
                industry: 'coffee shop',
                goal: 'launch sustainable coffee business', 
                emotionalContext: 'excited but nervous'
            },
            promptType: 'business_plan',
            mode: 'enhanced'
        });
        
        console.log('✅ Enhanced output generation working!');
        console.log('Enhanced business plan preview:');
        console.log(enhancedResponse.data?.output?.substring(0, 300) + '...\n');
        
        console.log('🎉 SOLUTION CONFIRMED: /generate endpoint provides sterile output functionality!');
        console.log('🔧 For Make.com webhooks, use: https://canai-router.onrender.com/generate');
        console.log('📋 Required payload:');
        console.log(JSON.stringify({
            userInput: '{{webhook.inputFields}}',
            promptType: '{{webhook.promptType}}',
            mode: 'sterile'
        }, null, 2));
        
    } catch (error) {
        console.error('❌ Error testing deployed service:', error.message);
    }
}

function makePostRequest(url, data) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(data);
        const urlObj = new URL(url);
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const jsonData = JSON.parse(responseData);
                        resolve(jsonData);
                    } catch (e) {
                        resolve(responseData);
                    }
                } else {
                    const error = new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`);
                    error.status = res.statusCode;
                    reject(error);
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        req.setTimeout(30000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.write(postData);
        req.end();
    });
}

testDeployedService().catch(console.error); 