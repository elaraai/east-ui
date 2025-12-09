# Design: Reactive Component

## Overview

An explicit reactive boundary component that re-renders independently when its state dependencies change. Dependencies are **automatically detected at runtime** by tracking which keys are read during execution. The inner function must be a "free function" with no captures from parent scope.

## Problem Statement

Currently, all `EastFunction` components subscribe to the global store snapshot. When ANY key changes, ALL of them re-execute their East functions (~660ms+ for 24 components).

## Proposed Solution

Introduce `Reactive.Root(body)` that:
1. Takes a function body that returns `UIComponentType`
2. **Automatically detects state dependencies at runtime** (no explicit keys needed)
3. **Enforces no captures from parent scope** (free function)
4. Re-renders independently when only its dependencies change

## Usage

```typescript
return Stack.VStack([
    // This re-renders only when "counter" changes (auto-detected)
    Reactive.Root($ => {
        const count = $(State.readTyped("counter", IntegerType)());
        return Stat.Root("Counter", East.str`${count.unwrap('some')}`);
    }),

    // This re-renders when "user_123" changes (dynamic key works!)
    Reactive.Root($ => {
        const userId = $(State.readTyped("currentUser", StringType)());
        const userData = $(State.readTyped(East.str`user_${userId}`, UserType)());
        return Text.Root(userData.name);
    }),

    // This never re-renders from state changes (no state reads)
    Button.Root("Click", { onClick: incrementFn }),
]);
```

## Architecture

### Runtime Dependency Tracking

The key insight: we control the `state_read` platform function implementation. We can intercept reads and track which keys are accessed.

```
┌─────────────────────────────────────────────────────────┐
│ EastReactiveComponent                                   │
│                                                         │
│  1. Enable tracking mode                                │
│  2. Execute render function                             │
│  3. Collect tracked keys                                │
│  4. Disable tracking mode                               │
│  5. Subscribe to collected keys only                    │
│  6. On key change → re-execute from step 1              │
└─────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│ Platform Implementation (state_read)                    │
│                                                         │
│  if (trackingContext) {                                 │
│      trackingContext.add(key);  // Record dependency    │
│  }                                                      │
│  return store.read(key);                                │
└─────────────────────────────────────────────────────────┘
```

### East-UI Layer (`@elaraai/east-ui`)

#### 1. Add ReactiveComponent to UIComponentType

```typescript
// In component.ts
export const UIComponentType = RecursiveType(node => VariantType({
    // ... existing variants ...

    // New variant for reactive components
    ReactiveComponent: StructType({
        // The function to execute - FunctionType([], UIComponentType)
        render: FunctionType([], node),
        // No keys field - dependencies detected at runtime
    }),
}));
```

#### 2. Add Tracking Context to Platform

```typescript
// In platform/state.ts

/**
 * Tracking context for reactive dependency collection.
 * When set, state_read calls will record their keys here.
 */
let trackingContext: Set<string> | null = null;

/**
 * Enable dependency tracking. Returns the Set that will collect keys.
 */
export function enableTracking(): Set<string> {
    trackingContext = new Set();
    return trackingContext;
}

/**
 * Disable dependency tracking and return collected keys.
 */
export function disableTracking(): string[] {
    const keys = trackingContext ? [...trackingContext] : [];
    trackingContext = null;
    return keys;
}

/**
 * Check if tracking is currently enabled.
 */
export function isTracking(): boolean {
    return trackingContext !== null;
}

/**
 * Record a key access (called by state_read implementation).
 */
export function trackKey(key: string): void {
    if (trackingContext) {
        trackingContext.add(key);
    }
}
```

#### 3. Update state_read Implementation

```typescript
// In platform/index.ts - Implementation object

state_read: (key: string, type: EastTypeValue): Uint8Array | undefined => {
    // Track the key if in tracking mode
    trackKey(key);

    // Existing read logic
    return store.read(key);
},
```

#### 4. Create Reactive Builder

