/**
 * Truth-Based Integration System
 * 
 * A comprehensive system for integrating interface definitions with database schemas
 * through Make.com scenarios and webhook handlers with emotional sovereignty.
 */

// Export all components from the Truth-Based Integration System
export * from './real-interface-catalog-loader';
export * from './real-supabase-schema-loader';
export * from './real-field-mapper';
export * from './real-makecom-scenario-builder';
export * from './real-webhook-handler-generator';
export * from './real-truth-mapping-engine';

// Export the demonstration module
export { demonstrateTruthMapping } from './demo-truth-mapping';

/**
 * Simplified entry point to the Truth-Based Integration System
 */
import { TruthMappingEngine } from './real-truth-mapping-engine';

/**
 * Maps a single interface and generates all necessary outputs
 * 
 * @param interfaceName The name of the interface to map
 * @param outputDir The directory to output the generated files
 * @returns A promise that resolves when the mapping is complete
 */
export async function mapInterface(interfaceName: string, outputDir: string = './output'): Promise<any> {
  const engine = new TruthMappingEngine(outputDir);
  await engine.initialize();
  return engine.mapInterface(interfaceName);
}

/**
 * Maps all interfaces in the catalog and generates the Ultimate Truth Mapping Guide
 * 
 * @param outputDir The directory to output the generated files
 * @returns A promise that resolves when the mapping is complete
 */
export async function mapAllInterfaces(outputDir: string = './output'): Promise<any> {
  const engine = new TruthMappingEngine(outputDir);
  await engine.initialize();
  const results = engine.mapAllInterfaces();
  engine.generateUltimateTruthMappingGuide();
  return results;
} 