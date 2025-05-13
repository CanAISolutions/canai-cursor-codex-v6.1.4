describe('intent-mirror', () => {
  // What: Asserts that the module exports nothing (empty/no-op)
  it('should export nothing (no-op)', () => {
    const mod = require('./intent-mirror');
    expect(Object.keys(mod)).toMatchSnapshot('empty-intent-mirror-export');
  });
}); 