```typescript
// In reactive/index.ts
import { East, type BlockBuilder, type ExprType } from "@elaraai/east";
import { UIComponentType } from "../component.js";

/**
 * Creates a reactive component that re-renders independently.
 *
 * @remarks
 * The body function MUST be a free function - no captures from parent scope.
 * This is validated at IR creation time.
 *
 * Dependencies are automatically detected at runtime by tracking which
 * state keys are read during execution.
 *
 * @param body - Function body that returns UIComponentType
 * @returns ReactiveComponent variant
 *
 * @example
 * ```typescript
 * // Dependencies auto-detected: ["counter"]
 * Reactive.Root($ => {
 *     const count = $(State.readTyped("counter", IntegerType)());
 *     return Stat.Root("Counter", East.str`${count.unwrap('some')}`);
 * })
 *
 * // Dynamic keys work too - detected at runtime
 * Reactive.Root($ => {
 *     const key = $(State.readTyped("selectedKey", StringType)());
 *     const value = $(State.readTyped(key, IntegerType)());
 *     return Text.Root(East.str`${value}`);
 * })
 * ```
 */
export function Root(
    body: ($: BlockBuilder<typeof UIComponentType>) => ExprType<typeof UIComponentType>,
): ExprType<typeof UIComponentType> {
    // Create the inner function
    const renderFn = East.function([], UIComponentType, body);

    // Get the IR and validate no captures
    const ir = renderFn.toIR();
    if (ir.ir.value.captures.length > 0) {
        const captureNames = ir.ir.value.captures.map(c => c.value.name).join(", ");
        throw new Error(
            `Reactive.Root body must be a free function with no captures from parent scope. ` +
            `Found captures: [${captureNames}]. ` +
            `Move state reads inside the Reactive body or use State for shared data.`
        );
    }

    // Return the ReactiveComponent variant
    return East.value({
        type: "ReactiveComponent",
        value: {
            render: renderFn,
        }
    }, UIComponentType);
}

export const Reactive = { Root } as const;
```

### Analysis: Capture Validation

The IR already tracks captures via `FunctionIR.captures`:

```typescript
// From ir.ts
export type FunctionIR = variant<"Function", {
    type: EastTypeValue,
    location: LocationValue,
    captures: VariableIR[],  // <-- Variables captured from parent scope
    parameters: VariableIR[],
    body: any,
}>;
```

When `Reactive.Root` calls `.toIR()`, we can inspect `ir.value.captures` to ensure it's empty.

### What IS Allowed

1. **Platform functions** - `State.readTyped`, `State.writeTyped`, etc.
   - These are external, not captures

2. **Module-level constants** - Free functions defined outside
   - Not captures because they're in module scope, not function scope

3. **Callbacks defined inside** - `onClick: East.function([], NullType, ...)`
   - These are created inside the body, not captured

### What is NOT Allowed

1. **Parent scope variables**:
   ```typescript
   const multiplier = $(State.readTyped("multiplier", IntegerType)());

   Reactive.Root($ => {
       // ERROR: captures `multiplier` from parent scope
       return Text.Root(East.str`${count.multiply(multiplier)}`);
   })
   ```

2. **Parent refs/arrays**:
   ```typescript
   const items = $.let([]);

   Reactive.Root($ => {
       // ERROR: captures `items` from parent scope
       items.push(something);
       return Table.Root(...);
   })
   ```

### Solution for Shared Data

Use State instead of parent captures:

```typescript
// Instead of parent variable, read both inside:
Reactive.Root($ => {
    const multiplier = $(State.readTyped("multiplier", IntegerType)());
    const count = $(State.readTyped("counter", IntegerType)());
    return Text.Root(East.str`${count.multiply(multiplier)}`);
})
// Dependencies auto-detected: ["multiplier", "counter"]
```

### East-UI-Components Layer (`@elaraai/east-ui-components`)

#### 1. Handle ReactiveComponent in Renderer

```typescript
// In component.tsx
import { EastReactiveComponent } from "./reactive/index.js";

export const EastChakraComponent = memo(function EastChakraComponent({ value }) {
    const rendered = useMemo(() => {
        return match(value, {
            // ... existing cases ...

            ReactiveComponent: (v) => <EastReactiveComponent value={v} />,
        });
    }, [value]);

    return <>{rendered}</>;
}, (prev, next) => uiComponentEqual(prev.value, next.value));
```

#### 2. Create EastReactiveComponent

