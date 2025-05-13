# Event Bus – Audit Context

> This file was auto-generated or updated by Sentinel as part of Phase 2.8.6 audit remediation.

This folder contains the core event management logic for CanAI. It ensures all system events are emitted, handled, and logged in a modular, observable, and failure-resistant manner.

## What
- Centralizes event emission, subscription, and logging for all CanAI modules
- Ensures all events are versioned, source-tagged, and timestamped
- Provides fallback logic for handler errors and log overflow

## Why
- Guarantees no event is dropped or lost without trace
- Enables system-wide observability and auditability
- Supports Codex trust, memory, and recovery standards

## How
- All event emissions are logged with source and timestamp
- Event payloads are structured and traceable
- Handler failures are caught and do not break the event loop
- Log size is capped for performance and safety

**Codex Safeguard:**
If any required audit files are missing, Sentinel auto-generates them using canonical templates. All event bus failures are logged and reflected in system-intel for future audit and recovery. 