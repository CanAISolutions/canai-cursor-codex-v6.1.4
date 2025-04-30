// router-selfcheck.test.ts

/**
 * WHAT: Unit tests for verifying routes manifest structure validity.
 * WHY: Prevents broken manifests from entering production.
 * HOW: Static validation tests against expected schema.
 */

import { validateRoutesAgainstManifest } from './routes-manifest.selfcheck';

describe('Routes Manifest Selfcheck', () => {
  it('should validate the routes manifest without errors', () => {
    const result = validateRoutesAgainstManifest();
    expect(result.success).toBe(true);
    expect(result.mismatches.length).toBe(0);
  });
});
