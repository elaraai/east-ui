# E3 API Integration Design

## Overview

Replace the current "preview TypeScript file" workflow with an "e3 repository browser" that lets users:
1. Select an e3 repository path
2. Browse workspaces and tasks in a TreeView
3. View task outputs rendered as East UI components

## User Flow

```
User runs "East UI: Open Preview" command
           │
           ▼
┌─────────────────────────────┐
│  Prompt for repository path │  (folder picker dialog)
│  OR use last-used path      │
└─────────────────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Start e3-api-server        │
│  on configured port         │
└─────────────────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Open webview with:         │
│  - TreeView (workspaces)    │
│  - Preview panel (empty)    │
└─────────────────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  User selects a task        │
│  → Fetch task output        │
│  → Render in preview panel  │
└─────────────────────────────┘
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     VS Code Extension Host                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Extension (Node.js)                     │  │
│  │  ┌─────────────────┐    ┌─────────────────────────────┐   │  │
│  │  │  e3-api-server  │    │     Extension Logic         │   │  │
│  │  │  (Hono + Node)  │    │  - Repository path prompt   │   │  │
│  │  │                 │    │  - Server lifecycle         │   │  │
│  │  │  localhost:PORT │    │  - Webview communication    │   │  │
│  │  └────────┬────────┘    └─────────────────────────────┘   │  │
│  └───────────┼───────────────────────────────────────────────┘  │
│              │ HTTP (localhost)                                  │
│  ┌───────────┼───────────────────────────────────────────────┐  │
│  │           ▼              Webview (Browser)                 │  │
│  │  ┌─────────────────┐    ┌─────────────────────────────┐   │  │
│  │  │  e3-api-client  │───▶│      React UI               │   │  │
│  │  │  (fetch-based)  │    │  - Workspace/Task TreeView  │   │  │
│  │  │                 │    │  - Task Output Preview      │   │  │
│  │  └─────────────────┘    └─────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Configuration

### VS Code Settings

Add to `contributes.configuration` in `package.json`:

```json
{
  "east-ui.e3.port": {
    "type": "number",
    "default": 3001,
    "description": "Port for the e3 API server (default: 3001)"
  },
  "east-ui.e3.lastRepositoryPath": {
    "type": "string",
    "default": "",
    "description": "Last used e3 repository path (auto-saved)"
  }
}
```

### Command Flow

When `east-ui.openPreview` is invoked:

1. **Prompt for repository path** using `vscode.window.showOpenDialog`:
   - Pre-fill with `east-ui.e3.lastRepositoryPath` if set
   - Filter to directories only
   - Title: "Select E3 Repository"

2. **Validate the path** - check for `.e3` directory or valid repo structure

3. **Save path** to `east-ui.e3.lastRepositoryPath` for next time

4. **Start server** with selected repo path and configured port

5. **Open webview** with server URL embedded

### Runtime Configuration

The server URL is passed to the webview via:
1. Initial HTML embed: `window.__E3_API_URL__ = "http://localhost:3001"`
2. `window.__E3_REPO_PATH__` for display in toolbar

## Dependencies

### Extension (package.json)

```json
{
  "dependencies": {
    "@elaraai/e3-api-server": "^x.x.x"
  }
}
```

Note: The extension no longer needs `@elaraai/east` or `@elaraai/east-ui` as peer dependencies. It only starts the server - all East processing happens in the webview via the API.

### Webview (webview/package.json)

```json
{
  "dependencies": {
    "@elaraai/e3-api-client": "^x.x.x",
    "@elaraai/east": "^x.x.x",
    "@elaraai/east-ui": "^x.x.x",
    "@elaraai/east-ui-components": "^x.x.x"
  }
}
```

The webview needs:
- `e3-api-client` - to fetch data from the server
- `east` - to decode BEAST2 task outputs
- `east-ui` - for UIComponentType definitions
- `east-ui-components` - to render the UI components

## Server Management

### Lifecycle

```typescript
// src/server/e3Server.ts

import { createServer, type Server } from "@elaraai/e3-api-server";

let serverInstance: Server | null = null;

