# CanAI Brand System v1.2
**Codex Lock Status:** 🔒 **LOCKED** - Core brand elements are protected under Codex Directive: CanAI-Brand-Core/v1.2

---

## 🎯 Brand Foundation

### Core Identity
- **Name:** CanAI
- **Domain:** CanAI.so (canonical)
- **Tagline:** Empowerment Through Ease
- **Core Promise:** Emotionally intelligent, zero-manual-touch strategy engine for small businesses
- **Visual Theme:** Futuristic, emotionally resonant, ease-centric

### Brand Inspiration
Drawing inspiration from Chainlink's technical sophistication while maintaining emotional intelligence and accessibility.

---

## 🎨 Color System (Locked)

### Primary Palette
| Color Use | Hex | RGB | Description |
|-----------|-----|-----|-------------|
| **Primary Blue** | `#00CFFF` | `rgb(0, 207, 255)` | Radiant, futuristic trust signal |
| **Deep Background** | `#0A0F1C` | `rgb(10, 15, 28)` | Dark galaxy backdrop |
| **Glow Cyan Accent** | `#00F0FF` | `rgb(0, 240, 255)` | Neural spark, activation energy |
| **Light Text** | `#E6F6FF` | `rgb(230, 246, 255)` | Soft white/blue hybrid for legibility |
| **Gradient Anchor** | `#00B2E3` | `rgb(0, 178, 227)` | Used in logo wordmark (.so) |

### Gradients
```css
/* Primary Brand Gradient */
background: linear-gradient(135deg, #00CFFF 0%, #00B2E3 100%);

/* Glow Effect */
background: radial-gradient(circle, rgba(0, 207, 255, 0.8) 0%, rgba(0, 207, 255, 0) 70%);

/* Cube Interior */
background: linear-gradient(45deg, #00CFFF 0%, #00F0FF 50%, #00B2E3 100%);
```

### Usage Rules
- **All glowing/particle effects** use radial gradients from `#00CFFF` with opacity fade
- **Never use colors outside this palette** for brand elements
- **Maintain contrast ratios** of 4.5:1 minimum for accessibility

---

## 🔤 Typography System

### Font Hierarchy
- **Primary Font:** Manrope (Bold + ExtraLight)
- **Fallbacks:** Inter, Helvetica Neue, sans-serif

### Usage Rules
| Element | Font | Weight | Spacing | Size Ratio |
|---------|------|--------|---------|------------|
| **Headlines/Wordmark** | Manrope Bold | 700 | +5 to +10 tracking | 1.0× |
| **Body Copy/Tagline** | Manrope ExtraLight | 200 | Normal | 0.45× logo size |
| **UI Elements** | Inter Light | 300 | Normal | Variable |

### Implementation
```css
/* Logo/Headlines */
font-family: 'Manrope', 'Inter', 'Helvetica Neue', sans-serif;
font-weight: 700;
letter-spacing: 0.1em;

/* Tagline */
font-family: 'Manrope', 'Inter', 'Helvetica Neue', sans-serif;
font-weight: 200;
font-size: 0.45em; /* Relative to logo */
```

---

## 🔷 Iconography System

### Design Principles
- **Style:** Line-based, glowing neon vector
- **Stroke:** 1.5–2px with cyan glow edge
- **Behavior:** Encircle or frame primary services
- **Glow Effect:** Soft drop-shadow with `#00F0FF`

### Service Icon Mapping
Each icon represents one of the 7 core CanAI products:

1. **Business Plan** - `#00CFFF`
2. **Social Campaign** - `#00F0FF`
3. **Email Campaign** - `#00CFFF`
4. **AI Brand Identity** - `#00F0FF`
5. **Website Audit** - `#00CFFF`
6. **Reverse Strategy** - `#00F0FF`
7. **AI Brand Protection** - `#00CFFF`

### Orbit Effect
- **Radius:** 120px from cube center
- **Animation:** Gentle rotation suggesting gravitational pull
- **Spacing:** Equal distribution around 360°

---

## 🧊 Cube Motif (Core Visual Element)