```typescript
// In reactive/index.tsx
import { useState, useRef, useMemo, useSyncExternalStore, useCallback } from "react";
import { State, enableTracking, disableTracking } from "@elaraai/east-ui";
import { EastChakraComponent } from "../component.js";
import type { ValueTypeOf } from "@elaraai/east";
import type { UIComponentType } from "@elaraai/east-ui";

interface ReactiveValue {
    render: () => ValueTypeOf<typeof UIComponentType>;
}

export function EastReactiveComponent({ value }: { value: ReactiveValue }) {
    const store = State.store;

    // Track dependencies across renders
    const depsRef = useRef<string[]>([]);

    // Execute render with dependency tracking
    const executeWithTracking = useCallback(() => {
        enableTracking();
        try {
            const result = value.render();
            depsRef.current = disableTracking();
            return result;
        } catch (e) {
            disableTracking();
            throw e;
        }
    }, [value.render]);

    // Subscribe to the keys we depend on
    const subscribe = useCallback((cb: () => void) => {
        // Subscribe to all current dependencies
        const unsubs = depsRef.current.map(key => store.subscribe(key, cb));
        return () => unsubs.forEach(fn => fn());
    }, [store]);

    // Snapshot based on our dependencies' versions
    const getSnapshot = useCallback(() => {
        return depsRef.current
            .map(k => `${k}:${store.getKeyVersion?.(k) ?? 0}`)
            .join(",");
    }, [store]);

    // Subscribe and get snapshot
    const snapshot = useSyncExternalStore(subscribe, getSnapshot);

    // Execute render function with tracking
    // Re-runs when snapshot changes (i.e., when dependencies change)
    const result = useMemo(() => executeWithTracking(), [executeWithTracking, snapshot]);

    if (result === undefined || result === null) {
        return null;
    }

    return <EastChakraComponent value={result} />;
}
```

### Store Changes

Add per-key versioning:

```typescript
// In store.ts
class UIStore {
    private keyVersions: Map<string, number> = new Map();

    write(key: string, value: Uint8Array | undefined): void {
        // ... existing logic ...

        // Increment key version
        const current = this.keyVersions.get(key) ?? 0;
        this.keyVersions.set(key, current + 1);
    }

    getKeyVersion(key: string): number {
        return this.keyVersions.get(key) ?? 0;
    }
}
```

## Handling Dynamic Dependencies

A key advantage of runtime tracking: dependencies can change between renders.

```typescript
Reactive.Root($ => {
    const showDetails = $(State.readTyped("showDetails", BooleanType)());

    if (showDetails.unwrap("some")) {
        // Only tracked when showDetails is true
        const details = $(State.readTyped("details", StringType)());
        return Text.Root(details);
    }

    return Text.Root("Click to show details");
})
```

- When `showDetails` is false: dependencies = `["showDetails"]`
- When `showDetails` is true: dependencies = `["showDetails", "details"]`

The component re-subscribes on each render, so dependencies stay in sync.

## Error Messages

Clear errors when captures are detected:

```
Error: Reactive.Root body must be a free function with no captures from parent scope.
Found captures: [multiplier, items].
Move state reads inside the Reactive body or use State for shared data.
```

## Trade-offs

### Pros
- **No key duplication** - Dependencies auto-detected
- **Dynamic keys work** - Computed keys detected at runtime
- **Conditional dependencies** - Only track what's actually read
- **Explicit boundaries** - Clear where reactive isolation happens
- **Enforced correctness** - Can't accidentally capture parent state

### Cons
- **Manual annotation** - User must add `Reactive.Root` explicitly
- **Restrictive** - Can't capture parent values (must use State)
- **Re-subscription overhead** - Re-subscribes on each render (minor)

## Files to Modify

### east-ui
- `src/component.ts` - Add ReactiveComponent variant
- `src/reactive/index.ts` (new) - Reactive.Root builder
- `src/reactive/types.ts` (new) - Type definitions
- `src/platform/state.ts` - Add tracking context
- `src/platform/index.ts` - Update state_read to track keys
- `src/index.ts` - Export Reactive and tracking functions

