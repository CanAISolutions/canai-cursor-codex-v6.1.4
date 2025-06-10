#!/bin/bash

# CANAI Interface Catalog Verification Script
# This script helps verify interface definitions between catalog files and actual code

echo "===== CANAI INTERFACE CATALOG VERIFICATION TOOL ====="
echo "This tool helps verify interface accuracy between catalogs and code"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Paths
CATALOG_V1="workspace-organization/04-interfaces/catalog/CANAI-INTERFACE-CATALOG.json"
CATALOG_V2="workspace-organization/04-interfaces/catalog/CANAI-INTERFACE-CATALOG-V2.json"
OUTPUT_LOG="workspace-organization/04-interfaces/catalog/verification-results.md"

# Extract all interface names from both catalogs
echo "Extracting interface names from catalogs..."
V1_INTERFACES=$(grep -o '"[A-Za-z0-9]*Prompt"\|"[A-Za-z0-9]*Output"\|"[A-Za-z0-9]*Profile"\|"[A-Za-z0-9]*Metrics"' $CATALOG_V1 | sort | uniq | tr -d '"')
V2_INTERFACES=$(grep -o '"[A-Za-z0-9]*Prompt"\|"[A-Za-z0-9]*Output"\|"[A-Za-z0-9]*Profile"\|"[A-Za-z0-9]*Metrics"\|"[A-Za-z0-9]*Context"\|"[A-Za-z0-9]*Config"\|"[A-Za-z0-9]*Validation"\|"[A-Za-z0-9]*Pattern"\|"[A-Za-z0-9]*Evolution"\|"[A-Za-z0-9]*Advantage"\|"[A-Za-z0-9]*Insight"\|"[A-Za-z0-9]*Transparency"\|"[A-Za-z0-9]*Sovereignty"' $CATALOG_V2 | sort | uniq | tr -d '"')

# Initialize output log
echo "# CANAI Interface Catalog Verification Results" > $OUTPUT_LOG
echo "Generated: $(date)" >> $OUTPUT_LOG
echo "" >> $OUTPUT_LOG
echo "## Summary" >> $OUTPUT_LOG
echo "" >> $OUTPUT_LOG

# Count interfaces
V1_COUNT=$(echo "$V1_INTERFACES" | wc -l)
V2_COUNT=$(echo "$V2_INTERFACES" | wc -l)

echo "V1 Catalog contains approximately $V1_COUNT interfaces"
echo "V2 Catalog contains approximately $V2_COUNT interfaces"
echo "" >> $OUTPUT_LOG
echo "- V1 Catalog: ~$V1_COUNT interfaces" >> $OUTPUT_LOG
echo "- V2 Catalog: ~$V2_COUNT interfaces" >> $OUTPUT_LOG
echo "" >> $OUTPUT_LOG

# Check for interfaces in V1 that might be missing in V2
echo "## Interfaces in V1 potentially missing complete definitions in V2:" >> $OUTPUT_LOG
echo "" >> $OUTPUT_LOG
echo "Checking for interfaces missing from V2..."

MISSING_COUNT=0

for interface in $V1_INTERFACES; do
  # Check if the interface is in V2 with actual fields definition
  if ! grep -q "\"$interface\": {" $CATALOG_V2; then
    echo -e "${RED}WARNING:${NC} $interface might be missing complete definition in V2"
    echo "- [ ] $interface" >> $OUTPUT_LOG
    MISSING_COUNT=$((MISSING_COUNT + 1))
  elif ! grep -q "\"$interface\": {.*\"fields\": {" $CATALOG_V2 -A 5; then
    echo -e "${YELLOW}PARTIAL:${NC} $interface mentioned but might be missing fields in V2"
    echo "- [ ] $interface (partial definition)" >> $OUTPUT_LOG
    MISSING_COUNT=$((MISSING_COUNT + 1))
  fi
done

if [ $MISSING_COUNT -eq 0 ]; then
  echo -e "${GREEN}No interfaces from V1 appear to be missing in V2${NC}"
  echo "- No missing interfaces detected ✅" >> $OUTPUT_LOG
else
  echo -e "${RED}Found $MISSING_COUNT interfaces potentially missing complete definitions in V2${NC}"
fi

echo "" >> $OUTPUT_LOG

# Check for code path accuracy
echo "## Verifying interface code paths:" >> $OUTPUT_LOG
echo "" >> $OUTPUT_LOG
echo "Verifying code paths for interfaces..."

INVALID_PATHS=0

function check_path() {
  local interface=$1
  local catalog=$2
  local path=$(grep -A 2 "\"$interface\": {" $catalog | grep "path" | cut -d'"' -f 4)
  
  if [ -z "$path" ]; then
    echo -e "${YELLOW}WARNING:${NC} No path specified for $interface in catalog"
    echo "- [ ] $interface - No path specified" >> $OUTPUT_LOG
    return 1
  fi
  
  # Extract just the file path without line numbers
  file_path=$(echo $path | cut -d':' -f 1)
  
  if [ ! -f "$file_path" ]; then
    echo -e "${RED}ERROR:${NC} Invalid path for $interface: $file_path"
    echo "- [ ] $interface - Invalid path: \`$path\`" >> $OUTPUT_LOG
    return 1
  else
    # Check if the interface is actually defined in that file
    if ! grep -q "interface $interface" "$file_path"; then
      echo -e "${YELLOW}WARNING:${NC} Interface $interface not found in $file_path"
      echo "- [ ] $interface - Interface not found in specified file: \`$path\`" >> $OUTPUT_LOG
      return 1
    else
      echo -e "${GREEN}VALID:${NC} Path for $interface is correct: $path"
      echo "- [x] $interface - Valid path: \`$path\`" >> $OUTPUT_LOG
      return 0
    fi
  fi
}

# Check paths in both catalogs
for interface in $V1_INTERFACES $V2_INTERFACES; do
  if grep -q "\"$interface\": {" $CATALOG_V1; then
    if ! check_path $interface $CATALOG_V1; then
      INVALID_PATHS=$((INVALID_PATHS + 1))
    fi
  elif grep -q "\"$interface\": {" $CATALOG_V2; then
    if ! check_path $interface $CATALOG_V2; then
      INVALID_PATHS=$((INVALID_PATHS + 1))
    fi
  fi
done

if [ $INVALID_PATHS -eq 0 ]; then
  echo -e "${GREEN}All interface paths are valid${NC}"
else
  echo -e "${RED}Found $INVALID_PATHS invalid or concerning paths${NC}"
fi

echo "" >> $OUTPUT_LOG
echo "## Recommendations:" >> $OUTPUT_LOG
echo "" >> $OUTPUT_LOG
echo "1. Ensure all original interfaces from V1 have complete definitions with fields in the definitive catalog" >> $OUTPUT_LOG
echo "2. Verify all code paths point to actual interface definitions" >> $OUTPUT_LOG
echo "3. Confirm field types match actual TypeScript definitions" >> $OUTPUT_LOG
echo "4. Validate relationships between interfaces match code dependencies" >> $OUTPUT_LOG
echo "" >> $OUTPUT_LOG

echo ""
echo "Verification complete. Results saved to $OUTPUT_LOG"
echo "Use these results to ensure the definitive catalog is 100% accurate." 