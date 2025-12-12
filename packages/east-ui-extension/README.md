# East UI Preview

> Live preview of East UI components in VSCode

[![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE.md)

**East UI Preview** is a VSCode extension that provides live preview of [East UI](https://www.npmjs.com/package/@elaraai/east-ui) components. Edit TypeScript files containing East function definitions and see the rendered UI update in real-time.

## Features

- **Live Preview** - Visualize East UI components without running a full application
- **Watch Mode** - Edit TypeScript code and see changes instantly
- **Full IntelliSense** - Leverage VSCode's TypeScript support while previewing
- **Multiple Formats** - Supports TypeScript source files and pre-compiled IR

## Supported File Types

| Extension | Description |
|-----------|-------------|
| `.ts` | TypeScript source with East function (default export) |
| `.beast` | Beast2 binary serialized IR |
| `.east` | Beast2 binary serialized IR (alias) |
| `.json` | JSON serialized IR |

## Usage

1. Open a supported file (`.ts`, `.beast`, `.east`, or `.json`)
2. Right-click the file in the Explorer and select **"East UI: Open Preview"**
3. Or use the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and search for "East UI: Open Preview"

The preview panel opens beside your editor. For TypeScript files, changes are automatically detected and the preview updates.

## TypeScript File Convention

For `.ts` files, export a default East function that returns `UIComponentType`:

```typescript
/**
 * Typography Example
 * Open this file with the East UI Preview extension to see the rendered output.
 */
import { East } from "@elaraai/east";
import { UIComponentType, Text, Stack } from "@elaraai/east-ui";

export default East.function([], UIComponentType, () => {
    return Stack.Root([
        Text.Root("Hello World"),
        Text.Root("Bold Text", { fontWeight: "bold" }),
        Text.Root("Styled Text", {
            color: "white",
            background: "teal.500",
            fontSize: "lg",
        }),
    ], { gap: "4", direction: "column" });
});
```

See `packages/east-ui/examples/` for more complete examples.

## Requirements

- VSCode 1.85.0 or higher
- Node.js 22.0.0 or higher

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
