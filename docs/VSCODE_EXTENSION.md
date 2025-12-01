# East UI VSCode Extension Design Document

## Overview

A VSCode extension that provides live preview of East UI components. Developers can edit TypeScript files containing East function definitions and see the rendered UI update in real-time. Also supports pre-compiled IR files for production use.

## Purpose

- **Live Preview**: Visualize East UI components without running a full application
- **Rapid Iteration**: Edit TypeScript code and see changes instantly (watch mode)
- **Full IntelliSense**: Leverage VSCode's TypeScript support while previewing
- **Flexible Input**: Supports both TypeScript source files and pre-compiled IR

## Supported File Types

| Extension | Description | Compilation |
|-----------|-------------|-------------|
| `.ts` | TypeScript source with East function | Bundled with esbuild, executed to extract IR |
| `.beast` | Beast2 binary serialized IR | Parsed directly |
| `.east` | Beast2 binary serialized IR (alias) | Parsed directly |
| `.json` | JSON serialized IR | Parsed directly |

## TypeScript File Convention

For `.ts` files, the extension expects a **default export** of an East function that returns `UIComponentType`:

```typescript
// my-component.ts
import { East, Text, Button, Stack, UIComponentType } from '@elaraai/east-ui';
import { DictType, StringType, BlobType, IntegerType } from '@elaraai/east';

export default East.function(
    [DictType(StringType, BlobType)],  // Input: state map
    UIComponentType,                     // Output: UI component
    ($, state) => {
        const count = state.get("count")?.decodeBeast(IntegerType) ?? 0n;

        return Stack.Root([
            Text.Root(East.str`Count: ${count}`),
            Button.Root("Increment", {
                onClick: () => state.write("count", (count + 1n).encodeBeast())
            })
        ], { gap: "4" });
    }
);
```

The extension automatically:
1. Bundles the file with all imports resolved
2. Executes to get the function
3. Calls `.toIR()` internally
4. Validates the return type is `UIComponentType`
5. Renders in the preview panel

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     VSCode Extension Host                        │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Extension Core                           │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │ │
│  │  │   Command    │  │  File Loader │  │  Type Validator │  │ │
│  │  │   Handler    │  │              │  │                 │  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────────┘  │ │
│  │                           │                                 │ │
│  │         ┌─────────────────┼─────────────────┐              │ │
│  │         ▼                 ▼                 ▼              │ │
│  │  ┌────────────┐    ┌────────────┐    ┌────────────┐       │ │
│  │  │ IR Parser  │    │  esbuild   │    │   File     │       │ │
│  │  │ (beast/json)│   │  Bundler   │    │  Watcher   │       │ │
│  │  └────────────┘    └────────────┘    └────────────┘       │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     Webview Panel                           │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │  React App (bundled)                                  │  │ │
│  │  │  ┌────────────────────────────────────────────────┐  │  │ │
│  │  │  │  Toolbar (Elara Logo, Filename, Status)        │  │  │ │
│  │  │  ├────────────────────────────────────────────────┤  │  │ │
│  │  │  │  EastStoreProvider                             │  │  │ │
│  │  │  │    └─ EastFunction (renders IR)                │  │  │ │
│  │  │  │         └─ EastChakraComponent                 │  │  │ │
│  │  │  └────────────────────────────────────────────────┘  │  │ │
│  │  └──────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Package Structure

```
packages/east-ui-extension/
├── package.json              # VSCode extension manifest
├── tsconfig.json
├── eslint.config.js
├── .nvmrc                    # Node 22
├── .vscodeignore             # Files to exclude from VSIX
├── CHANGELOG.md
├── README.md
│
├── src/
│   ├── extension.ts          # Extension entry point, command registration
│   ├── commands/
│   │   └── openPreview.ts    # Command handler for opening preview
│   ├── loader/
│   │   ├── index.ts          # Unified loader interface
│   │   ├── irLoader.ts       # Load .beast, .east, .json files
│   │   ├── tsLoader.ts       # Bundle and execute .ts files
│   │   └── validator.ts      # Validate function returns UIComponentType
│   ├── watcher/
│   │   └── fileWatcher.ts    # Watch .ts files for changes
│   ├── webview/
│   │   ├── panel.ts          # Create and manage webview panel
│   │   └── html.ts           # Generate webview HTML
│   └── types.ts              # Shared type definitions
│
├── webview/                   # React app for webview (separate build)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx          # React entry point
│       ├── App.tsx           # Main app with toolbar and renderer
│       ├── components/
│       │   ├── Toolbar.tsx   # Top toolbar with logo and status
│       │   ├── Renderer.tsx  # EastFunction wrapper with error boundary
│       │   └── ErrorDisplay.tsx  # Error message display
│       └── assets/
│           ├── elara-logo.svg
│           └── favicon.ico
│
├── dist/                      # Compiled extension
│   ├── extension.js
│   └── webview/
│       └── index.js          # Bundled React app
│
└── test/
    ├── extension.test.ts
    └── fixtures/
        ├── valid-component.ts
        ├── valid-ui.beast
        ├── valid-ui.json
        └── invalid-type.ts
```

