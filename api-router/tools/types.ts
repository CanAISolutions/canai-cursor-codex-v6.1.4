export type DreamStatePayload =
  | { success: true; data: Record<string, any> }
  | { success: false; error: { code: string; message: string }; meta?: Record<string, any> }; 