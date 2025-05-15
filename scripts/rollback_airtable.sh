#!/bin/bash
# rollback_airtable.sh — Restore latest known-good Airtable state from versioned backups
# WHAT: Restores Airtable schema/data from the most recent backup in /infra/airtable/backups/
# WHY: Enables safe, auditable rollback in case of schema drift, data loss, or failed deploy
# HOW: Copies the latest backup to the active Airtable state location; logs all actions
# Codex Principle: Rollback is a contract, not a hope. Trust is built on recoverability.

BACKUP_DIR="$(dirname "$0")/../infra/airtable/backups"
ACTIVE_DIR="$(dirname "$0")/../infra/airtable/active"
LOG_FILE="$(dirname "$0")/../cursor/system-intel/rollback-events.json"

latest_backup=$(ls -t "$BACKUP_DIR" | head -n1)
if [ -z "$latest_backup" ]; then
  echo "{\"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"result\": \"failure\", \"context\": \"No backup found\"}" >> "$LOG_FILE"
  echo "No backup found. Rollback failed."
  exit 1
fi

cp -r "$BACKUP_DIR/$latest_backup"/* "$ACTIVE_DIR/"
echo "{\"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"result\": \"success\", \"context\": \"Airtable rollback to $latest_backup\"}" >> "$LOG_FILE"
echo "Airtable rollback to $latest_backup complete." 