## Dependencies

### Extension (src/)

```json
{
  "dependencies": {
    "@elaraai/east": "workspace:*",
    "@elaraai/east-ui": "workspace:*",
    "esbuild": "^0.24.0"
  },
  "devDependencies": {
    "@types/vscode": "^1.85.0",
    "@vscode/vsce": "^2.22.0",
    "typescript": "^5.7.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint": "^9.0.0"
  }
}
```

### Webview (webview/)

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@chakra-ui/react": "^3.0.0",
    "@elaraai/east": "workspace:*",
    "@elaraai/east-ui": "workspace:*",
    "@elaraai/east-ui-components": "workspace:*",
    "@elaraai/east-ui-platform": "workspace:*"
  }
}
```

## Core Components

### 1. Extension Entry Point (`src/extension.ts`)

```typescript
import * as vscode from 'vscode';
import { openPreviewCommand } from './commands/openPreview';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'east-ui.openPreview',
        () => openPreviewCommand(context)
    );
    context.subscriptions.push(disposable);
}

export function deactivate() {}
```

### 2. Command Handler (`src/commands/openPreview.ts`)

```typescript
import * as vscode from 'vscode';
import { IRType, toJSONFor } from '@elaraai/east';
import { loadFile } from '../loader';
import { createPreviewPanel } from '../webview/panel';
import { createFileWatcher } from '../watcher/fileWatcher';

// Use East's proper JSON serializer for IR (handles BigInt, Date, Uint8Array, etc.)
const serializeIR = toJSONFor(IRType);

