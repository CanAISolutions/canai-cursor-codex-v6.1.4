/**
 * demo-truth-mapping.ts
 * 
 * Demonstrates the Truth-Based Integration System by mapping
 * the PromptLogs interface to the prompt_logs table
 * 
 * Part of the Truth-Based Integration System
 */

import { TruthMappingEngine } from './real-truth-mapping-engine';

/**
 * Demonstrates the Truth-Based Integration System
 */
export async function demonstrateTruthMapping(): Promise<void> {
  console.log('=== Truth-Based Integration System Demonstration ===');
  console.log('');
  
  try {
    // Create and initialize the engine
    console.log('Initializing Truth Mapping Engine...');
    const engine = new TruthMappingEngine('./demo-output');
    await engine.initialize();
    console.log('');
    
    // Map the PromptLogs interface as a demonstration
    console.log('Mapping PromptLogs interface to database...');
    const promptLogsMapping = await engine.mapInterface('PromptLogs');
    
    if (promptLogsMapping) {
      console.log('');
      console.log('=== PromptLogs Mapping Results ===');
      console.log(`Interface: ${promptLogsMapping.interfaceName}`);
      console.log(`Table: ${promptLogsMapping.tableName}`);
      console.log(`Fields Mapped: ${promptLogsMapping.fieldMappings.length}`);
      console.log(`Trust Score: ${promptLogsMapping.trustScore.toFixed(2)}`);
      console.log(`Emotional Sovereignty: ${promptLogsMapping.emotionalSovereignty ? 'Preserved ✅' : 'At Risk ⚠️'}`);
      console.log('');
      
      // Show some field mappings as examples
      console.log('=== Sample Field Mappings ===');
      const sampleMappings = promptLogsMapping.fieldMappings.slice(0, 5);
      
      for (const mapping of sampleMappings) {
        console.log(`${mapping.sourceField} → ${mapping.targetField} (${mapping.transformation})`);
      }
      
      console.log(`... and ${promptLogsMapping.fieldMappings.length - 5} more fields`);
      console.log('');
      
      // Generate the ultimate guide
      console.log('Generating Ultimate Truth Mapping Guide...');
      await engine.generateUltimateTruthMappingGuide();
      console.log('');
    } else {
      console.error('Failed to map PromptLogs interface');
    }
    
    // Map all interfaces as a complete demonstration
    console.log('Mapping all interfaces...');
    const allMappings = await engine.mapAllInterfaces();
    console.log('');
    
    console.log('=== Summary of All Mappings ===');
    console.log(`Total Interfaces Mapped: ${allMappings.length}`);
    
    const averageTrustScore = allMappings.reduce((sum, m) => sum + m.trustScore, 0) / allMappings.length;
    console.log(`Average Trust Score: ${averageTrustScore.toFixed(2)}`);
    
    const sovereigntyPreserved = allMappings.filter(m => m.emotionalSovereignty).length;
    console.log(`Emotional Sovereignty Preserved: ${sovereigntyPreserved}/${allMappings.length}`);
    
    console.log('');
    console.log('=== Top 3 Mappings by Trust Score ===');
    
    const topMappings = [...allMappings]
      .sort((a, b) => b.trustScore - a.trustScore)
      .slice(0, 3);
    
    for (const mapping of topMappings) {
      console.log(`${mapping.interfaceName} → ${mapping.tableName} (Trust Score: ${mapping.trustScore.toFixed(2)})`);
    }
    
    console.log('');
    console.log('Demonstration complete! Check the demo-output directory for generated files.');
    console.log('');
    
  } catch (error) {
    console.error('Error in demonstration:', error);
  }
}

/**
 * Run the demonstration if this script is executed directly
 */
if (require.main === module) {
  demonstrateTruthMapping().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
} 