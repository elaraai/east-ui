# East UI

> UI component library for the East language

[![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE.md)
[![Node Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)

**East UI** provides typed UI component definitions for the [East language](https://github.com/elaraai/East). Components return data structures describing UI layouts rather than rendering directly, enabling portability across different rendering environments.

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| [@elaraai/east-ui](packages/east-ui) | Core UI component definitions | [![npm](https://img.shields.io/npm/v/@elaraai/east-ui)](https://www.npmjs.com/package/@elaraai/east-ui) |
| [@elaraai/east-ui-components](packages/east-ui-components) | React rendering with Chakra UI | [![npm](https://img.shields.io/npm/v/@elaraai/east-ui-components)](https://www.npmjs.com/package/@elaraai/east-ui-components) |
| [east-ui-preview](packages/east-ui-extension) | VSCode extension for live preview | [Marketplace](https://marketplace.visualstudio.com/items?itemName=ElaraAI.east-ui-preview) |

## Features

- **Layout** - Box, Stack, Grid, Splitter, Separator
- **Typography** - Text, Code, Heading, Link, Highlight, Mark, List, CodeBlock
- **Buttons** - Button, IconButton with variants
- **Forms** - Input, Select, Checkbox, Switch, Slider, Textarea, TagsInput, FileUpload
- **Collections** - Table, DataList, TreeView
- **Charts** - Area, Bar, Line, Pie, Radar, Scatter, Sparkline, BarList, BarSegment
- **Display** - Badge, Tag, Avatar, Stat, Icon
- **Feedback** - Alert, Progress
- **Disclosure** - Accordion, Tabs, Carousel
- **Overlays** - Dialog, Drawer, Popover, Tooltip, Menu, HoverCard, ToggleTip, ActionBar

## Quick Start

```bash
npm install @elaraai/east-ui @elaraai/east
```

```typescript
import { East } from "@elaraai/east";
import { Stack, Text, Button, UIComponentType } from "@elaraai/east-ui";

const MyComponent = East.function([], UIComponentType, () => {
    return Stack.Root([
        Text.Root("Hello, World!", { fontSize: "xl", fontWeight: "bold" }),
        Button.Root("Click Me", { variant: "solid", colorPalette: "blue" }),
    ], { gap: "4" });
});
```

## Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test

# Run linter
npm run lint
```

## License

Dual-licensed:
- **Open Source**: [AGPL-3.0](LICENSE.md) - Free for open source use
- **Commercial**: Available for proprietary use - contact support@elara.ai

## Links

- **Live Showcase**: [https://elaraai.github.io/east-ui/](https://elaraai.github.io/east-ui/)
- **Website**: [https://elaraai.com/](https://elaraai.com/)
- **East Repository**: [https://github.com/elaraai/East](https://github.com/elaraai/East)
- **Issues**: [https://github.com/elaraai/east-ui/issues](https://github.com/elaraai/east-ui/issues)
- **Email**: support@elara.ai

---

*Developed by [Elara AI Pty Ltd](https://elaraai.com/) - Powering the computational layer of AI-driven business optimization.*