export async function openPreviewCommand(context: vscode.ExtensionContext) {
    // Step 1: Ask user to select a file
    const fileUri = await vscode.window.showOpenDialog({
        canSelectMany: false,
        filters: {
            'East UI Files': ['ts', 'beast', 'east', 'json']
        },
        title: 'Select East UI Component File'
    });

    if (!fileUri || fileUri.length === 0) {
        return;
    }

    const filePath = fileUri[0].fsPath;

    try {
        // Step 2: Load the file (handles both .ts and IR files)
        const { ir, isTypeScript } = await loadFile(filePath);

        // Step 3: Open the preview panel
        const panel = createPreviewPanel(context, filePath, ir);

        // Step 4: Set up file watcher for .ts files
        if (isTypeScript) {
            const watcher = createFileWatcher(filePath, async () => {
                try {
                    const { ir: newIR } = await loadFile(filePath);
                    // Serialize IR before sending to webview
                    panel.webview.postMessage({ type: 'update', irJson: serializeIR(newIR) });
                } catch (error) {
                    panel.webview.postMessage({
                        type: 'error',
                        message: error instanceof Error ? error.message : String(error)
                    });
                }
            });

            // Clean up watcher when panel is closed
            panel.onDidDispose(() => watcher.dispose());
        }

    } catch (error) {
        vscode.window.showErrorMessage(
            `Failed to load East UI component: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}
```

### 3. Unified Loader (`src/loader/index.ts`)

```typescript
import * as path from 'path';
import { loadIRFile } from './irLoader';
import { loadTypeScriptFile } from './tsLoader';
import { validateUIComponentFunction } from './validator';
import type { FunctionIR } from '@elaraai/east/internal';

export interface LoadResult {
    ir: FunctionIR;
    isTypeScript: boolean;
}

export async function loadFile(filePath: string): Promise<LoadResult> {
    const ext = path.extname(filePath).toLowerCase();

    let ir: FunctionIR;
    let isTypeScript = false;

    if (ext === '.ts') {
        ir = await loadTypeScriptFile(filePath);
        isTypeScript = true;
    } else if (ext === '.beast' || ext === '.east' || ext === '.json') {
        ir = await loadIRFile(filePath);
    } else {
        throw new Error(`Unsupported file type: ${ext}`);
    }

    // Validate the function returns UIComponentType
    validateUIComponentFunction(ir);

    return { ir, isTypeScript };
}
```

### 4. TypeScript Loader (`src/loader/tsLoader.ts`)

```typescript
import * as esbuild from 'esbuild';
import * as path from 'path';
import * as vm from 'vm';
import type { FunctionIR } from '@elaraai/east/internal';

export async function loadTypeScriptFile(filePath: string): Promise<FunctionIR> {
    // Bundle the TypeScript file with all dependencies
    const result = await esbuild.build({
        entryPoints: [filePath],
        bundle: true,
        write: false,
        format: 'cjs',
        platform: 'node',
        target: 'node22',
        // Externalize node built-ins but bundle everything else
        external: [],
        // Resolve workspace packages
        nodePaths: [path.resolve(__dirname, '../../node_modules')],
        // Source maps for better error messages
        sourcemap: 'inline',
    });

    if (result.errors.length > 0) {
        const errorMessages = result.errors.map(e => e.text).join('\n');
        throw new Error(`Failed to bundle TypeScript file:\n${errorMessages}`);
    }

    const bundledCode = result.outputFiles[0].text;

    // Execute the bundled code to get the exported function
    const module = { exports: {} as any };
    const context = vm.createContext({
        module,
        exports: module.exports,
        require: require,
        console,
        Buffer,
        process,
        __dirname: path.dirname(filePath),
        __filename: filePath,
    });

    try {
        vm.runInContext(bundledCode, context, {
            filename: filePath,
        });
    } catch (error) {
        throw new Error(
            `Failed to execute bundled code: ${error instanceof Error ? error.message : String(error)}`
        );
    }

    // Get the default export
    const defaultExport = module.exports.default ?? module.exports;

    if (!defaultExport) {
        throw new Error(
            `No default export found in ${path.basename(filePath)}.\n\n` +
            `Expected:\n` +
            `  export default East.function([...], UIComponentType, ($, ...) => { ... })`
        );
    }

    // Check if it has a toIR method (it's an East function)
    if (typeof defaultExport.toIR !== 'function') {
        throw new Error(
            `Default export is not an East function.\n\n` +
            `Expected:\n` +
            `  export default East.function([...], UIComponentType, ($, ...) => { ... })\n\n` +
            `Got: ${typeof defaultExport}`
        );
    }

    // Call toIR() to get the IR
    const ir = defaultExport.toIR();

    return ir as FunctionIR;
}
```

### 5. IR Loader (`src/loader/irLoader.ts`)

```typescript
import * as fs from 'fs/promises';
import * as path from 'path';
import { IRType, decodeBeast2For, fromJSONFor } from '@elaraai/east';
import type { FunctionIR } from '@elaraai/east/internal';

const decodeIRBeast2 = decodeBeast2For(IRType);
const decodeIRJSON = fromJSONFor(IRType);

export async function loadIRFile(filePath: string): Promise<FunctionIR> {
    const ext = path.extname(filePath).toLowerCase();
    const content = await fs.readFile(filePath);

    let ir: any;

    try {
        if (ext === '.beast' || ext === '.east') {
            ir = decodeIRBeast2(content);
        } else if (ext === '.json') {
            const json = JSON.parse(content.toString('utf-8'));
            ir = decodeIRJSON(json);
        } else {
            throw new Error(`Unsupported IR file extension: ${ext}`);
        }
    } catch (error) {
        throw new Error(
            `Failed to parse IR from ${path.basename(filePath)}: ` +
            `${error instanceof Error ? error.message : String(error)}`
        );
    }

    // Verify it's a Function IR
    if (!ir || ir.type !== 'Function') {
        throw new Error(
            `IR file must contain a Function, got: ${ir?.type ?? 'undefined'}`
        );
    }

    return ir as FunctionIR;
}
```

### 6. Type Validator (`src/loader/validator.ts`)

```typescript
import { UIComponentType } from '@elaraai/east-ui';
import { isTypeValueEqual, toEastTypeValue } from '@elaraai/east';
import type { FunctionIR } from '@elaraai/east/internal';

// Convert UIComponentType to EastTypeValue for comparison
const uiComponentTypeValue = toEastTypeValue(UIComponentType);

export function validateUIComponentFunction(ir: FunctionIR): void {
    const functionType = ir.value.type;

    // Function type should be: { inputs: [...], output: EastTypeValue, platforms: [...] }
    if (functionType.type !== 'Function') {
        throw new Error(
            `Expected a Function type, got: ${functionType.type}`
        );
    }

    const outputType = functionType.value.output;

    // Check if the output type equals UIComponentType
    if (!isTypeValueEqual(outputType, uiComponentTypeValue)) {
        throw new Error(
            `Function must return UIComponentType.\n\n` +
            `Your function's return type does not match UIComponentType.\n` +
            `Make sure your function is defined as:\n\n` +
            `  export default East.function(\n` +
            `      [...inputs],\n` +
            `      UIComponentType,  // <-- This must be UIComponentType\n` +
            `      ($, ...args) => { ... }\n` +
            `  )`
        );
    }
}
```

### 7. File Watcher (`src/watcher/fileWatcher.ts`)

```typescript
import * as vscode from 'vscode';
import * as path from 'path';

