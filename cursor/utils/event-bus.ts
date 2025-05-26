/**
 * EventBus - Canonical Export
 * 
 * Re-exports the canonical EventBus implementation from cursor/event-bus/eventBus.ts
 * to ensure interface consistency across the entire codebase.
 */

import { EventBus } from '../event-bus/eventBus';

export { EventBus };
export default EventBus; 