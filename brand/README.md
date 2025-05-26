# CanAI Brand System v1.2

<div align="center">

![CanAI Logo](./canai-logo.svg)

**CanAI.so**  
*Empowerment Through Ease*

---

**Emotionally intelligent, zero-manual-touch strategy engine for small businesses**

</div>

## 🎯 Overview

This directory contains the complete CanAI brand system v1.2, designed to ensure consistent, emotionally intelligent brand presentation across all touchpoints. The system is protected under **Codex Directive: CanAI-Brand-Core/v1.2**.

### 🔒 Brand Lock Status
**LOCKED** - Core brand elements require Cofounder + Codex Approval for modifications.

## 📁 Directory Structure

```
brand/
├── README.md                 # This file - complete brand guide
├── brand-system.md          # Detailed brand specifications
├── colors.json              # Brand color palette (JSON)
├── variables.css            # CSS custom properties
├── canai-logo.svg           # Primary logo file
├── templates/               # Implementation templates
│   ├── html-template.html   # Web implementation example
│   └── markdown-template.md # Document template
└── scripts/
    └── brand-integration.js  # Automated brand integration tool
```

## 🚀 Quick Start

### 1. Import Brand Assets

**CSS Implementation:**
```css
@import url('./brand/variables.css');

/* Use brand variables */
.header {
  background: var(--canai-deep-background);
  color: var(--canai-light-text);
}

.logo {
  color: var(--canai-primary-blue);
  font-family: var(--font-family-primary);
}
```

**JavaScript/JSON Implementation:**
```javascript
import brandColors from './brand/colors.json';

const primaryColor = brandColors.core.primaryBlue; // #00CFFF
const tagline = brandColors.meta.tagline; // "Empowerment Through Ease"
```

### 2. Use Templates

**For Documents:**
Copy `templates/markdown-template.md` as a starting point for any documentation.

**For Web Pages:**
Use `templates/html-template.html` as a reference for web implementations.

### 3. Automated Integration

Run the brand integration script to update existing files:

```bash
# Make script executable
chmod +x brand/scripts/brand-integration.js

# Run on entire project
node brand/scripts/brand-integration.js

# Run on specific directory
node brand/scripts/brand-integration.js ./docs
```

## 🎨 Brand Elements

### Core Colors
| Element | Hex | Usage |
|---------|-----|-------|
| **Primary Blue** | `#00CFFF` | Headers, CTAs, primary elements |
| **Glow Cyan** | `#00F0FF` | Accents, highlights, active states |
| **Deep Background** | `#0A0F1C` | Dark backgrounds, containers |
| **Light Text** | `#E6F6FF` | Body text, readable content |
| **Gradient Anchor** | `#00B2E3` | Gradients, .so domain styling |

### Typography
- **Primary Font:** Manrope (Bold + ExtraLight)
- **Fallback:** Inter, Helvetica Neue, sans-serif
- **Logo:** Manrope Bold, high letter spacing
- **Tagline:** Manrope ExtraLight, 0.45× logo size

### Visual Elements
- **Cube Motif:** Always 3D, glowing, central positioning
- **Icons:** Line-based, glowing neon vector style
- **Effects:** Subtle glow on all brand elements

## 📋 Implementation Checklist

Before publishing any branded material, ensure:

- [ ] **Logo Placement:** CanAI.so logo properly positioned
- [ ] **Tagline:** "Empowerment Through Ease" (no period)
- [ ] **Colors:** Only approved hex codes used
- [ ] **Typography:** Manrope for brand elements
- [ ] **Cube Motif:** 3D and glowing when present
- [ ] **Domain:** CanAI.so with gradient styling
- [ ] **Glow Effects:** Present on icons and key elements
- [ ] **Accessibility:** Proper contrast ratios maintained

## 🛠️ Development Integration

### CSS Custom Properties

The brand system provides comprehensive CSS variables:

```css
/* Core Colors */
--canai-primary-blue: #00CFFF;
--canai-glow-cyan: #00F0FF;
--canai-deep-background: #0A0F1C;
--canai-light-text: #E6F6FF;

/* Gradients */
--canai-gradient-primary: linear-gradient(135deg, #00CFFF 0%, #00B2E3 100%);
--canai-gradient-glow: radial-gradient(circle, rgba(0, 207, 255, 0.8) 0%, rgba(0, 207, 255, 0) 70%);

/* Effects */
--glow-intensity: 0 0 20px rgba(0, 207, 255, 0.6);
--glow-soft: 0 0 10px rgba(0, 240, 255, 0.4);
--glow-cube: 0 0 30px rgba(0, 207, 255, 0.8);

/* Typography */
--font-family-primary: 'Manrope', 'Inter', 'Helvetica Neue', sans-serif;
--font-weight-bold: 700;
--font-weight-extralight: 200;
```

