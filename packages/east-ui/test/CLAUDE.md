# East UI compliance tests

This test suite is self-hosted and runs on an East platform providing basic test functionality.
It exists separately to the unit tests in ../src for the purpose of testing both this and other East runtimes.

Each test can be serialized to IR and executed on any runtime providing the minimal test platform.
This acts as a compliance suite we can use to help implement East runtimes in other languages - for example those targetting fast, static compilation.

## Import methodology

**Tests import from the published package name, not relative paths.** This ensures tests exercise the same public API that external consumers use.

```ts
// ✅ CORRECT: Import from package names
import { describeEast, Assert, TestImpl } from "@elaraai/east-node-std";
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Button, Text, Stack, Reactive, State, UIComponentType } from "../../src/index.js";

// ❌ WRONG: Never use relative imports to ../src for east-node-std or east
import { describeEast, Assert } from "../src/test.js";
```

**Note:** East UI components are imported from `../../src/index.js` (relative) because `@elaraai/east-ui` package imports are not configured in tsconfig for the test directory.

Tests are run with `tsx` directly from TypeScript (not compiled to JS first). The `@elaraai/east-node-std` import resolves through the package's `dist/` output, so `npm run build` must be run before tests.

## Test platform

Tests use `TestImpl` which only provides `testPass` and `testFail` platform implementations. It does NOT include State or other UI platform implementations. This means:

- Examples that use `State.read`, `State.write`, `State.has` etc. will still compile and register as tests
- The State calls inside `Reactive.Root` are wrapped in a precompiled function body that is NOT executed during testing — only the outer function is evaluated
- The test verifies that the example compiles and produces valid East IR, not that the State interactions work at runtime

```ts
describeEast("Button", (test) => {
    // ...tests...
}, { platformFns: TestImpl });
```

## Examples system

Each spec file should have a companion `*.examples.ts` file (e.g. `button.spec.ts` → `button.examples.ts`). Examples serve two purposes: they are tested as part of the test suite, and they are extracted into a search index for AI agent context.

### Writing UI examples

**Imports**: Use `@elaraai/east` for East primitives and `../../src/index.js` for UI components:

```ts
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Button, Text, Stack, Stat, Reactive, State, UIComponentType } from "../../src/index.js";
```

**Structure**: Each example is an exported `const` using the `example()` helper:

```ts
export const buttonBasic = example({
    keywords: ["Button", "Root", "label", "basic", "create"],
    description: "Create a simple button with a text label",
    fn: East.function([], UIComponentType, ($) => {
        return Button.Root("Click me");
    }),
    inputs: [],
});
```

**Fields**:
- `keywords`: Component names, method names, style properties, concepts. Used for search indexing.
- `description`: Human-readable, used as the test name.
- `fn`: An `East.function()` call — the same thing users would write.
- `inputs`: Arguments to call `fn` with. Use `[]` for zero-arg functions.
- `returns`: **Omit for UI examples.** `UIComponentType` is a recursive variant type that cannot be represented as a plain JS literal. When `returns` is omitted, `Assert.examples` calls `$(ex.fn(...ex.inputs))` as a statement which works because `$()` accepts any `Expr` type.

### Rules for writing UI examples

1. **Always omit `returns` for UI component examples.** The `UIComponentType` recursive variant cannot have a JavaScript literal representation. The test framework will still evaluate the function and verify it compiles.

2. **Use `$.let` and `$.const` with explicit East type arguments:**
   ```ts
   const count = $.let(State.read([IntegerType], "counter"), IntegerType);  // good
   const count = $.let(State.read([IntegerType], "counter"));               // bad - missing type
   ```

