
import { computeExtendedScore } from '../scripts/smartPromptScoreExtension';

describe('computeExtendedScore', () => {
  it('boosts score by depth and width', () => {
    const base = 0.5;
    const mock = {
      reasoning: 'step1\nstep2\nstep3',
      toolCalls: [{ tool: 'web' }, { tool: 'python' }]
    } as any;
    const score = computeExtendedScore(base, mock);
    expect(score).toBeCloseTo(base + 3 * 0.2 + 2 * 0.3);
  });
});
