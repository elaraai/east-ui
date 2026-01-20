# East UI Extension - E3 API Migration Plan

## Document Information
- **Date**: 2026-01-19
- **Version**: 1.2
- **Status**: Draft

---

## 1. Executive Summary

The `@elaraai/e3-api-server` package has undergone significant changes:

1. **Repository structure changed**: No more `.e3` subdirectory. An e3 repository is now any directory containing the required e3 structure (defined by e3, not the extension).

2. **ServerConfig API changed**: The `repo` parameter has been replaced with `singleRepoPath` / `reposDir`.

The `east-ui-extension` needs updates to remove `.e3` assumptions and use the new ServerConfig API.

---

## 2. Design Principle: Let E3 Define Errors

**The extension should NOT duplicate e3's repository validation logic.**

Instead of checking for specific directories, the extension should:
1. Attempt to start the server with the user-selected path
2. Let e3-api-server validate the repository
3. Catch and display any errors from e3

This approach ensures:
- Single source of truth (e3 defines what's valid)
- No sync issues if e3's requirements change
- Cleaner separation of concerns

---

## 3. Current State (Broken)

### 3.1 openPreview.ts

**File**: `src/commands/openPreview.ts`

```typescript
// CURRENT (BROKEN) - Extension duplicates validation and assumes .e3 directory
function isE3Repository(repoPath: string): boolean {
    const e3Dir = path.join(repoPath, '.e3');
    return fs.existsSync(e3Dir) && fs.statSync(e3Dir).isDirectory();
}

// Later...
const e3Path = path.join(repoPath, '.e3');  // ← Wrong: .e3 doesn't exist
const serverUrl = await startE3Server({ repo: e3Path, port });
```

### 3.2 e3Server.ts

**File**: `src/server/e3Server.ts`

```typescript
// CURRENT (BROKEN) - Using 'repo' parameter that doesn't exist in ServerConfig
serverInstance = createServer({
    repo: config.repo,        // ← This parameter no longer exists!
    port,
    host: 'localhost',
    cors: true,
});
```

---

## 4. Required Changes

### 4.1 Remove Client-Side Validation

**File**: `src/commands/openPreview.ts`

```diff
-/**
- * Validate that a path is an e3 repository.
- */
-function isE3Repository(repoPath: string): boolean {
-    const e3Dir = path.join(repoPath, '.e3');
-    return fs.existsSync(e3Dir) && fs.statSync(e3Dir).isDirectory();
-}
```

### 4.2 Remove Validation Check

**File**: `src/commands/openPreview.ts`

```diff
     const repoPath = folderUri[0].fsPath;

-    // Validate it's an e3 repository
-    if (!isE3Repository(repoPath)) {
-        vscode.window.showErrorMessage(
-            `"${repoPath}" is not a valid e3 repository (missing .e3 directory)`
-        );
-        return;
-    }
-
     // Save the path for next time
```

### 4.3 Pass Repository Path Directly (No .e3)

**File**: `src/commands/openPreview.ts`

```diff
     try {
-        // Start the e3 server (server expects the .e3 directory path)
-        const e3Path = path.join(repoPath, '.e3');
-        const serverUrl = await startE3Server({ repo: e3Path, port });
+        // Start the e3 server with the repository path
+        const serverUrl = await startE3Server({ repoPath, port });
```

### 4.4 Update E3ServerConfig Interface

**File**: `src/server/e3Server.ts`

```diff
 export interface E3ServerConfig {
-    repo: string;
+    repoPath: string;
     port: number;
 }
```

### 4.5 Update Server Creation

**File**: `src/server/e3Server.ts`

```diff
 serverInstance = createServer({
-    repo: config.repo,
+    singleRepoPath: config.repoPath,
     port,
     host: 'localhost',
     cors: true,
 });
```

### 4.6 Update currentRepoPath References

**File**: `src/server/e3Server.ts`

```diff
-    if (serverInstance && currentRepoPath === config.repo) {
+    if (serverInstance && currentRepoPath === config.repoPath) {
         return `http://localhost:${serverInstance.port}`;
     }

     // ... later ...

-    currentRepoPath = config.repo;
+    currentRepoPath = config.repoPath;
```

---

## 5. Complete Updated Files

### 5.1 src/commands/openPreview.ts

```typescript
/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import * as vscode from 'vscode';
import { startE3Server } from '../server/e3Server.js';
import { createPreviewPanel } from '../webview/panel.js';

