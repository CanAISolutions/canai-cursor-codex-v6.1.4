# 🎯 Resonance Engine: Emotional UI Scaffolding System
**Codex v6.1.4 Aligned Architecture**

## Core Architecture

### 1. Component Generator (`/cursor/resonance-engine/generator/`)
```typescript
interface ComponentSpec {
  name: string;
  type: 'hero' | 'card' | 'form' | 'navigation' | 'fallback';
  emotionalContext: EmotionalContext;
  memberstackBindings: MemberstackBinding[];
  fallbackStates: FallbackState[];
  visualValidation?: boolean;
}

interface EmotionalContext {
  primaryTone: string;
  trustLevel: number; // Must be >= 4.2
  urgencyLevel: 'low' | 'medium' | 'high';
  personalizationDepth: 'basic' | 'contextual' | 'deep';
}
```

### 2. Memberstack Data Adapter (`/cursor/resonance-engine/adapters/`)
```typescript
// Extends existing emotion-payload-builder patterns
export const useMemberstackResonance = () => {
  const [userData, setUserData] = useState<MemberstackUser | null>(null);
  const [planData, setPlanData] = useState<MemberstackPlan | null>(null);
  const [emotionalState, setEmotionalState] = useState<EmotionalPayload>();
  
  // Graceful fallbacks with emotional intelligence
  const getDisplayName = () => userData?.firstName || "Visionary";
  const getPlanTier = () => planData?.tier || "Explorer";
  
  return { userData, planData, emotionalState, getDisplayName, getPlanTier };
};
```

### 3. Trust Fallback Framework (`/cursor/resonance-engine/fallbacks/`)
```typescript
interface TrustFallback {
  trigger: 'slow' | 'error' | 'empty' | 'timeout';
  severity: 'low' | 'medium' | 'high';
  microcopy: string;
  emotionalScore: number;
  recoveryAction?: () => void;
}

// Extends existing emotional-fallback-scenarios.md patterns
export const TrustFallbackProvider = ({ children, fallbacks }) => {
  // Integrates with existing EmotionalValidator
  // Maintains trust score >= 4.2 requirement
};
```

### 4. Visual Validation Layer (`/cursor/resonance-engine/validation/`)
```typescript
interface VisualValidationConfig {
  captureStates: ('loading' | 'error' | 'empty' | 'success')[];
  emotionalStates: string[];
  memberstackStates: ('guest' | 'member' | 'premium')[];
  outputFormat: 'snapshot' | 'dom' | 'screenshot';
}
```

## Integration Points

### Existing Codex Infrastructure
- **Prompt Registry**: Component specs stored as versioned prompts
- **Emotional Validator**: All generated components validated for trust score
- **Event Bus**: Component lifecycle events tracked
- **Memory Integration**: Component usage patterns stored for evolution

### Memberstack Integration
- **Session Continuity**: Leverages existing `validateMemberstackSession` patterns
- **Field Binding**: Type-safe access to user fields with fallbacks
- **Plan Logic**: Conditional rendering based on subscription tier

### Testing Integration
- **Jest Compatibility**: Generated components include comprehensive test suites
- **Emotional UX Tests**: Validates emotional resonance across states
- **Visual Regression**: Optional snapshot testing for UI consistency

## Workflow Example

### 1. Component Specification (Natural Language)
```markdown
# Hero Banner: Welcome Back Experience
- **Emotional Context**: Reassuring, high trust (4.5+), medium personalization
- **Memberstack Bindings**: user.firstName, plan.tier, user.lastLogin
- **Fallback States**: Loading, session timeout, guest mode
- **Visual Validation**: Capture all emotional states
```

### 2. Generated Component Structure
```
/components/hero-welcome-back/
├── HeroWelcomeBack.tsx          # Main component
├── HeroWelcomeBack.test.tsx     # Jest tests
├── HeroWelcomeBack.stories.tsx  # Storybook stories
├── fallbacks/
│   ├── LoadingState.tsx
│   ├── TimeoutState.tsx
│   └── GuestState.tsx
├── hooks/
│   └── useWelcomeBackData.tsx
└── spec.json                    # Component specification
```

### 3. Generated Component Example
```typescript
export const HeroWelcomeBack: React.FC<HeroWelcomeBackProps> = ({
  emotionalOverride,
  fallbackConfig
}) => {
  const { userData, planData, emotionalState } = useMemberstackResonance();
  const { displayName, planTier } = usePersonalization(userData, planData);
  
  return (
    <TrustFallbackProvider fallbacks={fallbackConfig}>
      <div className="hero-welcome bg-gradient-to-r from-[#00CFFF] to-[#00F0FF]">
        <h1 className="text-4xl font-bold text-white">
          Welcome back, {displayName}
        </h1>
        <p className="text-lg text-[#E6F6FF]">
          Your {planTier} journey continues — let's build something brilliant.
        </p>
      </div>
    </TrustFallbackProvider>
  );
};
```

## CLI Interface

### Basic Generation
```bash
npx resonance generate hero-banner \
  --tone="reassuring" \
  --memberstack="firstName,planTier" \
  --fallbacks="loading,timeout,guest" \
  --visual-validation
```

### Advanced Generation with Prompt
```bash
npx resonance generate --from-prompt="prompts/hero-welcome-v2.md" \
  --output="components/heroes/" \
  --test-coverage="emotional,functional,visual"
```

## Evolution & Maintenance

### Prompt Versioning
- Each component links to source prompt via Git commit
- Component evolution tracked through prompt registry
- Automatic migration suggestions for breaking changes

### Emotional Scoring
- Real-time trust score monitoring for generated components
- Automatic fallback activation when scores drop below 4.2
- A/B testing framework for emotional optimization

### Visual Validation Pipeline
- Automated screenshot comparison for emotional states
- DOM structure validation for accessibility compliance
- Performance monitoring for emotional loading states

## Folder Structure Integration

```
/cursor/resonance-engine/
├── cli/                    # Command-line interface
├── generator/              # Component generation logic
├── adapters/              # Memberstack & data adapters
├── fallbacks/             # Trust fallback framework
├── validation/            # Visual & emotional validation
├── templates/             # Component templates
├── prompts/               # Generation prompts
└── tests/                 # System tests
```

This architecture preserves your existing emotional intelligence infrastructure while providing a scalable path for UI component generation that maintains trust, emotional resonance, and development velocity. 