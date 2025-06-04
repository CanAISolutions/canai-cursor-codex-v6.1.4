/**
 * EventBus Mock for Test-First Truth Validation
 * 
 * Properly mocks the EventBus singleton pattern for MCP tests
 * Ensures emotional sovereignty compliance in testing
 */

export const createMockEventBus = () => ({
  emit: jest.fn().mockResolvedValue(undefined),
  on: jest.fn(),
  off: jest.fn(),
  clear: jest.fn(),
  clearAll: jest.fn(),
  getEventLog: jest.fn().mockReturnValue([]),
  clearEventLog: jest.fn(),
  // Add properties that tests might set
  getInstance: jest.fn()
});

export const mockEventBusInstance = createMockEventBus();

// Ensure getInstance always returns the same mock instance
mockEventBusInstance.getInstance = jest.fn(() => mockEventBusInstance);

// Mock the EventBus module at different possible paths
jest.mock('../../cursor/event-bus/eventBus', () => ({
  EventBus: {
    getInstance: jest.fn(() => mockEventBusInstance)
  }
}));

jest.mock('../../src/event-bus', () => ({
  EventBus: {
    getInstance: jest.fn(() => mockEventBusInstance)
  }
}));

export { mockEventBusInstance as mockEventBus }; 