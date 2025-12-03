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

## Links

- **Live Showcase**: [https://elaraai.github.io/east-ui/](https://elaraai.github.io/east-ui/)
- **East UI**: [https://www.npmjs.com/package/@elaraai/east-ui](https://www.npmjs.com/package/@elaraai/east-ui)
- **Documentation**: [https://github.com/elaraai/east-ui](https://github.com/elaraai/east-ui)
- **Issues**: [https://github.com/elaraai/east-ui/issues](https://github.com/elaraai/east-ui/issues)

## License

Dual-licensed:
- **Open Source**: [AGPL-3.0](LICENSE.md) - Free for open source use
- **Commercial**: Available for proprietary use - contact support@elara.ai

---

*Developed by [Elara AI Pty Ltd](https://elaraai.com/)*
