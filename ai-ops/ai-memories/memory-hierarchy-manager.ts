/**
 * Memory Hierarchy Manager
 * Manages the retrieval and organization of memories based on hierarchy levels
 */

import { MemoryPayload, MemoryType, MemoryQuery, MemoryHierarchyLevel } from './memory-types';

export class MemoryHierarchyManager {
  private readonly hierarchyLevels: MemoryHierarchyLevel[] = [
    {
      name: 'CRITICAL',
      priority: 3,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      minTrustScore: 4.5
    },
    {
      name: 'IMPORTANT',
      priority: 2,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      minTrustScore: 4.0
    },
    {
      name: 'STANDARD',
      priority: 1,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      minTrustScore: 3.5
    }
  ];

  /**
   * Retrieves memory based on user ID, session ID, and context goal
   * @param userId The user ID
   * @param sessionId The session ID
   * @param contextGoal The context goal
   * @returns Promise resolving to the retrieved memory or null if not found
   */
  public async retrieveMemory(
    userId: string,
    sessionId: string,
    contextGoal: string
  ): Promise<MemoryPayload | null> {
    try {
      const query: MemoryQuery = {
        userId,
        sessionId,
        contextGoal,
        minTrustScore: this.hierarchyLevels[0].minTrustScore
      };

      // Retrieve memories from storage
      const memories = await this.queryMemories(query);
      if (!memories.length) {
        return null;
      }

      // Sort memories by hierarchy level and recency
      const sortedMemories = this.sortMemoriesByHierarchy(memories);
      return sortedMemories[0];
    } catch (error) {
      console.error('Memory retrieval failed:', error);
      return null;
    }
  }

  /**
   * Queries memories based on the provided query parameters
   */
  private async queryMemories(query: MemoryQuery): Promise<MemoryPayload[]> {
    // Implementation would query the memory storage system
    // This is a placeholder implementation
    return [];
  }

  /**
   * Sorts memories based on hierarchy levels and recency
   */
  private sortMemoriesByHierarchy(memories: MemoryPayload[]): MemoryPayload[] {
    return memories.sort((a, b) => {
      // First sort by hierarchy level
      const levelA = this.getHierarchyLevel(a);
      const levelB = this.getHierarchyLevel(b);
      
      if (levelA.priority !== levelB.priority) {
        return levelB.priority - levelA.priority;
      }
      
      // Then sort by recency
      return b.timestamp - a.timestamp;
    });
  }

  /**
   * Gets the hierarchy level for a memory
   */
  private getHierarchyLevel(memory: MemoryPayload): MemoryHierarchyLevel {
    return this.hierarchyLevels.find(level => 
      memory.trustScore >= level.minTrustScore &&
      (Date.now() - memory.timestamp) <= level.maxAge
    ) || this.hierarchyLevels[this.hierarchyLevels.length - 1];
  }
} 