export function createFileWatcher(
    filePath: string,
    onChanged: () => Promise<void>
): vscode.Disposable {
    const watcher = vscode.workspace.createFileSystemWatcher(
        new vscode.RelativePattern(
            path.dirname(filePath),
            path.basename(filePath)
        )
    );

    // Debounce rapid changes
    let timeout: NodeJS.Timeout | null = null;
    const debouncedOnChanged = () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(async () => {
            await onChanged();
        }, 300);
    };

    watcher.onDidChange(debouncedOnChanged);

    return watcher;
}
```

### 8. Webview Panel (`src/webview/panel.ts`)

```typescript
import * as vscode from 'vscode';
import * as path from 'path';
import type { FunctionIR } from '@elaraai/east/internal';
import { generateWebviewHtml } from './html';

export function createPreviewPanel(
    context: vscode.ExtensionContext,
    filePath: string,
    ir: FunctionIR
): vscode.WebviewPanel {
    const fileName = path.basename(filePath);
    const isTypeScript = filePath.endsWith('.ts');

    const panel = vscode.window.createWebviewPanel(
        'eastUIPreview',
        `East UI: ${fileName}`,
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [
                vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview')
            ]
        }
    );

    // Set favicon
    panel.iconPath = vscode.Uri.joinPath(
        context.extensionUri, 'dist', 'webview', 'favicon.ico'
    );

    // Get URIs for webview resources
    const webviewUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview')
    );

    // Generate HTML with the IR embedded
    panel.webview.html = generateWebviewHtml(webviewUri, fileName, ir, isTypeScript);

    return panel;
}
```

### 9. Webview HTML Generator (`src/webview/html.ts`)

```typescript
import * as vscode from 'vscode';
import { IRType, toJSONFor } from '@elaraai/east';
import type { FunctionIR } from '@elaraai/east/internal';

// Use East's proper JSON serializer for IR (handles BigInt, Date, Uint8Array, etc.)
const serializeIR = toJSONFor(IRType);

export function generateWebviewHtml(
    webviewUri: vscode.Uri,
    fileName: string,
    ir: FunctionIR,
    isWatching: boolean
): string {
    // Serialize IR using East's JSON serializer (handles special types correctly)
    const irJson = JSON.stringify(serializeIR(ir));
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webviewUri} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webviewUri} data:; font-src ${webviewUri};">
    <title>East UI: ${escapeHtml(fileName)}</title>
    <link rel="icon" href="${webviewUri}/favicon.ico">
</head>
<body>
    <div id="root"></div>
    <script nonce="${nonce}">
        window.__EAST_IR_JSON__ = ${irJson};
        window.__EAST_FILENAME__ = ${JSON.stringify(fileName)};
        window.__EAST_WATCHING__ = ${isWatching};
    </script>
    <script nonce="${nonce}" src="${webviewUri}/index.js"></script>