3. **Use Reactive.Root for interactive examples.** `Reactive.Root` produces a server-side precompiled, client-executed function that re-renders when state dependencies change. This is best practice for real-world UI code:
   ```ts
   export const buttonReactiveCounter = example({
       keywords: ["Button", "onClick", "Reactive", "State", "counter"],
       description: "Reactive counter with increment/decrement buttons",
       fn: East.function([], UIComponentType, (_$) => {
           return Reactive.Root(East.function([], UIComponentType, $ => {
               // All State usage goes HERE, inside Reactive.Root
               $.if(State.has("counter").not(), $ => {
                   $(State.write([IntegerType], "counter", 0n));
               });
               const count = $.let(State.read([IntegerType], "counter"), IntegerType);
               // ... build and return UI
           }));
       }),
       inputs: [],
   });
   ```

4. **CRITICAL: All State/platform function usage MUST be inside `Reactive.Root`'s inner function body.** State functions (`State.read`, `State.write`, `State.has`) are marked `optional: true`, which causes any function that uses them to become async. If State calls appear in the outer example `fn` body, the function becomes an `AsyncFunction` and the test analyzer fails with:
   ```
   AsyncFunction body returns type UIComponentType
   ```
   The fix is to ensure the outer `fn` only calls `Reactive.Root(...)` and all State usage is inside the inner `East.function`:
   ```ts
   // ✅ CORRECT: State inside Reactive.Root
   fn: East.function([], UIComponentType, (_$) => {
       return Reactive.Root(East.function([], UIComponentType, $ => {
           const count = $.let(State.read([IntegerType], "counter"), IntegerType);
           // ...
       }));
   }),

   // ❌ WRONG: State in outer fn body — causes async promotion error
   fn: East.function([], UIComponentType, ($) => {
       $.if(State.has("counter").not(), $ => {
           $(State.write([IntegerType], "counter", 0n));
       });
       const count = $.let(State.read([IntegerType], "counter"), IntegerType);
       return Reactive.Root(East.function([], UIComponentType, $ => {
           // ...
       }));
   }),
   ```

5. **Store function closures in `$.const()` or `$.let()`.** Callback functions (e.g., onClick handlers) must be stored in East block variables, not bare JavaScript `const`:
   ```ts
   // ✅ CORRECT: Callback stored in $.const
   const increment = $.const(East.function([], NullType, $ => {
       const current = $.let(State.read([IntegerType], "counter"), IntegerType);
       $(State.write([IntegerType], "counter", current.add(1n)));
   }));
   Button.Root("+", { onClick: increment });

   // ❌ WRONG: Bare const — not tracked by East block builder
   const increment = East.function([], NullType, $ => { ... });
   ```

6. **One example per concept.** Cover each component API method or style property with a focused example. Don't combine unrelated operations.

7. **Include realistic use cases.** Examples are shown to AI agents as documentation. Make them practical — show common UI patterns like forms, data displays, interactive controls.

8. **Use string literals for style properties.** The `SubtypeExprOrValue` pattern allows string shorthand:
   ```ts
   Button.Root("Save", { variant: "solid", colorPalette: "blue", size: "md" });
   ```

### Wiring examples into spec files

In the spec file, import the examples and use `Assert.examples()` to register them as tests. **Use named keys, not the module object directly:**

```ts
import * as ex from "./button.examples.js";

describeEast("Button", (test) => {
    // ✅ CORRECT: Named keys for each example
    Assert.examples(test, {
        buttonBasic: ex.buttonBasic,
        buttonSolidVariant: ex.buttonSolidVariant,
        buttonDangerOutline: ex.buttonDangerOutline,
        buttonReactiveCounter: ex.buttonReactiveCounter,
    });

    // ... existing tests follow ...
}, { platformFns: TestImpl });
```

**Do NOT pass the module object directly:**
```ts
// ❌ WRONG
Assert.examples(test, ex);
```

Place `Assert.examples()` calls **before the related test section** so examples appear grouped with their corresponding tests.

### How `Assert.examples()` works

Defined in `platforms.spec.ts` on the `assertEast` object. For each example:
- If `returns` is defined: calls `fn(...inputs)`, stores result in `$.let`, asserts `equal(result, returns)`
- If `returns` is undefined: calls `$(fn(...inputs))` as a statement (works for any return type including `UIComponentType`)