export async function startE3Server(config: {
  repo: string;
  port: number;
}): Promise<string> {
  if (serverInstance) {
    await stopE3Server();
  }

  serverInstance = createServer({
    repo: config.repo,
    port: config.port,
    host: "localhost",
    cors: true,  // Enable CORS for webview access
  });

  await serverInstance.start();
  return `http://localhost:${config.port}`;
}

export async function stopE3Server(): Promise<void> {
  if (serverInstance) {
    await serverInstance.stop();
    serverInstance = null;
  }
}
```

## Webview Components

### TreeView Component

Location: `webview/src/components/WorkspaceTree.tsx`

```typescript
interface WorkspaceTreeProps {
  apiUrl: string;
  onSelectWorkspace: (workspace: string) => void;
  onSelectTask: (workspace: string, task: string) => void;
}
```

Using Chakra UI's Tree component (from `@chakra-ui/react`):

```
Repository
├── Workspace: production
│   ├── Task: data-ingestion
│   ├── Task: transform
│   └── Task: export
├── Workspace: staging
│   ├── Task: data-ingestion
│   └── Task: transform
└── Workspace: development
    └── Task: test-pipeline
```

### Data Fetching

```typescript
// webview/src/hooks/useE3Data.ts

import { workspaceList, workspaceStatus } from "@elaraai/e3-api-client";
import type { WorkspaceInfo, WorkspaceStatusResult } from "@elaraai/e3-api-client";

// Fetch list of workspaces
export function useWorkspaces(apiUrl: string) {
  const [workspaces, setWorkspaces] = useState<WorkspaceInfo[]>([]);

  useEffect(() => {
    if (apiUrl) {
      workspaceList(apiUrl).then(setWorkspaces);
    }
  }, [apiUrl]);

  return workspaces;
}

// Fetch workspace status (includes all tasks with output paths)
export function useWorkspaceStatus(apiUrl: string, workspace: string | null) {
  const [status, setStatus] = useState<WorkspaceStatusResult | null>(null);

  useEffect(() => {
    if (apiUrl && workspace) {
      workspaceStatus(apiUrl, workspace).then(setStatus);
    } else {
      setStatus(null);
    }
  }, [apiUrl, workspace]);

  return status;
}
```

The `status.tasks` array contains all tasks for the workspace, each with its `output` path for fetching results.

## Toolbar

```
┌──────────────────────────────────────────────────────────────────────┐
│ /path/to/repo │ ● Connected │ workspace: production │ task: export  │
└──────────────────────────────────────────────────────────────────────┘
```

### Elements

1. **Repository Path** - Shows the current e3 repository path
2. **Server Status Indicator** - Green dot when connected, red when disconnected
3. **Selected Workspace** - Currently selected workspace (if any)
4. **Selected Task** - Currently selected task (if any)

## File Structure

```
src/
  extension.ts              # Server lifecycle, command registration
  server/
    e3Server.ts             # Server start/stop management
  commands/
    openPreview.ts          # Repo picker → start server → open webview
  webview/
    panel.ts                # Webview panel creation
    html.ts                 # HTML generation with embedded config

webview/
  src/
    main.tsx                # React entry point
    App.tsx                 # Main app with E3Provider
    components/
      Toolbar.tsx           # Repo path display, status indicator
      WorkspaceTree.tsx     # TreeView of workspaces/tasks
      TaskPreview.tsx       # Render selected task output
    hooks/
      useE3Data.ts          # workspaceList, workspaceStatus hooks
      useTaskOutput.ts      # Fetch and decode task output
    context/
      E3Context.tsx         # API URL, selected workspace/task state
```

**Removed** (no longer needed):
- `src/loader/` - TypeScript/IR file loading
- `src/watcher/` - File watching
- File context menu entries

## Commands

Update `contributes.commands` (replacing file-based preview):

| Command | Title | Description |
|---------|-------|-------------|
| `east-ui.openPreview` | East UI: Open Preview | Prompt for repo path, start server, open browser |

Remove file context menu entries - the command is now invoked from command palette only.

## Message Protocol

Since the webview communicates directly with e3-api-server via HTTP, message passing is minimal.

**Initial Config** (embedded in HTML):
```typescript
window.__E3_API_URL__ = "http://localhost:3001";
window.__E3_REPO_PATH__ = "/path/to/repo";
```

**Extension → Webview** (via postMessage, only if needed):
```typescript
type ExtensionMessage =
  | { type: "serverRestarted"; url: string }  // If server restarts
  | { type: "error"; message: string }        // Server errors
