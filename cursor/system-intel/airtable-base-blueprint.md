<!--
# Airtable Base Blueprint — Codex v6.1.4
Cofounder Directive | Step 2/3: Airtable Schema Scaffolding Recovery
-->

## 📦 PromptLogs
| Field Name         | Field Type   | Prompt Types                                      | Required | Enhancer | Smart Default                        |
|--------------------|-------------|---------------------------------------------------|----------|----------|--------------------------------------|
| industry           | string      | ai_blueprint, ai_brand_identity, business_plan, site_audit, profile_makeover, blogblitz, ad_amplify | true     |          | SaaS                                 |
| audience           | string      | ai_blueprint, ai_brand_identity, business_plan, email_campaign, site_audit, social_content, profile_makeover, blogblitz, ad_amplify | true     |          | Small business owners                |
| goal               | string      | ai_blueprint, business_plan, promptLogs, reverse_strategy, email_campaign, profile_makeover, blogblitz, ad_amplify | true     |          | Launch MVP                           |
| constraints        | string      | ai_blueprint, reverse_strategy                    | false    |          | None                                 |
| tone               | string      | ai_blueprint, ai_brand_identity, business_plan, email_campaign, reverse_strategy, site_audit, social_content, profile_makeover, blogblitz, ad_amplify | false    | ✅       | Empowering                           |
| bizName            | string      | ai_brand_identity, promptLogs                     | false    |          | My Company                           |
| values             | string      | ai_brand_identity                                 | false    |          | Innovation, trust                    |
| budget             | string      | business_plan                                     | false    |          | $10,000                              |
| timeline           | string      | business_plan, reverse_strategy                   | false    |          | 30 days                              |
| financials         | string      | business_plan                                     | false    |          | ⚠️ (Stub: See smart defaults)        |
| emotionalContext   | string      | business_plan                                     | false    | ✅       | ⚠️ (Stub: None provided)             |
| keyMessage         | string      | email_campaign, social_content, blogblitz, ad_amplify | false    |          | Unlock your business potential       |
| desiredAction      | string      | email_campaign                                    | false    |          | Sign up                              |
| currentState       | string      | reverse_strategy                                  | false    |          | Planning                             |
| url                | string      | site_audit                                        | false    |          | https://example.com                  |
| contentType        | string      | site_audit, social_content                        | false    |          | Website                              |
| focusAreas         | string      | site_audit                                        | false    |          | Conversion, trust                    |
| platform           | string      | social_content                                    | false    |          | LinkedIn                             |
| techComfort        | string      | ai_blueprint                                      | false    | ✅       | Intermediate                         |
| monetization       | boolean     | ai_blueprint                                      | false    |          | false                                |
| trafficIntent      | string      | ai_blueprint                                      | false    | ✅       | Organic                              |
| optionalNotes      | richText    | ai_blueprint, site_audit                          | false    | ✅       |                                      |
| painPoint          | string      | ai_blueprint, site_audit                          | false    | ✅       | Unclear value or next steps          |
| inputOutputFlow    | string      | ai_blueprint                                      | false    |          | Standard                             |
| outputFormat       | string      | ai_blueprint                                      | false    |          | Markdown                             |
| userAuth           | boolean     | ai_blueprint                                      | false    |          | false                                |
| successDefinition  | string      | ai_blueprint                                      | false    | ✅       | Launched and monetizing in 60 days   |
| deliveredProduct   | string      | sparksplit                                        | true     |          | Business Plan                        |
| userSatisfaction   | string      | sparksplit                                        | true     | ✅       | Highly Satisfied                     |
| trustContext       | string      | sparksplit                                        | true     | ✅       | Post-Fulfillment                     |

