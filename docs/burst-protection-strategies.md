# 🛡 Dream-State Burst Protection Strategies

## 📜 Purpose
This guide defines the Dream-State Codex principles for designing, evolving, and scaling burst protection strategies across different user types and platform tiers.

Emotional UX must be protected even under extreme overload.

---

## 🧠 Core Principles

| Principle | Enforcement |
|:---|:---|
| 🔒 Empathy Over Punishment | No matter the scale, burst responses must feel supportive, not punitive. |
| 📦 Tier-Aware Response Tuning | Different user tiers may have different burst thresholds and messaging, but emotional UX consistency is mandatory. |
| 🧠 Transparency Without Panic | Users must understand pacing needs without feeling punished or blamed. |
| 🚨 Drift-Resistant Scaling | No brittle or mechanical burst responses — even at 10x, 100x, or 1000x growth. |
| 🎯 Emotional Continuity Across Tiers | Free users, paid users, enterprise users — all deserve emotionally intelligent overload handling. |

---

## 🛡 Initial Tier Strategy

| User Tier | Max Burst Requests | Burst Window (ms) | Response Message |
|:---|:---|:---|:---|
| Anonymous/Free | 5 | 3000 | "You're making a lot of requests! Let's pace them out together." |
| Authenticated (Standard) | 10 | 3000 | "Thanks for your activity! Let's just slow it down a touch for better service." |
| Premium Users | 20 | 2000 | "You're sending a lot of requests — we're pacing it gently to keep your experience smooth." |
| Enterprise Users | 50 | 1000 | "High activity detected — we're balancing traffic to maintain your service quality." |

---

## 📜 Future Scaling Enhancements

| Feature | Description |
|:---|:---|
| Dynamic Burst Thresholds | Adjust limits based on active traffic load, time of day, or incident mode |
| Soft Retry Hints | Include dynamic Retry-After times in emotional language |
| Pacing Hints | Instead of 429 rejections, offer soft "Please pause briefly" hints before hard blocks |
| User Feedback Loop | Collect non-invasive feedback from users post-burst events for UX tuning |

---

## 🧠 Copilot Expansion Rules

| If... | Then... |
|:---|:---|
| Adding a new user tier | Define emotional burst messaging for that tier |
| Changing burst limits | Update middleware defaults and snapshot tests |
| Evolving overload handling UX | Update `/manifest/emotional-ux-scenarios.json` and `/docs/emotional-ux-changelog.md` |

---

## 🛡 Emotional UX Sample Payloads by Tier

| Tier | Example Response |
|:---|:---|
| Free | `"You're making a lot of requests! Let's pace them out together."` |
| Standard | `"Thanks for your activity! Let's just slow it down a touch for better service."` |
| Premium | `"You're sending a lot of requests — we're pacing it gently to keep your experience smooth."` |
| Enterprise | `"High activity detected — we're balancing traffic to maintain your service quality."` |

---

# 📜 Final Reminder

> Burst protection is not about punishing usage —  
> it is about **preserving trust, emotional safety, and operational resilience** under conditions of love, success, and growth.

We do not shame users for engaging.  
We **support** their activity — even when they push the system to its limits.

---