### east-ui-components
- `src/component.tsx` - Handle ReactiveComponent case
- `src/reactive/index.tsx` (new) - EastReactiveComponent

### east-ui (store)
- `src/platform/store.ts` - Add getKeyVersion()

## Test Cases

Exhaustive test cases for capture validation in `Reactive.Root`. Tests should be in `test/reactive.spec.ts`.

**Important**: There are two types of tests:
1. **Valid cases** - Use `describeEast`/`testEast` pattern (East code compiles and runs)
2. **Invalid cases** - Use Node.js `assert.throws` (error thrown during AST construction, before compilation)

### Test Case Summary

| # | Category | Test Name | Expected |
|---|----------|-----------|----------|
| 1 | Valid | Simple state read | No throw |
| 2 | Valid | Multiple state reads | No throw |
| 3 | Valid | Dynamic/computed key | No throw |
| 4 | Valid | No state reads (static) | No throw |
| 5 | Valid | Module-level constant | No throw |
| 6 | Valid | Module-level function | No throw |
| 7 | Valid | Callback defined inside | No throw |
| 8 | Valid | Nested Reactive.Root | No throw |
| 9 | Valid | State write in onClick | No throw |
| 10 | Valid | Conditional state read | No throw |
| 11 | Invalid | Capture parent $.let variable | Throws |
| 12 | Invalid | Capture parent state read result | Throws |
| 13 | Invalid | Capture multiple variables | Throws |
| 14 | Invalid | Capture in expression | Throws |
| 15 | Invalid | Capture parent parameter | Throws |
| 16 | Invalid | Capture from grandparent scope | Throws |
| 17 | Invalid | Capture array from parent | Throws |
| 18 | Invalid | Capture in string template | Throws |

### Valid Cases (Should NOT Throw)

Uses `describeEast` pattern - East code compiles and runs successfully.

```typescript
/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "./platforms.spec.js";
import { East, IntegerType, StringType, BooleanType, NullType, some } from "@elaraai/east";
import { Reactive, State, Button, Text, Stat, Stack } from "../src/index.js";

// Module-level constant (NOT a capture - in module scope)
const TITLE = "Counter";

describeEast("Reactive.Root - Valid Cases", (test) => {

    // =========================================================================
    // Basic State Reads
    // =========================================================================

    // Test 1: Simple state read
    test("creates reactive with simple state read", $ => {
        const reactive = $.let(Reactive.Root($ => {
            const count = $(State.readTyped("counter", IntegerType)());
            return Stat.Root("Counter", East.str`${count.unwrap("some")}`);
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

    // Test 2: Multiple state reads
    test("creates reactive with multiple state reads", $ => {
        const reactive = $.let(Reactive.Root($ => {
            const a = $(State.readTyped("keyA", IntegerType)());
            const b = $(State.readTyped("keyB", IntegerType)());
            const c = $(State.readTyped("keyC", StringType)());
            return Text.Root(East.str`${a.unwrap("some")} ${b.unwrap("some")} ${c.unwrap("some")}`);
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

    // Test 3: Dynamic/computed key
    test("creates reactive with dynamic computed key", $ => {
        const reactive = $.let(Reactive.Root($ => {
            const userId = $(State.readTyped("currentUser", StringType)());
            const userData = $(State.readTyped(
                East.str`user_${userId.unwrap("some")}`,
                StringType
            )());
            return Text.Root(userData.unwrap("some"));
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

    // =========================================================================
    // Static Content
    // =========================================================================

    // Test 4: No state reads (static content)
    test("creates reactive with static content (no state reads)", $ => {
        const reactive = $.let(Reactive.Root($ => {
            return Text.Root("Hello, World!");
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

    // =========================================================================
    // Module-Level References (Not Captures)
    // =========================================================================

    // Test 5: Module-level constant
    test("allows module-level constants (not captures)", $ => {
        const reactive = $.let(Reactive.Root($ => {
            const count = $(State.readTyped("counter", IntegerType)());
            // TITLE is module-level, not a capture
            return Stat.Root(TITLE, East.str`${count.unwrap("some")}`);
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

    // =========================================================================
    // Callbacks Defined Inside
    // =========================================================================

    // Test 7: Callback defined inside
    test("allows callbacks defined inside the body", $ => {
        const reactive = $.let(Reactive.Root($ => {
            const count = $(State.readTyped("counter", IntegerType)());
            return Button.Root(East.str`Count: ${count.unwrap("some")}`, {
                // This callback is defined inside, not captured
                onClick: East.function([], NullType, $ => {
                    const current = $(State.readTyped("counter", IntegerType)());
                    $(State.writeTyped("counter", some(current.unwrap("some").add(1n)), IntegerType)());
                })
            });
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

    // Test 9: State write in onClick
    test("allows state writes in onClick callbacks", $ => {
        const reactive = $.let(Reactive.Root($ => {
            return Button.Root("Increment", {
                onClick: East.function([], NullType, $ => {
                    const current = $(State.readTyped("counter", IntegerType)());
                    $(State.writeTyped("counter", some(current.unwrap("some").add(1n)), IntegerType)());
                })
            });
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

    // =========================================================================
    // Nested Reactive
    // =========================================================================

    // Test 8: Nested Reactive.Root
    test("allows nested Reactive.Root", $ => {
        const reactive = $.let(Reactive.Root($ => {
            return Stack.VStack([
                Text.Root("Header"),
                // Nested Reactive is fine - it's a new scope
                Reactive.Root($ => {
                    const count = $(State.readTyped("inner", IntegerType)());
                    return Text.Root(East.str`${count.unwrap("some")}`);
                }),
            ]);
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

    // =========================================================================
    // Conditional Logic
    // =========================================================================

    // Test 10: Conditional state read
    test("allows conditional state reads", $ => {
        const reactive = $.let(Reactive.Root($ => {
            const show = $(State.readTyped("showDetails", BooleanType)());
            return show.unwrap("some").match({
                true: () => {
                    const details = $(State.readTyped("details", StringType)());
                    return Text.Root(details.unwrap("some"));
                },
                false: () => Text.Root("Hidden"),
            });
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

});
```

