import { systemReadiness } from "./system-readiness";

describe("[DreamState] zombie-hunter", () => {
  it("passes systemReadiness()", () => {
    expect(systemReadiness()).toBe("green");
  });
});
