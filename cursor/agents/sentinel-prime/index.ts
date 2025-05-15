import { analyzeResonance } from '../../memory/resonance-graph';
import { checkCommunityAlignment } from '../../community/alignment-score';
import { selfRepair } from './self-repair';

export async function enforceDreamstate(file: string, content: string) {
  const resonanceScore = await analyzeResonance(content);
  const communityScore = await checkCommunityAlignment(file);

  if (resonanceScore < 0.92) {
    console.error(`Resonance score too low: ${resonanceScore}`);
    await selfRepair(file, content);
    throw new Error('Dreamstate violation: Low resonance');
  }

  if (communityScore < 0.75) {
    console.error(`Community alignment too low: ${communityScore}`);
    throw new Error('Dreamstate violation: Low community alignment');
  }

  console.log('Dreamstate checks passed');
}