```

**Webview → Extension**: None required. All data fetching goes directly via e3-api-client to the server.

## Implementation Phases

### Phase 0: CORS Prerequisite
Add CORS support to e3-api-server (in e3 repo):
- Add `cors?: boolean` option to `ServerConfig`
- Apply Hono CORS middleware when enabled

### Phase 1: Extension Refactor
1. Remove file-based loader (`src/loader/`), watcher (`src/watcher/`)
2. Remove file context menu entries from `package.json`
3. Add e3-api-server dependency
4. Add VS Code settings for port and lastRepositoryPath
5. Implement `openPreview` command:
   - Show folder picker dialog
   - Validate e3 repo
   - Start server with CORS enabled
   - Open webview with embedded config

### Phase 2: Webview Refactor
1. Remove IR-based rendering, file watching UI
2. Add e3-api-client dependency
3. Create E3Context (apiUrl, repoPath)
4. Implement data hooks (useWorkspaces, useWorkspaceStatus, useTaskOutput)

### Phase 3: TreeView + Preview
1. Create WorkspaceTree component with Chakra Tree
2. Create TaskPreview component to render task output
3. Layout: TreeView sidebar + Preview panel
4. Handle task selection → fetch output → render

### Phase 4: Polish
1. Loading states and error handling
2. Server connection indicator
3. Empty states (no workspaces, no tasks, no output)

## Task Listing and Output Retrieval

### Listing Tasks

`workspaceStatus(url, workspace)` returns all tasks in a workspace:

```typescript
interface WorkspaceStatusResult {
  workspace: string;
  tasks: TaskStatusInfo[];  // All tasks with their output paths
  datasets: DatasetStatusInfo[];
  summary: WorkspaceStatusSummary;
}

interface TaskStatusInfo {
  name: string;           // "my-task"
  hash: string;           // Task definition hash
  status: TaskStatus;     // "up-to-date" | "ready" | "waiting" | "in-progress" | "failed" | "error"
  inputs: string[];       // Dataset paths this task reads from
  output: string;         // Dataset path: ".tasks.my-task.output"
  dependsOn: string[];    // Upstream task names
}
```

### Fetching Task Output

When a task is selected, use its `output` path to fetch the value:

```typescript
// webview/src/hooks/useTaskOutput.ts
import { datasetGet } from "@elaraai/e3-api-client";

export async function getTaskOutput(
  apiUrl: string,
  workspace: string,
  task: TaskStatusInfo
): Promise<Uint8Array> {
  // Parse output path: ".tasks.foo.output" -> ["tasks", "foo", "output"]
  const pathParts = task.output
    .split('.')
    .filter(Boolean)
    .map(v => ({ value: v }));

  // Fetch raw BEAST2 bytes
  return datasetGet(apiUrl, workspace, pathParts);
}
```

The returned bytes are BEAST2-encoded. To render as a UI component, decode and pass to `<EastFunction>`.

## CORS Requirement

**e3-api-server does NOT currently support CORS.** We need to add it.

### Option A: Add CORS to e3-api-server (Recommended)

Modify `createServer()` to accept optional middleware:

```typescript
// In e3-api-server/src/server.ts
import { cors } from 'hono/cors';

export interface ServerConfig {
  repo: string;
  port?: number;
  host?: string;
  cors?: boolean | CorsConfig;  // NEW
}

export function createServer(config: ServerConfig): Server {
  const app = new Hono();

  // Add CORS if configured
  if (config.cors) {
    const corsConfig = config.cors === true ? { origin: '*' } : config.cors;
    app.use('*', cors(corsConfig));
  }
  // ... rest of routes
}
```

### Option B: Proxy through extension (Fallback)

If we can't modify e3-api-server immediately, the extension could proxy requests:
- Webview sends request to extension via `postMessage`
- Extension makes HTTP request to local server
- Extension sends response back to webview

This adds latency but avoids CORS entirely.

## Open Questions

1. **Bundle size**: e3-api-server pulls in e3-core. Is the bundle size acceptable for a VS Code extension?

2. **Multiple repositories**: Should we support switching between repositories, or is one configured repo sufficient?
