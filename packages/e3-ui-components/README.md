# E3 UI Components

> React Query hooks and preview components for the e3 API

[![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE.md)
[![Node Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)

**E3 UI Components** provides React Query hooks for all [e3-api-client](https://www.npmjs.com/package/@elaraai/e3-api-client) functions and reusable preview components for tasks, inputs, and logs.

## Features

- **React Query Hooks** - `useQuery` and `useMutation` wrappers for all e3 API client functions
- **Task Preview** - Component for viewing task execution output and logs
- **Input Preview** - Component for viewing dataset input values
- **Virtualized Log Viewer** - Performant log display with search and auto-scroll
- **Type-Safe** - Full TypeScript support with proper return type inference

## Installation

```bash
npm install @elaraai/e3-ui-components @elaraai/e3-api-client @tanstack/react-query
```

## Hooks

React Query hooks are provided for every e3 API domain:

| Domain | Hooks |
|--------|-------|
| **Repos** | `useRepoList`, `useRepoStatus`, `useRepoGc`, `useRepoGcStart`, `useRepoGcStatus`, `useRepoCreate`, `useRepoRemove` |
| **Packages** | `usePackageList`, `usePackageGet`, `usePackageImport`, `usePackageExport`, `usePackageRemove` |
| **Workspaces** | `useWorkspaceList`, `useWorkspaceCreate`, `useWorkspaceGet`, `useWorkspaceStatus`, `useWorkspaceRemove`, `useWorkspaceDeploy`, `useWorkspaceExport` |
| **Datasets** | `useDatasetList`, `useDatasetListAt`, `useDatasetListRecursive`, `useDatasetGet`, `useDatasetSet` |
| **Tasks** | `useTaskList`, `useTaskGet`, `useTaskExecutionList` |
| **Executions** | `useDataflowExecute`, `useDataflowStart`, `useDataflowGraph`, `useDataflowExecution`, `useDataflowCancel`, `useTaskLogs` |

### Quick Start

```tsx
import { useWorkspaceList, useTaskList } from '@elaraai/e3-ui-components';

function WorkspaceView({ apiUrl, repo }: { apiUrl: string; repo: string }) {
    const { data: workspaces, isLoading } = useWorkspaceList(apiUrl, repo);

    if (isLoading) return <div>Loading...</div>;

    return (
        <ul>
            {workspaces?.map(ws => <li key={ws.name}>{ws.name}</li>)}
        </ul>
    );
}
```

### Query Overrides

All query hooks accept an optional `QueryOverrides` parameter for controlling query behavior:

```tsx
const { data } = useTaskList(apiUrl, repo, workspace, requestOptions, {
    refetchInterval: 5000,
    staleTime: 10000,
    enabled: isReady,
});
```

## Components

### TaskPreview

Displays task execution output and logs with a virtualized log viewer.

```tsx
import { TaskPreview } from '@elaraai/e3-ui-components';

<TaskPreview apiUrl={url} workspace={ws} task={taskName} taskInfo={info} outputHash={hash} />
```

### InputPreview

Displays dataset input values with type-aware rendering.

```tsx
import { InputPreview } from '@elaraai/e3-ui-components';

<InputPreview apiUrl={url} workspace={ws} path={datasetPath} inputInfo={info} />
```

### VirtualizedLogViewer

Performant log viewer with search, copy, and auto-scroll.

```tsx
import { VirtualizedLogViewer } from '@elaraai/e3-ui-components';

<VirtualizedLogViewer lines={logLines} isLive={isRunning} />
```

### StatusDisplay

Status feedback component with error, warning, info, and loading variants.

```tsx
import { StatusDisplay } from '@elaraai/e3-ui-components';

<StatusDisplay variant="error" title="Failed" message={error.message} />
```

## Development

```bash
npm run build     # Build library
npm run lint      # Check code quality
```

## License

Dual-licensed:
- **Open Source**: [AGPL-3.0](LICENSE.md) - Free for open source use
- **Commercial**: Available for proprietary use - contact support@elara.ai

## Links

- **Website**: [https://elaraai.com/](https://elaraai.com/)
- **e3 API Client**: [https://www.npmjs.com/package/@elaraai/e3-api-client](https://www.npmjs.com/package/@elaraai/e3-api-client)
- **East UI**: [https://www.npmjs.com/package/@elaraai/east-ui](https://www.npmjs.com/package/@elaraai/east-ui)
- **Issues**: [https://github.com/elaraai/east-ui/issues](https://github.com/elaraai/east-ui/issues)
- **Email**: support@elara.ai

---

*Developed by [Elara AI Pty Ltd](https://elaraai.com/) - Powering the computational layer of AI-driven business optimization.*