</body>
</html>`;
}

function getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
```

### 10. Webview React App (`webview/src/App.tsx`)

```tsx
import { useState, useEffect, useMemo } from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { EastIR, IRType, fromJSONFor } from '@elaraai/east';
import {
    EastStoreProvider,
    EastFunction,
    createEastStore
} from '@elaraai/east-ui-components';
import { Toolbar } from './components/Toolbar';
import { ErrorDisplay } from './components/ErrorDisplay';

// Use East's proper JSON deserializer for IR (handles BigInt, Date, Uint8Array, etc.)
const deserializeIR = fromJSONFor(IRType);

declare global {
    interface Window {
        __EAST_IR_JSON__: any;  // Serialized IR (East JSON format)
        __EAST_FILENAME__: string;
        __EAST_WATCHING__: boolean;
    }
}

export function App() {
    // Deserialize the initial IR from East JSON format
    const [irJson, setIRJson] = useState(window.__EAST_IR_JSON__);
    const [error, setError] = useState<string | null>(null);
    const filename = window.__EAST_FILENAME__;
    const isWatching = window.__EAST_WATCHING__;

    // Deserialize IR when it changes
    const ir = useMemo(() => {
        try {
            return deserializeIR(irJson);
        } catch (e) {
            setError(`Failed to deserialize IR: ${e instanceof Error ? e.message : String(e)}`);
            return null;
        }
    }, [irJson]);

    // Listen for updates from extension
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            if (message.type === 'update') {
                setIRJson(message.irJson);  // Receive serialized IR
                setError(null);
            } else if (message.type === 'error') {
                setError(message.message);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Create store (with empty initial state) - recreate on IR change to reset state
    const store = useMemo(() => createEastStore(), [ir]);

    if (error || !ir) {
        return (
            <ChakraProvider value={defaultSystem}>
                <Toolbar filename={filename} isWatching={isWatching} hasError={true} />
                <ErrorDisplay message={error ?? 'Failed to load IR'} />
            </ChakraProvider>
        );
    }

    // Create EastIR wrapper
    const eastIR = new EastIR(ir);

    return (
        <ChakraProvider value={defaultSystem}>
            <Toolbar
                filename={filename}
                isWatching={isWatching}
                hasError={false}
            />
            <EastStoreProvider store={store}>
                <EastFunction ir={eastIR} />
            </EastStoreProvider>
        </ChakraProvider>
    );
}
```

### 11. Toolbar Component (`webview/src/components/Toolbar.tsx`)

```tsx
import { Box, Flex, Text, Badge } from '@chakra-ui/react';
import { ElaraLogo } from './ElaraLogo';

interface ToolbarProps {
    filename: string;
    isWatching: boolean;
    hasError: boolean;
}

export function Toolbar({ filename, isWatching, hasError }: ToolbarProps) {
    return (
        <Flex
            as="header"
            align="center"
            justify="space-between"
            px={4}
            py={2}
            bg="gray.900"
            color="white"
            borderBottom="1px solid"
            borderColor="gray.700"
        >
            <Flex align="center" gap={3}>
                <ElaraLogo height={8} />
                <Text fontSize="sm" fontWeight="medium">
                    East UI Preview
                </Text>
            </Flex>

            <Flex align="center" gap={3}>
                <Text fontSize="xs" color="gray.400">
                    {filename}
                </Text>
                {isWatching && (
                    <Badge
                        colorScheme={hasError ? "red" : "green"}
                        variant="subtle"
                        fontSize="xs"
                    >
                        {hasError ? "Error" : "Watching"}
                    </Badge>
                )}
            </Flex>
        </Flex>
    );
}
```

### 12. Error Display Component (`webview/src/components/ErrorDisplay.tsx`)

```tsx
import { Box, Text, Code } from '@chakra-ui/react';

interface ErrorDisplayProps {
    message: string;
}

export function ErrorDisplay({ message }: ErrorDisplayProps) {
    return (
        <Box p={6} bg="red.50" minH="calc(100vh - 48px)">
            <Text fontSize="lg" fontWeight="bold" color="red.600" mb={4}>
                Failed to render component
            </Text>
            <Code
                display="block"
                whiteSpace="pre-wrap"
                p={4}
                bg="red.100"
                color="red.800"
                borderRadius="md"
                fontSize="sm"
            >
                {message}
            </Code>
        </Box>
    );
}
```

