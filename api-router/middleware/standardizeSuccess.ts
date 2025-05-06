/**
 * Middleware to standardize success responses
 * @param data The data to send in the response
 * @returns Standardized success response
 */
export function standardizeSuccess(data: any): { success: true; data: any } {
  return {
    success: true,
    data
  };
} 