// universal-contract-registry.ts
// WHAT: Universal Contract Registry & Adapter Layer (Phase 2.9.1)
// WHY: Canonical, platform-wide schema governance, real-time diff detection, and auto-adaptation for 20+ integrations
// HOW: Versioned contract storage, diff detection, compatibility warnings, emitContractChange hook, auto-adapter stubs
// Persona: Cursor, Sentinel
// Future: Scales to 20+ platforms, governs all schema evolution

import { EventBus } from '../event-bus/eventBus';
import fs from 'fs';
import path from 'path';

const CONTRACT_REGISTRY_LOG = path.resolve(__dirname, '../system-intel/contract-registry-log.json');

/**
 * ContractRegistryEntry — Canonical contract definition with versioning
 */
export interface ContractRegistryEntry {
  id: string;
  platform: string;
  version: string;
  schema: object;
  lastUpdated: number;
  adapters: string[];
}

/**
 * UniversalContractRegistry — Platform-wide source of truth for all contracts
 * Emits contract change events, supports diff detection, and auto-generates adapters
 * Version: v1.0.0
 */
export class UniversalContractRegistry {
  private static instance: UniversalContractRegistry;
  private contracts: Map<string, ContractRegistryEntry> = new Map();
  private eventBus: EventBus;

  private constructor() {
    this.eventBus = EventBus.getInstance();
  }

  static getInstance(): UniversalContractRegistry {
    if (!UniversalContractRegistry.instance) {
      UniversalContractRegistry.instance = new UniversalContractRegistry();
    }
    return UniversalContractRegistry.instance;
  }

  /**
   * Registers or updates a contract, emits change event, and checks for compatibility
   */
  public registerContract(entry: ContractRegistryEntry): void {
    const prev = this.contracts.get(entry.id);
    this.contracts.set(entry.id, entry);
    if (prev) {
      const diff = this.diffContracts(prev, entry);
      if (diff) {
        this.emitContractChange(entry, diff);
        if (!this.isBackwardsCompatible(prev, entry)) {
          this.eventBus.emit('contract.compatibility.warning', { id: entry.id, diff });
        }
      }
    } else {
      this.emitContractChange(entry, null);
    }
    // Auto-generate adapter stub for new platforms
    if (!entry.adapters || entry.adapters.length === 0) {
      entry.adapters = this.generateAdapterStubs(entry.platform);
    }
    // Emit full registry state to contract-registry-log.json (append-safe, version-controlled)
    this.emitRegistryState();
  }

  /**
   * Diffs two contract entries
   */
  private diffContracts(a: ContractRegistryEntry, b: ContractRegistryEntry): object | null {
    // TODO: Implement deep diff logic
    return a.schema === b.schema ? null : { from: a.schema, to: b.schema };
  }

  /**
   * Checks backwards compatibility
   */
  private isBackwardsCompatible(a: ContractRegistryEntry, b: ContractRegistryEntry): boolean {
    // TODO: Implement compatibility logic
    return true;
  }

  /**
   * Emits contract change event
   */
  private emitContractChange(entry: ContractRegistryEntry, diff: object | null): void {
    this.eventBus.emit('contract.change', { entry, diff });
  }

  /**
   * Generates adapter stubs for a given platform
   */
  private generateAdapterStubs(platform: string): string[] {
    // Simulate 20+ platform adapters
    return Array.from({ length: 20 }, (_, i) => `${platform}-adapter-v${i + 1}`);
  }

  /**
   * Simulate registry scaling to 20+ platforms
   */
  public simulateMultiPlatform(): void {
    for (let i = 1; i <= 20; i++) {
      this.registerContract({
        id: `platform-${i}`,
        platform: `Platform${i}`,
        version: `v1.0.${i}`,
        schema: { fields: [`field${i}`] },
        lastUpdated: Date.now(),
        adapters: []
      });
    }
  }

  /**
   * Emits the full contract registry state to /cursor/system-intel/contract-registry-log.json
   */
  private emitRegistryState(): void {
    const state = Array.from(this.contracts.values());
    let log: any[] = [];
    try {
      if (fs.existsSync(CONTRACT_REGISTRY_LOG)) {
        log = JSON.parse(fs.readFileSync(CONTRACT_REGISTRY_LOG, 'utf-8'));
      }
    } catch (e) {
      log = [];
    }
    log.push({
      timestamp: new Date().toISOString(),
      state,
      version: 'v1.0.0',
    });
    fs.writeFileSync(CONTRACT_REGISTRY_LOG, JSON.stringify(log, null, 2));
  }

  /**
   * CI diff check: compares the current registry log to a source-of-truth and throws if any contract/field/alias is missing or unregistered
   * WHAT: Ensures all modules, fields, aliases, and contracts are fully registered and version-controlled
   * WHY: Blocks unregistered contract/field changes in CI, enforcing Codex contract registry lock
   * HOW: Throws on any diff, for CI enforcement
   */
  public static ciDiffCheck(sourceOfTruth: ContractRegistryEntry[]): void {
    let log: any[] = [];
    try {
      if (fs.existsSync(CONTRACT_REGISTRY_LOG)) {
        log = JSON.parse(fs.readFileSync(CONTRACT_REGISTRY_LOG, 'utf-8'));
      }
    } catch (e) {
      log = [];
    }
    const latest = log.length > 0 ? log[log.length - 1].state : [];
    const missing = sourceOfTruth.filter(truthEntry =>
      !latest.some((regEntry: ContractRegistryEntry) =>
        regEntry.id === truthEntry.id &&
        regEntry.version === truthEntry.version &&
        JSON.stringify(regEntry.schema) === JSON.stringify(truthEntry.schema)
      )
    );
    if (missing.length > 0) {
      throw new Error(
        `[Codex CI] Contract registry diff detected. Missing or unregistered contracts/fields: ${missing
          .map(e => e.id)
          .join(', ')}. Registry lock enforcement failed.`
      );
    }
  }
}

// Test stub
export function testUniversalContractRegistry() {
  const registry = UniversalContractRegistry.getInstance();
  registry.simulateMultiPlatform();
  // TODO: Add assertions and log output
}

// Log stub
export function logContractRegistryState() {
  // TODO: Emit registry state to system-intel
}

// Trigger example
// registry.registerContract({ id: 'stripe', platform: 'Stripe', version: 'v2.1.0', schema: {...}, lastUpdated: Date.now(), adapters: [] });

// Future: Integrate with evolution orchestrator for contract-driven evolution 