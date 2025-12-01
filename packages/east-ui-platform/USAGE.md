# East UI Platform Usage Guide

Usage guide for East UI Platform functions.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Platform Functions](#platform-functions)
  - [State Management](#state-management)
- [Integration with East UI Components](#integration-with-east-ui-components)
- [Error Handling](#error-handling)

---

## Quick Start

```typescript
import { East, StringType, IntegerType, BlobType, DictType, NullType } from "@elaraai/east";
import { State } from "@elaraai/east-ui-platform";
import { UIComponentType, Text } from "@elaraai/east-ui";

// Define East function using State platform functions
const counter = East.function(
    [['state', DictType(StringType, BlobType)]],
    UIComponentType,
    ($, state) => {
        // Read current count from state
        const countBlob = state.get("count");
        const count = countBlob.decodeBeast(IntegerType);

        // Write incremented count back to state
        $(State.write("count", East.Blob.encodeBeast(count.add(1n))));

        // Return UI component
        return Text.Root(East.str`Count: ${count}`);
    }
);
```

---

## Platform Functions

### State Management

**Import:**
```typescript
import { State } from "@elaraai/east-ui-platform";
```

**Functions:**
| Signature | Description | Example |
|-----------|-------------|---------|
| `State.write(key: StringExpr, value: BlobExpr): NullExpr` | Write Beast2-encoded value to state | `State.write("count", encodedBlob)` |
| `State.read(key: StringExpr): BlobExpr` | Read Beast2-encoded value from state | `State.read("count")` |

**Also available as individual exports:**
```typescript
import { state_write, state_read } from "@elaraai/east-ui-platform";
```

**Example - Counter with State:**
```typescript
import { East, StringType, IntegerType, BlobType, DictType } from "@elaraai/east";
import { State } from "@elaraai/east-ui-platform";
import { UIComponentType, Stack, Text, Button } from "@elaraai/east-ui";

const counterApp = East.function(
    [['state', DictType(StringType, BlobType)]],
    UIComponentType,
    ($, state) => {
        // Read current count (defaults to 0 if not set)
        const countBlob = state.get("count");
        const count = $.let(
            countBlob.length().equal(0n).ifElse(
                0n,
                countBlob.decodeBeast(IntegerType)
            )
        );

        return Stack.Root([
            Text.Root(East.str`Count: ${count}`),
            Button.Root("Increment", {
                // Note: Actual increment logic is handled by event handlers
                // in the React implementation
            }),
        ], { direction: "column", gap: "4" });
    }
);
```

**Example - Reading and Writing Multiple Keys:**
```typescript
const multiStateExample = East.function(
    [['state', DictType(StringType, BlobType)]],
    UIComponentType,
    ($, state) => {
        // Read multiple values
        const nameBlob = state.get("name");
        const name = nameBlob.decodeBeast(StringType);

        const ageBlob = state.get("age");
        const age = ageBlob.decodeBeast(IntegerType);

        // Write updated values
        $(State.write("lastAccess", East.Blob.encodeBeast(Time.now())));

        return Text.Root(East.str`${name} is ${age} years old`);
    }
);
```

---

## Integration with East UI Components

The platform functions defined in this package are implemented by the React store
in `@elaraai/east-ui-components`. Here's how to use them together:

```typescript
import { East, DictType, StringType, BlobType, IntegerType } from "@elaraai/east";
import { State } from "@elaraai/east-ui-platform";
import { UIComponentType, Text } from "@elaraai/east-ui";
import { createEastStore, EastStoreProvider, EastFunction } from "@elaraai/east-ui-components";

// 1. Define your East function using State platform functions
const counterDisplay = East.function(
    [['state', DictType(StringType, BlobType)]],
    UIComponentType,
    ($, state) => {
        const countBlob = state.get("count");
        const count = countBlob.decodeBeast(IntegerType);
        return Text.Root(East.str`Count: ${count}`);
    }
);

// 2. Create the store (provides State.read/write implementations)
const store = createEastStore();

// 3. Register your function
store.register("counterDisplay", counterDisplay.toIR());

// 4. Use in React
function App() {
    return (
        <EastStoreProvider store={store}>
            <EastFunction name="counterDisplay" />
        </EastStoreProvider>
    );
}
```

---

## State Encoding

State values are stored as Beast2-encoded blobs. Use East's blob encoding functions:

**Encoding values:**
```typescript
// Encode different types
const intBlob = East.Blob.encodeBeast(42n);           // Integer
const strBlob = East.Blob.encodeBeast("hello");       // String
const boolBlob = East.Blob.encodeBeast(true);         // Boolean
const floatBlob = East.Blob.encodeBeast(3.14);        // Float

// Write to state
$(State.write("myInt", intBlob));
$(State.write("myStr", strBlob));
```

**Decoding values:**
```typescript
// Read from state
const intBlob = state.get("myInt");
const strBlob = state.get("myStr");

// Decode with explicit type
const myInt = intBlob.decodeBeast(IntegerType);
const myStr = strBlob.decodeBeast(StringType);
```

**Handling missing keys:**
```typescript
const blob = state.get("maybeExists");

// Check if blob is empty (key doesn't exist)
const value = blob.length().equal(0n).ifElse(
    defaultValue,
    blob.decodeBeast(ExpectedType)
);
```

---

## Error Handling

Platform function errors are thrown as `EastError`:

```typescript
import { EastError } from "@elaraai/east/internal";

try {
    // Execute compiled function
    await compiledFunction();
} catch (err) {
    if (err instanceof EastError) {
        console.error(`East error at ${err.location.filename}:${err.location.line}`);
        console.error(err.message);
    }
}
```

**Common error patterns:**
- Invalid key: Non-string key provided
- Encoding errors: Value cannot be Beast2-encoded
- Decoding errors: Blob doesn't match expected type

---

## License

Dual-licensed under AGPL-3.0 (open source) and commercial license. See [LICENSE.md](LICENSE.md).