### Example patterns by component category

**Simple leaf component** (Button, Text, Badge, Tag, etc.):
```ts
export const badgeBasic = example({
    keywords: ["Badge", "Root", "label", "create"],
    description: "Create a simple badge",
    fn: East.function([], UIComponentType, ($) => {
        return Badge.Root("New");
    }),
    inputs: [],
});
```

**Container component** (Stack, Box, Card, Grid, etc.):
```ts
export const stackWithGap = example({
    keywords: ["Stack", "HStack", "gap", "layout"],
    description: "Create a horizontal stack with gap spacing",
    fn: East.function([], UIComponentType, ($) => {
        return Stack.HStack([
            Text.Root("Left"),
            Text.Root("Right"),
        ], { gap: "4" });
    }),
    inputs: [],
});
```

**Interactive component with Reactive.Root** (forms, buttons with callbacks):
```ts
export const checkboxReactive = example({
    keywords: ["Checkbox", "Reactive", "State", "onChange", "interactive"],
    description: "Reactive checkbox that tracks checked state",
    fn: East.function([], UIComponentType, (_$) => {
        return Reactive.Root(East.function([], UIComponentType, $ => {
            $.if(State.has("checked").not(), $ => {
                $(State.write([BooleanType], "checked", false));
            });
            const checked = $.let(State.read([BooleanType], "checked"), BooleanType);
            const toggle = $.const(East.function([], NullType, $ => {
                const current = $.let(State.read([BooleanType], "checked"), BooleanType);
                $(State.write([BooleanType], "checked", current.not()));
            }));
            return Checkbox.Root({ checked, onChange: toggle });
        }));
    }),
    inputs: [],
});
```

### Files that need examples

The following spec files need companion `*.examples.ts` files:

- `buttons/button.spec.ts` → `buttons/button.examples.ts` (done)
- `collections/data-list.spec.ts` → `collections/data-list.examples.ts`
- `container/card.spec.ts` → `container/card.examples.ts`
- `disclosure/accordion.spec.ts` → `disclosure/accordion.examples.ts`
- `display/avatar.spec.ts` → `display/avatar.examples.ts`
- `display/badge.spec.ts` → `display/badge.examples.ts`
- `display/stat.spec.ts` → `display/stat.examples.ts`
- `display/tag.spec.ts` → `display/tag.examples.ts`
- `feedback/alert.spec.ts` → `feedback/alert.examples.ts`
- `feedback/progress.spec.ts` → `feedback/progress.examples.ts`
- `forms/checkbox.spec.ts` → `forms/checkbox.examples.ts`
- `forms/input.spec.ts` → `forms/input.examples.ts`
- `forms/select.spec.ts` → `forms/select.examples.ts`
- `forms/slider.spec.ts` → `forms/slider.examples.ts`
- `forms/switch.spec.ts` → `forms/switch.examples.ts`
- `layout/box.spec.ts` → `layout/box.examples.ts`
- `layout/grid.spec.ts` → `layout/grid.examples.ts`
- `layout/separator.spec.ts` → `layout/separator.examples.ts`
- `layout/splitter.spec.ts` → `layout/splitter.examples.ts`
- `layout/stack.spec.ts` → `layout/stack.examples.ts`
- `typography/text.spec.ts` → `typography/text.examples.ts`
- `component.spec.ts` → `component.examples.ts`
- `style.spec.ts` → `style.examples.ts`

### Workflow for adding examples to a new spec file

1. Read the spec file thoroughly to understand every tested component API
2. Create the `*.examples.ts` file with `@elaraai/east` and `../../src/index.js` imports
3. For each component method/style, create an `example()` export — omit `returns` for UI examples
4. Include at least one `Reactive.Root` example per interactive component (buttons, forms, inputs)
5. In the spec file: add `import * as ex from "./<name>.examples.js";`
6. Add `Assert.examples(test, { key: ex.key, ... })` calls before each relevant test section
7. Run `npm run build && npm run test` to verify
