# East UI Components

> React rendering components for East UI

[![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE.md)
[![Node Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)

**East UI Components** provides React components that render [East UI](https://www.npmjs.com/package/@elaraai/east-ui) data structures. It bridges the gap between East UI's declarative component definitions and interactive React applications using [Chakra UI v3](https://chakra-ui.com/).

## Features

- **🎨 Chakra UI v3** - Modern, accessible component rendering
- **📦 All East UI Components** - Full support for layout, forms, charts, overlays, and more
- **🔄 State Management** - React hooks for East state operations
- **📊 Recharts Integration** - Charts rendered using Recharts library
- **🎯 Type-Safe** - Full TypeScript support

## Installation

```bash
npm install @elaraai/east-ui-components @elaraai/east-ui @elaraai/east
```

## Quick Start

```tsx
import React from "react";
import { Provider } from "@chakra-ui/react";
import { East } from "@elaraai/east";
import { Stack, Text, Button, UIComponentType } from "@elaraai/east-ui";
import { EastUIComponent, system } from "@elaraai/east-ui-components";

// Define your East UI component
const MyUI = East.function([], UIComponentType, $ => {
    return Stack.Root([
        Text.Root("Hello from East UI!", { fontSize: "xl" }),
        Button.Root("Click Me", { variant: "solid", colorPalette: "blue" }),
    ], { gap: "4" });
});

// Compile and get the UI IR
const compiled = East.compile(MyUI.toIR());
const uiData = compiled();

// Render in React
function App() {
    return (
        <Provider value={system}>
            <EastUIComponent ir={uiData} />
        </Provider>
    );
}
```

## State Management

East UI Components provides hooks for managing state in East applications:

```tsx
import { useEastStore, useEastState } from "@elaraai/east-ui-components";
import { State } from "@elaraai/east-ui";

// In your East function
const MyComponent = East.function([], UIComponentType, $ => {
    const count = $.let(State.read("counter", IntegerType, 0n));
    return Button.Root(
        East.str`Count: ${count}`,
        { onClick: State.write("counter", count.add(1n)) }
    );
});

// In your React app
function App() {
    const store = useEastStore();
    const [count] = useEastState(store, "counter", 0n);

    return (
        <Provider value={system}>
            <EastUIComponent ir={uiData} store={store} />
            <p>Current count: {count}</p>
        </Provider>
    );
}
```

## Supported Components

All East UI components are supported:

| Category | Components |
|----------|------------|
| **Layout** | Box, Stack, HStack, VStack, Grid, Splitter, Separator |
| **Typography** | Text |
| **Buttons** | Button, IconButton |
| **Forms** | Input (String, Integer, Float, DateTime), Select, Checkbox, Switch, Slider, Textarea, TagsInput, FileUpload, Field, Fieldset |
| **Collections** | Table, DataList, TreeView |
| **Charts** | Area, Bar, Line, Pie, Radar, Scatter, Sparkline, BarList, BarSegment |
| **Display** | Badge, Tag, Avatar, Stat, Icon |
| **Feedback** | Alert, Progress |
| **Disclosure** | Accordion, Tabs, Carousel |
| **Overlays** | Dialog, Drawer, Popover, Tooltip, Menu, HoverCard, ToggleTip, ActionBar |
| **Container** | Card |

## Development

```bash
npm run build     # Build library
npm run dev       # Start development server
npm run lint      # Check code quality
```

## License

Dual-licensed:
- **Open Source**: [AGPL-3.0](LICENSE.md) - Free for open source use
- **Commercial**: Available for proprietary use - contact support@elara.ai

## Links

- **Website**: [https://elaraai.com/](https://elaraai.com/)
- **East UI**: [https://www.npmjs.com/package/@elaraai/east-ui](https://www.npmjs.com/package/@elaraai/east-ui)
- **East Repository**: [https://github.com/elaraai/East](https://github.com/elaraai/East)
- **Issues**: [https://github.com/elaraai/east-ui/issues](https://github.com/elaraai/east-ui/issues)
- **Email**: support@elara.ai

---

*Developed by [Elara AI Pty Ltd](https://elaraai.com/) - Powering the computational layer of AI-driven business optimization.*
