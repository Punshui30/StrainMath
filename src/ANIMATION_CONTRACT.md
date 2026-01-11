# Blend Animation State Machine Contract

**For Bolt.new Implementation & Figma Handoff**

This document defines the exact spatial and temporal contract for the blend recommendation animation. This is a **state-driven system**, not a timeline-based animation.

---

## Core Principles

1. **No Blended Transitions** — Each state is discrete and complete
2. **No Object Creation Mid-Flight** — All objects exist before animation starts
3. **Sequential, Not Simultaneous** — Cards lift one at a time
4. **Real DOM Positions** — Cards animate from their actual rendered position
5. **One Color Per Strain** — Consistent color tokens across all surfaces

---

## State Machine: Four Non-Overlapping States

### **STATE 0 — IDLE**

**Visual State:**
- Inventory tray visible at bottom (96px height)
- Logo centered, idle breathing animation
- No recommendation cards visible
- No highlighted strains
- Prompts sidebar visible on left (280px width)

**User Interaction:**
- Can scroll inventory manually
- Can click prompt to trigger state transition

**Exit Condition:**
- User clicks prompt → Transition to STATE 1

---

### **STATE 1 — INVENTORY ALIGNMENT**

**Duration:** 600ms scroll + 100ms settle = 700ms total

**Actions:**
1. System determines blend ingredients (e.g., Blue Dream, Northern Lights, Blueberry)
2. Inventory tray auto-scrolls horizontally to center selected strain cards
3. Selected cards become highlighted with:
   - Top border (3px) in strain-specific color
   - Full outline glow in strain-specific color
   - Bottom-right indicator dot (8px) in strain-specific color
4. **CRITICAL:** Tray becomes completely stationary

**Hard Rules:**
- ❌ NO card lifting during this state
- ❌ NO vertical movement of any kind
- ✅ Cards are highlighted but remain in tray
- ✅ Scroll animation must complete before STATE 2