## Extension Manifest (`package.json`)

```json
{
    "name": "east-ui-preview",
    "displayName": "East UI Preview",
    "description": "Live preview of East UI components from TypeScript or IR files",
    "version": "0.0.1",
    "publisher": "elaraai",
    "engines": {
        "vscode": "^1.85.0"
    },
    "categories": ["Visualization", "Other"],
    "keywords": ["east", "ui", "preview", "ir", "components", "typescript"],
    "icon": "assets/icon.png",
    "repository": {
        "type": "git",
        "url": "https://github.com/elaraai/east-ui"
    },
    "main": "./dist/extension.js",
    "contributes": {
        "commands": [
            {
                "command": "east-ui.openPreview",
                "title": "East UI: Open Preview",
                "category": "East UI"
            }
        ],
        "menus": {
            "explorer/context": [
                {
                    "command": "east-ui.openPreview",
                    "when": "resourceExtname == .beast || resourceExtname == .east || resourceExtname == .json || resourceExtname == .ts",
                    "group": "navigation"
                }
            ]
        }
    },
    "activationEvents": [
        "onCommand:east-ui.openPreview"
    ],
    "scripts": {
        "build": "npm run build:extension && npm run build:webview",
        "build:extension": "esbuild src/extension.ts --bundle --outfile=dist/extension.js --external:vscode --format=cjs --platform=node",
        "build:webview": "cd webview && npm run build",
        "watch": "npm run build:extension -- --watch",
        "package": "vsce package",
        "publish": "vsce publish",
        "test": "node --test dist/test/**/*.test.js",
        "lint": "eslint ."
    }
}
```

## User Workflow

### Opening a Preview

1. **Command Palette**: `Cmd+Shift+P` → "East UI: Open Preview"
2. **Right-click**: Right-click a `.ts`, `.beast`, `.east`, or `.json` file → "East UI: Open Preview"

### For TypeScript Files

1. Create a `.ts` file with a default export:
   ```typescript
   import { East, Text, UIComponentType } from '@elaraai/east-ui';
   import { DictType, StringType, BlobType } from '@elaraai/east';

   export default East.function(
       [DictType(StringType, BlobType)],
       UIComponentType,
       ($, state) => Text.Root("Hello, World!")
   );
   ```

2. Open the preview via command palette or right-click

3. Edit the file in VSCode - the preview updates automatically on save

4. The toolbar shows "Watching" status with green badge

### For IR Files

1. Have a pre-compiled `.beast`, `.east`, or `.json` file

2. Open the preview - it loads immediately (no watch mode)

### Error Handling

If there's an error (syntax error, type mismatch, etc.):
- The toolbar shows "Error" with red badge
- The preview area displays the error message
- Fix the error and save - preview updates automatically

## Build & Publish

```bash
# Install dependencies
cd packages/east-ui-extension
npm install
cd webview && npm install && cd ..

# Build extension
npm run build

# Package as .vsix
npm run package
# Creates: east-ui-preview-0.0.1.vsix

# Install locally for testing
code --install-extension east-ui-preview-0.0.1.vsix

# Publish to marketplace (requires authentication)
npm run publish
```

## Testing

```bash
# Run unit tests
npm test

# Test in VSCode
# Press F5 to launch Extension Development Host
```

## Security Considerations

1. **Content Security Policy**: Strict CSP prevents XSS in webview
2. **Nonce-based Scripts**: Only extension-provided scripts can execute
3. **Sandboxed Webview**: Limited access to VSCode APIs
4. **Code Execution**: User's TypeScript is executed in isolated VM context
5. **File Validation**: IR is validated before rendering

## Future Enhancements

1. **Import Watching**: Watch imported files, not just the main file
2. **State Persistence**: Preserve EastStore state across reloads
3. **State Inspector**: Debug panel showing current EastStore state
4. **Multiple Previews**: Support opening multiple files simultaneously
5. **Theme Sync**: Match VSCode color theme in preview
6. **Export**: Export rendered component as static HTML/image
7. **Breakpoints**: Debug East function execution
