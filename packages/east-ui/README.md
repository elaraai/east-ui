# East UI

> UI component definitions for the East language

[![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE.md)
[![Node Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)

**East UI** provides typed UI component definitions for the [East language](https://github.com/elaraai/East). Components return data structures describing UI layouts rather than rendering directly, enabling portability across different rendering environments.

## Features

- **📦 Layout Components** - Box, Stack, Grid, Splitter, Separator
- **📝 Typography** - Text, Code, Heading, Link, Highlight, Mark, List, CodeBlock
- **🔘 Buttons** - Button, IconButton with variants and states
- **📋 Forms** - Field, Input, Select, Checkbox, Switch, Slider, Textarea, TagsInput, FileUpload
- **📊 Collections** - Table, Gantt, DataList, TreeView
- **📈 Charts** - Area, Bar, Line, Pie, Radar, Scatter, Sparkline, BarList, BarSegment
- **💬 Feedback** - Alert, Progress
- **🏷️ Display** - Badge, Tag, Avatar, Stat, Icon
- **📂 Disclosure** - Accordion, Tabs, Carousel
- **🪟 Overlays** - Dialog, Drawer, Popover, Tooltip, Menu, HoverCard, ToggleTip, ActionBar
- **🎨 Styling** - Type-safe style variants (FontWeight, TextAlign, ColorScheme, Size, etc.)
- **🔄 State Management** - Platform functions for state read/write

## Installation

```bash
npm install @elaraai/east-ui @elaraai/east
```

## Quick Start

```typescript
import { East, ArrayType } from "@elaraai/east";
import { Stack, Text, Button, UIComponentType } from "@elaraai/east-ui";

// Define a UI component
const MyComponent = East.function(
    [],
    UIComponentType,
    $ => {
        return Stack.Root([
            Text.Root("Hello, World!", { fontSize: "xl", fontWeight: "bold" }),
            Button.Root("Click Me", { variant: "solid", colorPalette: "blue" }),
        ], { gap: "4", direction: "column" });
    }
);

// Convert to IR for serialization or rendering
const ir = MyComponent.toIR();
```

## Component Categories

| Category | Components | Description |
|----------|------------|-------------|
| **Layout** | `Box`, `Stack`, `Grid`, `Splitter`, `Separator` | Container and layout components |
| **Typography** | `Text`, `Code`, `Heading`, `Link`, `Highlight`, `Mark`, `List`, `CodeBlock` | Text and typography components |
| **Buttons** | `Button`, `IconButton` | Interactive button components |
| **Forms** | `Input`, `Select`, `Checkbox`, `Switch`, `Slider`, `Textarea`, `TagsInput`, `FileUpload`, `Field` | Form input components |
| **Collections** | `Table`, `Gantt`, `DataList`, `TreeView` | Data display components |
| **Charts** | `Chart.Area`, `Chart.Bar`, `Chart.Line`, `Chart.Pie`, `Chart.Radar`, `Chart.Scatter`, `Chart.BarList`, `Chart.BarSegment`, `Sparkline` | Data visualization |
| **Display** | `Badge`, `Tag`, `Avatar`, `Stat`, `Icon` | Visual display components |
| **Feedback** | `Alert`, `Progress` | User feedback components |
| **Disclosure** | `Accordion`, `Tabs`, `Carousel` | Content organization |
| **Overlays** | `Dialog`, `Drawer`, `Popover`, `Tooltip`, `Menu`, `HoverCard`, `ToggleTip`, `ActionBar` | Overlay components |
| **Container** | `Card` | Content container |

## Documentation

- **[USAGE.md](USAGE.md)** - Comprehensive guide with examples for all components
- **[East Documentation](https://github.com/elaraai/East)** - Core East language documentation

## Design Philosophy

East UI components are **declarative data structures**, not rendered elements:

1. **Portability** - UI definitions can be serialized and rendered in any environment
2. **Type Safety** - Full compile-time checking of component structure and styling
3. **Composability** - Components are East functions that return typed values
4. **Separation of Concerns** - UI logic (East UI) is separate from rendering (@elaraai/east-ui-components)

## Development

```bash
npm run build     # Compile TypeScript
npm run test      # Run test suite (requires build)
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
