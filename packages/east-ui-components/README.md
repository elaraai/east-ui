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
| **Typography** | Text, Code, Heading, Link, Highlight, Mark, List, CodeBlock |
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



### Ecosystem

- **[East Node](https://github.com/elaraai/east-node)**: Node.js platform functions for I/O, databases, and system operations. Connect East programs to filesystems, SQL/NoSQL databases, cloud storage, and network services.
  - [@elaraai/east-node-std](https://www.npmjs.com/package/@elaraai/east-node-std): Filesystem, console, HTTP fetch, crypto, random distributions, timestamps
  - [@elaraai/east-node-io](https://www.npmjs.com/package/@elaraai/east-node-io): SQLite, PostgreSQL, MySQL, MongoDB, S3, FTP, SFTP
  - [@elaraai/east-node-cli](https://www.npmjs.com/package/@elaraai/east-node-cli): CLI for running East IR programs in Node.js

- **[East Python](https://github.com/elaraai/east-py)**: Python runtime and platform functions for data science and machine learning. Execute East programs with access to optimization solvers, gradient boosting, neural networks, and model explainability.
  - [@elaraai/east-py-datascience](https://www.npmjs.com/package/@elaraai/east-py-datascience): TypeScript types for optimization, gradient boosting, neural networks, explainability

- **[East UI](https://github.com/elaraai/east-ui)**: East types and expressions for building dashboards and interactive layouts. Define UIs as data structures that render consistently across React, web, and other environments.
  - [@elaraai/east-ui](https://www.npmjs.com/package/@elaraai/east-ui): 50+ typed UI components for layouts, forms, charts, tables, dialogs
  - [@elaraai/east-ui-components](https://www.npmjs.com/package/@elaraai/east-ui-components): React renderer with Chakra UI styling

- **[e3 - East Execution Engine](https://github.com/elaraai/e3)**: Durable execution engine for running East pipelines at scale. Features Git-like content-addressable storage, automatic memoization, task queuing, and real-time monitoring.
  - [@elaraai/e3](https://www.npmjs.com/package/@elaraai/e3): SDK for authoring e3 packages with typed tasks and pipelines
  - [@elaraai/e3-core](https://www.npmjs.com/package/@elaraai/e3-core): Git-like object store, task queue, result caching
  - [@elaraai/e3-types](https://www.npmjs.com/package/@elaraai/e3-types): Shared type definitions for e3 packages
  - [@elaraai/e3-cli](https://www.npmjs.com/package/@elaraai/e3-cli): `e3 init`, `e3 run`, `e3 logs` commands for managing and monitoring tasks
  - [@elaraai/e3-api-client](https://www.npmjs.com/package/@elaraai/e3-api-client): HTTP client for remote e3 servers
  - [@elaraai/e3-api-server](https://www.npmjs.com/package/@elaraai/e3-api-server): REST API server for e3 repositories

## Links

- **Live Showcase**: [https://elaraai.github.io/east-ui/](https://elaraai.github.io/east-ui/)
- **Website**: [https://elaraai.com/](https://elaraai.com/)
- **East Repository**: [https://github.com/elaraai/East](https://github.com/elaraai/East)
- **Issues**: [https://github.com/elaraai/east-ui/issues](https://github.com/elaraai/east-ui/issues)
- **Email**: support@elara.ai

## About Elara

East is developed by [Elara AI Pty Ltd](https://elaraai.com/), an AI-powered platform that creates economic digital twins of businesses that optimize performance. Elara combines business objectives, decisions and data to help organizations make data-driven decisions across operations, purchasing, sales and customer engagement, and project and investment planning. East powers the computational layer of Elara solutions, enabling the expression of complex business logic and data in a simple, type-safe and portable language.

---

*Developed by [Elara AI Pty Ltd](https://elaraai.com/)*