export async function openPreviewCommand(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('east-ui.e3');
    const lastRepoPath = config.get<string>('lastRepositoryPath', '');
    const port = config.get<number>('port', 3001);

    // Show folder picker dialog
    const defaultUri = lastRepoPath ? vscode.Uri.file(lastRepoPath) : undefined;
    const folderUri = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        defaultUri,
        openLabel: 'Select Repository',
        title: 'Select E3 Repository',
    });

    if (!folderUri || folderUri.length === 0) {
        return;
    }

    const repoPath = folderUri[0].fsPath;

    // Save the path for next time
    await config.update('lastRepositoryPath', repoPath, vscode.ConfigurationTarget.Global);

    try {
        // Start the e3 server - let e3 validate the repository
        const serverUrl = await startE3Server({ repoPath, port });

        // Convert localhost URL to externally accessible URL for remote scenarios
        const externalUri = await vscode.env.asExternalUri(vscode.Uri.parse(serverUrl));
        const externalUrl = externalUri.toString().replace(/\/$/, '');

        // Open the preview panel
        createPreviewPanel(context, externalUrl, repoPath);

    } catch (error) {
        // e3 will provide appropriate error messages for invalid repositories
        vscode.window.showErrorMessage(
            `Failed to start e3 server: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}
```

### 5.2 src/server/e3Server.ts

```typescript
/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { createServer, type Server } from '@elaraai/e3-api-server';
import getPort from 'get-port';

let serverInstance: Server | null = null;
let currentRepoPath: string | null = null;

export interface E3ServerConfig {
    repoPath: string;
    port: number;
}

/**
 * Start the e3 API server.
 * If already running with a different repo, stops and restarts.
 * Uses get-port to find an available port (prefers configured port).
 */
export async function startE3Server(config: E3ServerConfig): Promise<string> {
    // If server is running with same repo, just return the URL
    if (serverInstance && currentRepoPath === config.repoPath) {
        return `http://localhost:${serverInstance.port}`;
    }

    // Stop existing server if running
    if (serverInstance) {
        await stopE3Server();
    }

    // Get an available port (prefers configured port if available)
    const port = await getPort({ port: config.port });

    serverInstance = createServer({
        singleRepoPath: config.repoPath,
        port,
        host: 'localhost',
        cors: true,
    });

    await serverInstance.start();
    currentRepoPath = config.repoPath;

    return `http://localhost:${serverInstance.port}`;
}

/**
 * Stop the e3 API server if running.
 */
export async function stopE3Server(): Promise<void> {
    if (serverInstance) {
        await serverInstance.stop();
        serverInstance = null;
        currentRepoPath = null;
    }
}

/**
 * Check if the server is currently running.
 */
export function isServerRunning(): boolean {
    return serverInstance !== null;
}

/**
 * Get the current server URL if running.
 */
export function getServerUrl(): string | null {
    if (serverInstance) {
        return `http://localhost:${serverInstance.port}`;
    }
    return null;
}
```

---

## 6. ServerConfig API Reference

### New ServerConfig Interface (e3-api-server)

```typescript
export interface ServerConfig {
    reposDir?: string;           // Multi-repo mode
    singleRepoPath?: string;     // Single-repo mode (extension uses this)
    port?: number;
    host?: string;
    cors?: boolean;
    auth?: AuthConfig;
    oidc?: OidcConfig;
}
```

---

## 7. Implementation Checklist

- [ ] Remove `isE3Repository()` function from `openPreview.ts`
- [ ] Remove validation check before starting server
- [ ] Remove `.e3` path joining - pass `repoPath` directly
- [ ] Update `E3ServerConfig` interface: `repo` → `repoPath`
- [ ] Update `createServer()` call: `repo` → `singleRepoPath`
- [ ] Update `currentRepoPath` comparisons to use `config.repoPath`
- [ ] Remove unused `fs` and `path` imports from `openPreview.ts`
- [ ] Test with valid and invalid repositories

---

## 8. Summary of Changes

| File | Change | Reason |
|------|--------|--------|
| `openPreview.ts` | Remove `isE3Repository()` | Let e3 handle validation |
| `openPreview.ts` | Remove validation check | Let e3 handle validation |
| `openPreview.ts` | Remove `.e3` path joining | No more `.e3` directory |
| `openPreview.ts` | Remove `fs`, `path` imports | No longer needed |
| `e3Server.ts` | `repo` → `repoPath` | Clearer naming |
| `e3Server.ts` | `repo` → `singleRepoPath` | API changed |

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-19 | Initial document |
| 1.1 | 2026-01-19 | Fixed: No `.e3` directory |
| 1.2 | 2026-01-19 | Removed client-side validation - let e3 define errors |
