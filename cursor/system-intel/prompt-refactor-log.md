# Prompt Refactor Log — composePrompt.ts Alignment (2025-05-13)

| fieldName         | previousVariable(s)         | finalVariable   | refactorAction | isEnhancer | TemplateSupport | Notes / Template Fix Proposal |
|-------------------|----------------------------|-----------------|----------------|------------|-----------------|------------------------------|
| targetAudience    | targetAudience, audience    | audience        | updated        | false      | ⚠️ No           | Update all templates to use {{audience}} instead of {{targetAudience}} |
| goals             | goals, goal                | goal            | updated        | false      | ⚠️ No           | Standardize on {{goal}} in all templates |
| companyName       | companyName, bizName        | bizName         | updated        | false      | ⚠️ No           | Update all templates to use {{bizName}} |
| targetMarket      | targetMarket, audience      | audience        | updated        | false      | ⚠️ No           | Update all templates to use {{audience}} |
| campaignGoal      | campaignGoal, goal          | goal            | updated        | false      | ⚠️ No           | Standardize on {{goal}} in all templates |
| callToAction      | callToAction, desiredAction | desiredAction   | updated        | false      | ⚠️ No           | Update all templates to use {{desiredAction}} |
| targetOutcome     | targetOutcome, goal         | goal            | updated        | false      | ⚠️ No           | Standardize on {{goal}} in all templates |
| siteUrl           | siteUrl, url                | url             | updated        | false      | ⚠️ No           | Update all templates to use {{url}} |
| auditType         | auditType, contentType      | contentType     | updated        | false      | ⚠️ No           | Update all templates to use {{contentType}} |
| financials        | financials                  | financials      | stubbed        | false      | ⚠️ No           | Add {{financials}} block to templates as needed |
| emotionalContext  | emotionalContext            | emotionalContext| stubbed        | true       | ⚠️ No           | Add {{emotionalContext}} block to templates as needed |
| (all others OK)   | (no change)                 | (no change)     | no change      | (varies)   | Yes             |                              |

**Legend:**
- refactorAction: updated = code now uses finalVariable; stubbed = placeholder logic added; no change = already canonical
- TemplateSupport: ⚠️ No = template update required; Yes = already supported
- isEnhancer: true/false per canonical map

**Next Steps:**
- Update all gpt-templates to support the canonical variable set above.
- Do not remove support for old aliases until all templates are updated. 