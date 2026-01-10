# Engine Architecture Invariants

## HARD CONSTRAINT: Exactly 3 Cultivars Required

The deterministic GO Line engine **must only accept and operate on exactly three cultivars**: Driver, Modulator, Anchor.

Two-cultivar blends are **NOT valid engine inputs** and must never be supported inside the engine or its adapters.

## ✅ Corrected Architecture

### Engine (`src/engine/calculator.ts`)

- ✅ **Requires exactly 3**: Engine entry point validates and throws if < 3 cultivars
- ✅ **Throws if not**: `calculateBlends()` throws `ENGINE_INVARIANT_VIOLATION` error if < 3 cultivars
- ✅ **No branching for 2**: All 2-cultivar logic removed (TWO_CULTIVAR_RATIOS, 2-cultivar generation)
- ✅ **No "fixing" inside engine**: Engine rejects invalid inputs, never compensates
- ✅ **Explicit invariant check**: Lines 591-600 throw with descriptive error message

### Adapter Layer (`src/engine/adapters.ts`)

- ✅ **Validates input**: `validateInventoryForEngine()` checks constraints before engine call
- ✅ **Normalizes UI → engine**: Adapters convert types, never change engine math
- ✅ **Never changes engine math**: Adapters are pure transformations
- ✅ **Never invents blend logic**: No compensation, only validation and rejection
- ✅ **Enforces rules**: Returns validation error messages, doesn't "fix" invalid states

### UI Layer (`src/pages/Calculator.tsx`)

- ✅ **Validates before engine call**: Uses `validateInventoryForEngine()` before calling engine
- ✅ **Handles thrown errors**: Catch block handles `ENGINE_INVARIANT_VIOLATION` errors
- ✅ **Rejects, doesn't compensate**: Shows error message to user, doesn't try to "fix"

## ❌ Removed/Prevented Anti-Patterns

- ❌ **NO** `if (cultivars.length === 2)` logic inside engine
- ❌ **NO** `TWO_CULTIVAR_RATIOS` constant
- ❌ **NO** 2-cultivar blend generation code
- ❌ **NO** adapter logic that "handles" 2 as valid
- ❌ **NO** compensation logic that "fixes" invalid inputs
- ❌ **NO** silent failures or default fallbacks

## Invariant Enforcement Points

1. **Adapter Validation** (`validateInventoryForEngine`): Rejects < 3 before engine call
2. **Engine Entry Point** (`calculateBlends`): Throws if < 3 cultivars received
3. **Internal Generation** (`generateCandidates`): Internal check (defensive, should never trigger)
4. **Type Safety**: `BlendRecommendation` interface enforces exactly 3 with explicit roles

## Why This Matters

✅ **Confidence ranges are meaningful**: All blends have consistent structure
✅ **Driver/Modulator/Anchor has semantic meaning**: Roles are explicit and guaranteed
✅ **Future UI/LLM layers can trust outputs**: Predictable, deterministic structure
✅ **Debugging is clear**: Violations fail loudly with descriptive errors

## Verification

All invariants verified:
- [x] Engine throws on < 3 cultivars
- [x] No 2-cultivar logic in engine
- [x] Adapters validate, don't compensate
- [x] UI handles errors properly
- [x] Type system enforces exactly 3 components with explicit roles
