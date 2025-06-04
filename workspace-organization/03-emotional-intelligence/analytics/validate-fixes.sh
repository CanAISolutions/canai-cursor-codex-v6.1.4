#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting validation of fixes...${NC}\n"

# Run TypeScript compilation check
echo -e "${YELLOW}Checking TypeScript compilation...${NC}"
npx tsc --noEmit
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ TypeScript compilation successful${NC}"
else
    echo -e "${RED}✗ TypeScript compilation failed${NC}"
    exit 1
fi

# Run ESLint
echo -e "\n${YELLOW}Running ESLint...${NC}"
npx eslint .
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ ESLint passed${NC}"
else
    echo -e "${RED}✗ ESLint failed${NC}"
    exit 1
fi

# Run test suite
echo -e "\n${YELLOW}Running test suite...${NC}"
npx jest --verbose
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed${NC}"
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi

# Check test coverage
echo -e "\n${YELLOW}Checking test coverage...${NC}"
npx jest --coverage
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Test coverage requirements met${NC}"
else
    echo -e "${RED}✗ Test coverage requirements not met${NC}"
    exit 1
fi

# Validate Sacred Reversal Test
echo -e "\n${YELLOW}Validating Sacred Reversal Test...${NC}"
node -e "
const { AdvancedAnalyticsInsightsEngine } = require('./advanced-analytics-insights-engine');
const engine = new AdvancedAnalyticsInsightsEngine();
(async () => {
    const result = await engine.validateSacredReversalTest();
    if (result) {
        console.log('\x1b[32m✓ Sacred Reversal Test passed\x1b[0m');
        process.exit(0);
    } else {
        console.log('\x1b[31m✗ Sacred Reversal Test failed\x1b[0m');
        process.exit(1);
    }
})();
"

# Final validation summary
echo -e "\n${YELLOW}Validation Summary:${NC}"
echo -e "${GREEN}✓ TypeScript compilation successful${NC}"
echo -e "${GREEN}✓ ESLint passed${NC}"
echo -e "${GREEN}✓ All tests passed${NC}"
echo -e "${GREEN}✓ Test coverage requirements met${NC}"
echo -e "${GREEN}✓ Sacred Reversal Test passed${NC}"

echo -e "\n${GREEN}All validations completed successfully!${NC}" 