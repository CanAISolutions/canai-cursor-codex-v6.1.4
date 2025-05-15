#!/bin/bash
# rollback_prompts.sh — Restore latest known-good prompt versions from versioned backups
# WHAT: Restores all prompt templates from the most recent backup in /prompts/versions/backups/
# WHY: Enables safe, auditable rollback in case of prompt drift, corruption, or failed deploy
# HOW: Copies the latest backup to the active prompt versions location; logs all actions
# Codex Principle: Rollback is a contract, not a hope. Trust is built on recoverability.

BACKUP_DIR="$(dirname "$0")/../prompts/versions/backups"
ACTIVE_DIR="$(dirname "$0")/../prompts/versions/active"
LOG_FILE="$(dirname "$0")/../cursor/system-intel/rollback-events.json"

latest_backup=$(ls -t "$BACKUP_DIR" | head -n1)
if [ -z "$latest_backup" ]; then
  echo "{\"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"result\": \"failure\", \"context\": \"No prompt backup found\"}" >> "$LOG_FILE"
  echo "No prompt backup found. Rollback failed."
  exit 1
fi

cp -r "$BACKUP_DIR/$latest_backup"/* "$ACTIVE_DIR/"
echo "{\"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"result\": \"success\", \"context\": \"Prompt rollback to $latest_backup\"}" >> "$LOG_FILE"
echo "Prompt rollback to $latest_backup complete." 