### Invalid Cases (SHOULD Throw)

Uses Node.js `assert.throws` - errors are thrown during AST construction (when `Reactive.Root` is called), before any East compilation or execution.

```typescript
/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { East, IntegerType, StringType, ArrayType } from "@elaraai/east";
import { Reactive, State, Button, Text, Stat, UIComponentType } from "../src/index.js";

describe("Reactive.Root - Invalid Cases (Capture Validation)", () => {

    // =========================================================================
    // Parent Variable Captures
    // =========================================================================

    // Test 11: Capture parent $.let variable
    it("should throw when capturing parent $.let variable", () => {
        assert.throws(
            () => {
                East.function([], UIComponentType, $ => {
                    const multiplier = $.let(East.value(2n, IntegerType));

                    return Reactive.Root($ => {
                        const count = $(State.readTyped("counter", IntegerType)());
                        // ERROR: captures `multiplier` from parent scope
                        return Text.Root(East.str`${count.unwrap("some").multiply(multiplier)}`);
                    });
                });
            },
            {
                message: /Reactive\.Root body must be a free function.*captures.*multiplier/
            }
        );
    });

    // Test 12: Capture parent state read result
    it("should throw when capturing parent state read result", () => {
        assert.throws(
            () => {
                East.function([], UIComponentType, $ => {
                    const config = $(State.readTyped("config", StringType)());

                    return Reactive.Root($ => {
                        const count = $(State.readTyped("counter", IntegerType)());
                        // ERROR: captures `config` from parent scope
                        return Text.Root(East.str`${config.unwrap("some")}: ${count.unwrap("some")}`);
                    });
                });
            },
            {
                message: /Reactive\.Root body must be a free function.*captures.*config/
            }
        );
    });

    // Test 13: Capture multiple variables
    it("should throw when capturing multiple variables and list all in error", () => {
        assert.throws(
            () => {
                East.function([], UIComponentType, $ => {
                    const a = $.let(East.value(1n, IntegerType));
                    const b = $.let(East.value(2n, IntegerType));
                    const c = $.let(East.value(3n, IntegerType));

                    return Reactive.Root($ => {
                        // ERROR: captures `a`, `b`, `c` from parent scope
                        return Text.Root(East.str`${a.add(b).add(c)}`);
                    });
                });
            },
            {
                message: /Reactive\.Root body must be a free function.*captures/
            }
        );
    });

    // Test 14: Capture in expression
    it("should throw when capture is used in arithmetic expression", () => {
        assert.throws(
            () => {
                East.function([], UIComponentType, $ => {
                    const offset = $.let(East.value(100n, IntegerType));

                    return Reactive.Root($ => {
                        const count = $(State.readTyped("counter", IntegerType)());
                        // ERROR: captures `offset` in arithmetic expression
                        return Stat.Root("Adjusted", East.str`${count.unwrap("some").add(offset)}`);
                    });
                });
            },
            {
                message: /Reactive\.Root body must be a free function.*captures.*offset/
            }
        );
    });

    // =========================================================================
    // Parameter Captures
    // =========================================================================

    // Test 15: Capture parent parameter
    it("should throw when capturing parent function parameter", () => {
        assert.throws(
            () => {
                // Function with a parameter
                East.function([IntegerType], UIComponentType, ($, userId) => {
                    return Reactive.Root($ => {
                        // ERROR: captures `userId` parameter from parent function
                        return Text.Root(East.str`User: ${userId}`);
                    });
                });
            },
            {
                message: /Reactive\.Root body must be a free function.*captures/
            }
        );
    });

    // =========================================================================
    // Nested Scope Captures
    // =========================================================================

    // Test 16: Capture from grandparent scope
    it("should throw when capturing from grandparent scope", () => {
        assert.throws(
            () => {
                East.function([], UIComponentType, $ => {
                    const grandparentVar = $.let(East.value("outer", StringType));

                    // Nested function - grandparentVar is captured here first
                    const innerFn = East.function([], UIComponentType, $ => {
                        return Reactive.Root($ => {
                            // ERROR: captures `grandparentVar` (via innerFn's closure)
                            return Text.Root(grandparentVar);
                        });
                    });

                    return Button.Root("Test", { onClick: innerFn });
                });
            },
            {
                message: /Reactive\.Root body must be a free function.*captures/
            }
        );
    });

    // =========================================================================
    // Collection Captures
    // =========================================================================

    // Test 17: Capture array from parent
    it("should throw when capturing array from parent", () => {
        assert.throws(
            () => {
                East.function([], UIComponentType, $ => {
                    const items = $.let(East.value([], ArrayType(StringType)));

                    return Reactive.Root($ => {
                        // ERROR: captures `items` array from parent scope
                        return Text.Root(East.str`Count: ${items.length()}`);
                    });
                });
            },
            {
                message: /Reactive\.Root body must be a free function.*captures.*items/
            }
        );
    });

    // =========================================================================
    // String Template Captures
    // =========================================================================

    // Test 18: Capture in string template
    it("should throw when capture is used in string template", () => {
        assert.throws(
            () => {
                East.function([], UIComponentType, $ => {
                    const prefix = $.let(East.value("Value: ", StringType));

                    return Reactive.Root($ => {
                        const count = $(State.readTyped("counter", IntegerType)());
                        // ERROR: captures `prefix` in string template
                        return Text.Root(East.str`${prefix}${count.unwrap("some")}`);
                    });
                });
            },
            {
                message: /Reactive\.Root body must be a free function.*captures.*prefix/
            }
        );
    });

});
```

### Error Message Format

All invalid cases should produce errors matching this format:

```
Error: Reactive.Root body must be a free function with no captures from parent scope.
Found captures: [varName1, varName2, ...].
Move state reads inside the Reactive body or use State for shared data.
```

### Running Tests

```bash
# From east-ui package root
npm test -- --grep "Reactive.Root"

# Or run specific test file
npx vitest test/reactive.spec.ts
```

## Implementation Order

1. Add tracking context to east-ui platform (`enableTracking`, `disableTracking`, `trackKey`)
2. Update `state_read` implementation to call `trackKey`
3. Add `getKeyVersion()` to store
4. Create ReactiveComponent type in UIComponentType
5. Create Reactive.Root builder with capture validation
6. Create EastReactiveComponent renderer
7. Wire up in component.tsx
8. Add test cases for capture validation
9. Test with showcase