### Utility Classes

Pre-built classes for common brand elements:

```css
.canai-glow          /* Standard glow effect */
.canai-text-glow     /* Text shadow glow */
.canai-gradient-text /* Gradient text fill */
.canai-cube-glow     /* Cube-specific glow */
.canai-icon-glow     /* Icon drop-shadow */
.canai-logo          /* Logo typography */
.canai-tagline       /* Tagline typography */
```

## 🔄 Automated Brand Integration

The brand integration script (`scripts/brand-integration.js`) automatically:

- Updates legacy colors to new brand palette
- Standardizes font references
- Ensures consistent tagline formatting
- Adds brand headers to documents
- Applies CSS custom properties
- Generates detailed integration reports

### Usage Examples

```bash
# Full project integration
node brand/scripts/brand-integration.js

# Specific directory
node brand/scripts/brand-integration.js ./docs

# With custom target
node brand/scripts/brand-integration.js ./src/components
```

## 📚 Service-Specific Branding

Each CanAI service has specific brand applications:

### 📊 Business Plan
- **Color:** Primary Blue (`#00CFFF`)
- **Icon:** Growth chart with glow
- **Tone:** Strategic, confident

### 📱 Social Campaign  
- **Color:** Glow Cyan (`#00F0FF`)
- **Icon:** Network nodes with orbit effect
- **Tone:** Engaging, dynamic

### 📧 Email Campaign
- **Color:** Primary Blue (`#00CFFF`)
- **Icon:** Message with glow trail
- **Tone:** Personal, direct

### 🎨 AI Brand Identity
- **Color:** Glow Cyan (`#00F0FF`)
- **Icon:** Cube transformation
- **Tone:** Creative, intelligent

### 🔍 Website Audit
- **Color:** Primary Blue (`#00CFFF`)
- **Icon:** Magnifying glass with scan lines
- **Tone:** Analytical, thorough

### 🔄 Reverse Strategy
- **Color:** Glow Cyan (`#00F0FF`)
- **Icon:** Circular arrows with glow
- **Tone:** Strategic, insightful

### 🛡️ AI Brand Protection
- **Color:** Primary Blue (`#00CFFF`)
- **Icon:** Shield with neural pattern
- **Tone:** Protective, reliable

## 🔒 Brand Protection & Compliance

### Codex Protection
This brand system is protected under **Codex Directive: CanAI-Brand-Core/v1.2**. Any modifications to core elements require:

1. **Cofounder Approval**
2. **Codex Agent Review**
3. **Brand Integrity Assessment**
4. **Documentation Update**

### Forbidden Modifications
- ❌ Changing core color palette
- ❌ Using different fonts for brand elements
- ❌ Flattening the cube motif
- ❌ Removing glow effects
- ❌ Altering tagline text
- ❌ Using non-approved color combinations

### Approved Variations
- ✅ Icon orbiting order adjustments
- ✅ Cube perspective within 10-30° range
- ✅ Glow intensity based on context
- ✅ Responsive sizing adaptations

## 📞 Support & Resources

### Documentation
- [Complete Brand System](./brand-system.md) - Detailed specifications
- [Markdown Template](./templates/markdown-template.md) - Document formatting
- [HTML Template](./templates/html-template.html) - Web implementation

### Tools
- [Brand Integration Script](./scripts/brand-integration.js) - Automated updates
- [CSS Variables](./variables.css) - Ready-to-use styles
- [Color Palette](./colors.json) - Programmatic access

### Getting Help
For brand-related questions or approval requests:
1. Review this documentation thoroughly
2. Check existing templates and examples
3. Run the integration script for automated fixes
4. Submit requests through proper Codex channels

---

<div align="center">

*Protected under Codex Directive: CanAI-Brand-Core/v1.2*

**CanAI.so** | *Empowerment Through Ease*

*Last Updated: Codex v6.1.4 | Brand System v1.2*

</div> 