**Visual Correlation:**
- Blue Dream → Teal accent (#14B8A6)
- Northern Lights → Emerald accent (#10B981)
- Blueberry → Cyan accent (#0891B2)

**Exit Condition:**
- Scroll complete + 800ms hold → Transition to STATE 2

---

### **STATE 2 — INGREDIENT LIFT (Sequential)**

**Duration:** N × (300ms + 150ms delay) where N = ingredient count

**Actions (PER CARD):**

For each ingredient card (in sequence, not parallel):

1. **Capture Start Position**
   - Read DOM rect from actual card in inventory tray
   - Store: `{ left, top, width, height }`

2. **Create Flying Card**
   - Spawn positioned overlay at start position
   - Card shows strain name (readable during flight)
   - Card shows role label in strain color
   - Card has glow trail in strain color

3. **Animate to Logo** (300ms)
   - Path: Curved arc (control point 60px above midpoint)
   - Scale: 1.0 → 0.92
   - Opacity: 1.0 → 0 (on arrival)
   - Easing: `[0.22, 1, 0.36, 1]` (ease-out-expo)

4. **Logo Reaction**
   - Logo pulses (scale 1.0 → 1.08 → 1.0) over 400ms
   - Glow intensity increases: `0.4 + (arrivedCount / totalCards) × 0.4`
   - Visual feedback: "2 / 3 received"

5. **Wait 150ms** → Next card begins

**Hard Rules:**
- ❌ NO simultaneous card animations
- ❌ NO teleporting (must show curved path)
- ❌ NO flashes or particle effects
- ✅ Strain name must be readable during flight
- ✅ One card completes before next begins
- ✅ Exactly N cards (N = ingredientCards.length)

**Example Sequence (3 ingredients):**
```
0ms     — Card 1 lifts (Blue Dream)
300ms   — Card 1 arrives, Logo pulses (1/3)
450ms   — Card 2 lifts (Northern Lights)
750ms   — Card 2 arrives, Logo pulses (2/3)
900ms   — Card 3 lifts (Blueberry)
1200ms  — Card 3 arrives, Logo pulses (3/3)
1350ms  — STATE 3 begins
```

**Exit Condition:**
- All N cards arrived + 150ms delay → Transition to STATE 3

---

### **STATE 3 — RECOMMENDATION OUTPUT**

**Duration:** 500ms fade-in

**Actions:**

1. **Logo State**
   - Glow intensity at maximum (0.9)
   - No longer pulsing
   - Shows "Complete" label

2. **Recommendation Cards Appear**
   - Three cards fade in from bottom (y: 20 → 0)
   - Staggered delay: index × 80ms
   - Each card shows:
     - Blend name
     - Vibe emphasis
     - Confidence range
     - Component breakdown with color-coded dots

3. **Inventory State**
   - Strain highlights removed or dimmed
   - Tray remains visible
   - No longer interactive

4. **Why Panel**
   - Floats in from right
   - Shows confidence score + explanation

**Visual Correlation (Component Breakdown):**

Each strain listed in recommendation cards shows a colored indicator dot matching:
- Ring segment color (in circular visualization)
- Inventory card accent color (top border + glow)
- Flying card glow color

Example:
```
Blue Dream      [●] Teal dot    50%    Driver
Northern Lights [●] Emerald dot 30%    Modulator  
Blueberry       [●] Gold dot    20%    Anchor
```

**Exit Condition:**
- User clicks "Make This Blend" → Calculator view
- User clicks "Start Over" → Return to STATE 0

---

## Color Token Contract

**One strain = One color** across all surfaces.

### Strain Color Map:
```typescript
'Blue Dream'         → #14B8A6  (Teal)
'Northern Lights'    → #10B981  (Emerald)
'Blueberry'          → #0891B2  (Cyan)
'Sour Diesel'        → #F59E0B  (Amber)
'OG Kush'            → #D97706  (Orange)
'Girl Scout Cookies' → #DC2626  (Red)
'Granddaddy Purple'  → #9333EA  (Purple)
'Jack Herer'         → #EAB308  (Yellow)
'White Widow'        → #06B6D4  (Sky)
'Amnesia Haze'       → #84CC16  (Lime)
```

**Special Case:**
- If role = "Anchor" → Override with gold (#D4AF37)

### Usage:
- Inventory card: Top border (3px), outline glow, indicator dot
- Flying card: Glow trail, role label color
- Ring segment: Gradient fill, segment glow
- Result card: Component indicator dot

---

## Implementation Checklist for Bolt.new

### Required Components:

- [ ] `AnimationState` enum with 4 states
- [ ] `IngredientCard` interface with strain, color, percentage, role
- [ ] State machine hook/context
- [ ] Sequential card lifting orchestrator
- [ ] DOM position capture utility
- [ ] Strain color token registry

### Required Timing Constants:

```typescript
SCROLL_DURATION: 600ms
SCROLL_SETTLE: 100ms
CARD_LIFT_DURATION: 300ms
CARD_LIFT_DELAY: 150ms
LOGO_PULSE_DURATION: 200ms
TOKEN_EMIT_DURATION: 400ms
RECOMMENDATION_FADE_IN: 500ms
```

### Critical Validations:

- [ ] Inventory scroll completes before any card lifts
- [ ] Exactly N cards animate (N = blend components)
- [ ] Cards lift from real DOM positions (not hardcoded)
- [ ] Cards animate sequentially (never simultaneously)
- [ ] Strain names remain readable during flight
- [ ] Color tokens consistent across all surfaces
- [ ] No object creation during animation
- [ ] State transitions are atomic (no partial states)

---

## Figma → Bolt.new Handoff Notes

### What Figma Should Deliver:

**4 Static Frames:**

1. **Frame: STATE_0_IDLE**
   - Complete UI at rest
   - Inventory visible, logo idle

2. **Frame: STATE_1_INVENTORY_ALIGNED**
   - Inventory scrolled to show Blue Dream, Northern Lights, Blueberry
   - Cards have teal/emerald/cyan accents
   - Logo in "analyzing" state (slight glow)

3. **Frame: STATE_2_INGREDIENT_LIFT_MID**
   - One card mid-flight (e.g., Northern Lights)
   - Card position: halfway between tray and logo
   - Logo pulsing
   - Counter: "2 / 3 received"

4. **Frame: STATE_3_RECOMMENDATION_OUTPUT**
   - Three recommendation cards visible
   - Logo at max glow
   - Why panel visible

### What Figma Should NOT Do:

- ❌ Animate the full sequence (Figma can't do state logic)
- ❌ Create "flying card" animations (Bolt handles this)
- ❌ Use Auto Layout for motion paths (code will calculate)
- ❌ Duplicate inventory cards for animation (code will clone)

### Component Naming Convention:

```
InventoryTray/ScrollContainer
InventoryCard/Strain
GoLogo/Processor
BlendIngredientToken
BlendResultCard
```

---

## Data Contract

### Input (User Selection):
```typescript
blendId: number  // Which recommendation user chose
```

### Derived Data:
```typescript
ingredientCards: IngredientCard[] = [
  { 
    strain: 'Blue Dream', 
    color: '#14B8A6', 
    percentage: 50, 
    role: 'Driver',
    category: 'Hybrid' 
  },
  { 
    strain: 'Northern Lights', 
    color: '#10B981', 
    percentage: 30, 
    role: 'Modulator',
    category: 'Indica' 
  },
  { 
    strain: 'Blueberry', 
    color: '#D4AF37',  // Gold override (Anchor)
    percentage: 20, 
    role: 'Anchor',
    category: 'Indica' 
  },
]
```

**CRITICAL:** `ingredientCards.length` determines animation count. No more, no less.

---

## Testing Scenarios

### Scenario 1: Three-Component Blend
- STATE 1: 700ms
- STATE 2: (300 + 150) × 3 = 1350ms
- STATE 3: 500ms fade
- **Total:** ~2.5 seconds

### Scenario 2: Two-Component Blend
- STATE 1: 700ms
- STATE 2: (300 + 150) × 2 = 900ms
- STATE 3: 500ms fade
- **Total:** ~2.1 seconds

### Edge Cases:
- Single-component blend: Works (N=1)
- Five-component blend: Works (N=5, longer sequence)
- Same strain in multiple roles: Works (color consistent)

---

## Visual References

**Inventory Card (Highlighted):**
```
┌─────────────────────┐  ← 3px teal top border
│  HYBRID             │
│  Blue Dream         │  ← Readable text
│  Balanced euphoria  │
│                   ● │  ← 8px teal indicator dot
└─────────────────────┘
```

**Flying Card:**
```
    ╭───────────────╮
    │  Blue Dream   │  ← Readable during flight
    │   DRIVER      │  ← Teal role label
    ╰───────────────╯
         ◉ Glow trail
```

**Result Card Component List:**
```
● Blue Dream       Driver      50%  ← Teal dot
● Northern Lights  Modulator   30%  ← Emerald dot
● Blueberry        Anchor      20%  ← Gold dot
```

---

## End of Contract

This is a complete, deterministic specification. No interpolation required.