### Design Role
- **Represents:** The CanAI engine — modular, scalable, emotionally intelligent
- **Interior Glow:** Strategy intelligence core
- **Perspective:** Golden ratio positioning
- **Orbit Lines:** Suggest gravity and automation

### Technical Specifications
```css
.canai-cube {
  width: 200px;
  height: 200px;
  perspective: 1000px;
  transform: rotateX(15deg) rotateY(25deg);
  background: linear-gradient(45deg, #00CFFF 0%, #00F0FF 50%, #00B2E3 100%);
  box-shadow: 0 0 30px rgba(0, 207, 255, 0.8);
}
```

### Usage Rules
- **Always 3D and front-facing**
- **Central anchor** in all compositions
- **Glowing interior** represents active intelligence
- **Never flatten or remove perspective**

---

## 🔁 Consistency Directives

### Mandatory Elements
1. **Tagline Placement:** All text below logo must say "Empowerment Through Ease"
2. **Domain Styling:** `.so` in CanAI.so is always in gradient blue or cyan
3. **Icon Requirements:** Never appear without soft glow and vector cleanliness
4. **Cube Centrality:** Must always be 3D glowing and front-facing

### Approved Variations
- **Icon orbiting order** may shift
- **Cube perspective** can adjust within 10-30° range
- **Glow intensity** can vary by context (subtle to prominent)

### Forbidden Modifications
- ❌ Changing core colors
- ❌ Using different fonts for brand elements
- ❌ Flattening the cube
- ❌ Removing glow effects
- ❌ Altering tagline text

---

## 📐 Layout Guidelines

### Logo Composition
```
[CanAI.so] ← Gradient text, Manrope Bold
    ↓
[Empowerment Through Ease] ← 0.45× size, ExtraLight, centered
```

### Service Layout
```
     [Icon] ← Glowing, orbiting
       ↓
   [Service] ← Cyan glow
       ↓
[Description] ← Light text
```

### Cube Positioning
- **Center stage** in hero sections
- **Golden ratio** positioning (38.2% from edges)
- **Minimum clearance** of 40px from other elements

---

## 🛠️ Implementation Resources

### CSS Variables
Import: `brand/variables.css`
```css
/* Core colors */
var(--canai-primary-blue)
var(--canai-deep-background)
var(--canai-glow-cyan)

/* Effects */
var(--glow-intensity)
var(--glow-cube)
var(--canai-gradient-primary)
```

### JSON Configuration
Import: `brand/colors.json`
```javascript
import brandColors from './brand/colors.json';
const primaryBlue = brandColors.core.primaryBlue;
```

### Utility Classes
```css
.canai-glow          /* Standard glow effect */
.canai-text-glow     /* Text shadow glow */
.canai-gradient-text /* Gradient text fill */
.canai-cube-glow     /* Cube-specific glow */
.canai-icon-glow     /* Icon drop-shadow */
```

---

## 🔒 Codex Protection

This brand system is protected under **Codex Directive: CanAI-Brand-Core/v1.2**

### Change Authorization
- **Core elements:** Require Cofounder + Codex Approval
- **Variations:** Must maintain brand integrity
- **New assets:** Must conform to this system

### Compliance Monitoring
- Automated brand consistency checks
- Visual regression testing
- Codex agent oversight

---

## 📋 Quick Reference Checklist

### Before Publishing Any Asset:
- [ ] Uses approved color palette only
- [ ] Manrope font for brand elements
- [ ] Tagline reads "Empowerment Through Ease"
- [ ] Icons have glow effects
- [ ] Cube is 3D and central
- [ ] .so domain styling is gradient
- [ ] Maintains emotional intelligence tone
- [ ] Follows accessibility guidelines

### File Naming Convention:
- `canai-logo-[variant]-[size].[ext]`
- `canai-icon-[service]-[state].[ext]`
- `canai-cube-[perspective]-[glow].[ext]`

---

*Last Updated: Codex v6.1.4 | Brand System v1.2*
*Next Review: Phase 2.8.6* 