## 📦 FeedbackLogs
| Field Name         | Field Type   | Prompt Types                                      | Required | Enhancer | Smart Default                        |
|--------------------|-------------|---------------------------------------------------|----------|----------|--------------------------------------|
| audience           | string      | ai_blueprint, ai_brand_identity, business_plan, email_campaign, site_audit, social_content, profile_makeover, blogblitz, ad_amplify | true     |          | Small business owners                |
| goal               | string      | ai_blueprint, business_plan, promptLogs, reverse_strategy, email_campaign, profile_makeover, blogblitz, ad_amplify | true     |          | Launch MVP                           |
| tone               | string      | ai_blueprint, ai_brand_identity, business_plan, email_campaign, reverse_strategy, site_audit, social_content, profile_makeover, blogblitz, ad_amplify | false    | ✅       | Empowering                           |
| keyMessage         | string      | email_campaign, social_content, blogblitz, ad_amplify | false    |          | Unlock your business potential       |
| painPoint          | string      | ai_blueprint, site_audit                          | false    | ✅       | Unclear value or next steps          |
| optionalNotes      | richText    | ai_blueprint, site_audit                          | false    | ✅       |                                      |

## 📦 SessionAnalytics
| Field Name         | Field Type   | Prompt Types                                      | Required | Enhancer | Smart Default                        |
|--------------------|-------------|---------------------------------------------------|----------|----------|--------------------------------------|
| industry           | string      | ai_blueprint, ai_brand_identity, business_plan, site_audit, profile_makeover, blogblitz, ad_amplify | true     |          | SaaS                                 |
| audience           | string      | ai_blueprint, ai_brand_identity, business_plan, email_campaign, site_audit, social_content, profile_makeover, blogblitz, ad_amplify | true     |          | Small business owners                |
| goal               | string      | ai_blueprint, business_plan, promptLogs, reverse_strategy, email_campaign, profile_makeover, blogblitz, ad_amplify | true     |          | Launch MVP                           |
| tone               | string      | ai_blueprint, ai_brand_identity, business_plan, email_campaign, reverse_strategy, site_audit, social_content, profile_makeover, blogblitz, ad_amplify | false    | ✅       | Empowering                           |
| techComfort        | string      | ai_blueprint                                      | false    | ✅       | Intermediate                         |
| monetization       | boolean     | ai_blueprint                                      | false    |          | false                                |
| trafficIntent      | string      | ai_blueprint                                      | false    | ✅       | Organic                              |
| userAuth           | boolean     | ai_blueprint                                      | false    |          | false                                |

## 📦 ReferralTriggers
| Field Name         | Field Type   | Prompt Types                                      | Required | Enhancer | Smart Default                        |
|--------------------|-------------|---------------------------------------------------|----------|----------|--------------------------------------|
| audience           | string      | ai_blueprint, ai_brand_identity, business_plan, email_campaign, site_audit, social_content, profile_makeover, blogblitz, ad_amplify | true     |          | Small business owners                |
| goal               | string      | ai_blueprint, business_plan, promptLogs, reverse_strategy, email_campaign, profile_makeover, blogblitz, ad_amplify | true     |          | Launch MVP                           |
| platform           | string      | social_content                                    | false    |          | LinkedIn                             |

## 📦 DeliveryCostLogs
| Field Name         | Field Type   | Prompt Types                                      | Required | Enhancer | Smart Default                        |
|--------------------|-------------|---------------------------------------------------|----------|----------|--------------------------------------|
| industry           | string      | ai_blueprint, ai_brand_identity, business_plan, site_audit, profile_makeover, blogblitz, ad_amplify | true     |          | SaaS                                 |
| goal               | string      | ai_blueprint, business_plan, promptLogs, reverse_strategy, email_campaign, profile_makeover, blogblitz, ad_amplify | true     |          | Launch MVP                           |
| budget             | string      | business_plan                                     | false    |          | $10,000                              |
| timeline           | string      | business_plan, reverse_strategy                   | false    |          | 30 days                              |

<!--
All fields are grouped by Airtable destination. Enhancer fields are marked with ✅. Smart defaults and required status are Codex-aligned. Any uncertainties are flagged with ⚠️.
Traceability: This blueprint is generated from the canonical variable list in variable-alias-map.json and enriched with emotional metadata from input-emotional-enrichment.md. All actions are logged in /cursor/auto-actions.log.md.
--> 