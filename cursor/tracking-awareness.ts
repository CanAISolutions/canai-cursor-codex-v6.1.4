/**
 * Tracking Awareness Module
 * 
 * Purpose:
 * Maintains awareness of verification status, current priorities,
 * and action history from tracking documents
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import * as path from 'path';

interface VerificationAction {
  date: string;
  type: string;
  component: string;
  action: string;
  verifier: string;
  evidence: string;
  status: string;
  notes: string;
}

interface VerificationPriority {
  level: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
}

interface AutoAction {
  date: string;
  title: string;
  description: string;
  files?: string[];
}

interface TrackingState {
  verificationActions: VerificationAction[];
  currentPriorities: VerificationPriority[];
  completedItems: string[];
  recentAutoActions: AutoAction[];
  historicalAutoActions: AutoAction[];
}

export class TrackingAwareness {
  private trackingState: TrackingState;
  private verificationLogPath: string;
  private autoActionsLogPath: string;
  private autoActionsLogArchivePattern: string;
  
  constructor(
    verificationLogPath = 'docs/verification-hub/VERIFICATION-ACTIONS-LOG.md',
    autoActionsLogPath = 'cursor/auto-actions.log.md',
    autoActionsLogArchivePattern = 'cursor/logs/auto-actions.log.*.md'
  ) {
    this.verificationLogPath = verificationLogPath;
    this.autoActionsLogPath = autoActionsLogPath;
    this.autoActionsLogArchivePattern = autoActionsLogArchivePattern;
    
    this.trackingState = {
      verificationActions: [],
      currentPriorities: [],
      completedItems: [],
      recentAutoActions: [],
      historicalAutoActions: []
    };
    
    this.loadTrackingState();
  }
  
  /**
   * Load all tracking data from verification log and auto-actions logs
   */
  private loadTrackingState(): void {
    try {
      // Load verification actions
      this.trackingState.verificationActions = this.parseVerificationLog();
      
      // Extract current priorities
      this.trackingState.currentPriorities = this.extractVerificationPriorities();
      
      // Extract completed items
      this.trackingState.completedItems = this.extractCompletedItems();
      
      // Load recent auto actions
      this.trackingState.recentAutoActions = this.parseAutoActionsLog();
      
      // Load historical auto actions
      this.trackingState.historicalAutoActions = this.parseAutoActionsLogArchives();
    } catch (error) {
      console.error('Error loading tracking state:', error);
    }
  }
  
  /**
   * Parse the verification log to extract actions
   */
  private parseVerificationLog(): VerificationAction[] {
    try {
      const content = readFileSync(this.verificationLogPath, 'utf-8');
      const actions: VerificationAction[] = [];
      
      // Parse using regex for each action section
      const actionPattern = /### (\d{4}-\d{2}-\d{2}) - ([A-Z_]+) - (.+)\n\n\*\*Action\*\*: (.+)\n\*\*Verifier\*\*: (.+)\n\*\*Evidence\*\*: (.+)\n\*\*Status\*\*: (.+)\n\*\*Notes\*\*: (.+)/g;
      
      let match;
      while ((match = actionPattern.exec(content)) !== null) {
        actions.push({
          date: match[1],
          type: match[2],
          component: match[3],
          action: match[4],
          verifier: match[5],
          evidence: match[6],
          status: match[7],
          notes: match[8]
        });
      }
      
      return actions;
    } catch (error) {
      console.error('Error parsing verification log:', error);
      return [];
    }
  }
  
  /**
   * Extract current verification priorities
   */
  private extractVerificationPriorities(): VerificationPriority[] {
    try {
      const content = readFileSync(this.verificationLogPath, 'utf-8');
      const priorities: VerificationPriority[] = [];
      
      // Extract critical priorities
      if (content.includes('🔴 CRITICAL PATH')) {
        const criticalSection = content.split('🔴 CRITICAL PATH')[1]?.split('🟠 HIGH PRIORITY')[0] || '';
        const criticalItems = criticalSection.match(/\d+\.\s\*\*(.+?)\*\*/g) || [];
        
        criticalItems.forEach(item => {
          const description = item.replace(/\d+\.\s\*\*|\*\*/g, '').trim();
          priorities.push({
            level: 'CRITICAL',
            description
          });
        });
      }
      
      // Extract high priorities
      if (content.includes('🟠 HIGH PRIORITY')) {
        const highSection = content.split('🟠 HIGH PRIORITY')[1]?.split('🟡 MEDIUM PRIORITY')[0] || '';
        const highItems = highSection.match(/\d+\.\s\*\*(.+?)\*\*/g) || [];
        
        highItems.forEach(item => {
          const description = item.replace(/\d+\.\s\*\*|\*\*/g, '').trim();
          priorities.push({
            level: 'HIGH',
            description
          });
        });
      }
      
      return priorities;
    } catch (error) {
      console.error('Error extracting verification priorities:', error);
      return [];
    }
  }
  
  /**
   * Extract completed items
   */
  private extractCompletedItems(): string[] {
    try {
      const content = readFileSync(this.verificationLogPath, 'utf-8');
      const completedItems: string[] = [];
      
      if (content.includes('✅ COMPLETED CRITICAL ITEMS')) {
        const completedSection = content.split('✅ COMPLETED CRITICAL ITEMS')[1]?.split('---')[0] || '';
        const items = completedSection.match(/- ✅\s\*\*(.+?)\*\*/g) || [];
        
        items.forEach(item => {
          const description = item.replace(/- ✅\s\*\*|\*\*.+/g, '').trim();
          completedItems.push(description);
        });
      }
      
      return completedItems;
    } catch (error) {
      console.error('Error extracting completed items:', error);
      return [];
    }
  }
  
  /**
   * Parse the current auto-actions log
   */
  private parseAutoActionsLog(): AutoAction[] {
    try {
      const content = readFileSync(this.autoActionsLogPath, 'utf-8');
      return this.extractAutoActions(content);
    } catch (error) {
      console.error('Error parsing auto-actions log:', error);
      return [];
    }
  }
  
  /**
   * Parse archived auto-actions logs
   */
  private parseAutoActionsLogArchives(): AutoAction[] {
    try {
      const archiveDir = path.dirname(this.autoActionsLogArchivePattern);
      const pattern = path.basename(this.autoActionsLogArchivePattern);
      const regexPattern = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*');
      const fileRegex = new RegExp(regexPattern);
      
      const files = readdirSync(archiveDir)
        .filter(file => fileRegex.test(file))
        .map(file => join(archiveDir, file));
      
      // Sort by date (newest first)
      files.sort().reverse();
      
      const allActions: AutoAction[] = [];
      
      // Parse up to 5 most recent archive files
      for (let i = 0; i < Math.min(files.length, 5); i++) {
        try {
          const content = readFileSync(files[i], 'utf-8');
          const actions = this.extractAutoActions(content);
          allActions.push(...actions);
        } catch (error) {
          console.error(`Error parsing archive file ${files[i]}:`, error);
        }
      }
      
      return allActions;
    } catch (error) {
      console.error('Error parsing auto-actions log archives:', error);
      return [];
    }
  }
  
  /**
   * Extract auto actions from content
   */
  private extractAutoActions(content: string): AutoAction[] {
    const actions: AutoAction[] = [];
    
    // Parse using regex for each action section
    const actionPattern = /## (.+) - (\d{4}-\d{2}-\d{2})\n\n([^#]+)/g;
    
    let match;
    while ((match = actionPattern.exec(content)) !== null) {
      const title = match[1].trim();
      const date = match[2];
      const description = match[3].trim();
      
      // Extract file references
      const filePattern = /`([^`]+)`/g;
      const files: string[] = [];
      let fileMatch;
      while ((fileMatch = filePattern.exec(description)) !== null) {
        files.push(fileMatch[1]);
      }
      
      actions.push({
        title,
        date,
        description,
        files: files.length > 0 ? files : undefined
      });
    }
    
    return actions;
  }
  
  /**
   * Get the current critical priority
   */
  public getCurrentCriticalPriority(): string {
    const criticalPriorities = this.trackingState.currentPriorities.filter(p => p.level === 'CRITICAL');
    return criticalPriorities.length > 0 ? criticalPriorities[0].description : 'No critical priority found';
  }
  
  /**
   * Get recent verification actions
   */
  public getRecentVerificationActions(limit = 5): VerificationAction[] {
    return this.trackingState.verificationActions.slice(0, limit);
  }
  
  /**
   * Get recent auto actions
   */
  public getRecentAutoActions(limit = 5): AutoAction[] {
    return this.trackingState.recentAutoActions.slice(0, limit);
  }
  
  /**
   * Get all tracking state
   */
  public getTrackingState(): TrackingState {
    return this.trackingState;
  }
  
  /**
   * Check if a component has been verified
   */
  public isComponentVerified(component: string): {
    verified: boolean;
    status: string;
    action?: VerificationAction;
  } {
    const action = this.trackingState.verificationActions.find(a => 
      a.component.toLowerCase().includes(component.toLowerCase())
    );
    
    if (action) {
      return {
        verified: action.status.includes('VERIFIED'),
        status: action.status,
        action
      };
    }
    
    return {
      verified: false,
      status: 'NOT FOUND'
    };
  }
}

// Command line usage
if (require.main === module) {
  const tracker = new TrackingAwareness();
  
  console.log('=========================================');
  console.log('TRACKING AWARENESS STATUS');
  console.log('=========================================');
  
  console.log('\n🔴 CURRENT CRITICAL PRIORITY:');
  console.log(tracker.getCurrentCriticalPriority());
  
  console.log('\n🔄 RECENT VERIFICATION ACTIONS:');
  const recentActions = tracker.getRecentVerificationActions(3);
  recentActions.forEach(action => {
    console.log(`- ${action.date} | ${action.component} | ${action.status}`);
  });
  
  console.log('\n📝 RECENT AUTO ACTIONS:');
  const recentAutoActions = tracker.getRecentAutoActions(3);
  recentAutoActions.forEach(action => {
    console.log(`- ${action.date} | ${action.title}`);
  });
  
  console.log('\n=========================================');
} 