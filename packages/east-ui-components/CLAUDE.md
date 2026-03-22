# East UI Components

React rendering layer for East UI types. Converts East variant/struct values into Chakra UI v3 React components.

## Stack

- **React 19.2** with `react-dom` 19
- **Chakra UI 3.30** (built on Ark UI / Zag.js state machines)
- **TanStack Table 8.21** (headless table with sorting, column sizing, row selection)
- **TanStack Virtual 3.13** (row virtualization for large datasets)
- **TanStack Query 5.90** (async data fetching)
- **TypeScript 5.9** with `exactOptionalPropertyTypes` enabled
- **Vite** for builds, **ESLint** for linting
- **use-local-storage-state** for opt-in localStorage persistence

## Commands

```bash
npm run build   # tsc --noEmit && vite build
npm run lint    # eslint (must pass before commits)
npm run test    # node --import tsx --test test/**/*.spec.ts
```

## Architecture

### Component rendering pipeline

East programs produce **values** (variant/struct data). This package renders them:

```
East value (VariantType) -> EastChakraComponent (match) -> Specific renderer (memo) -> Chakra UI JSX
```

`EastChakraComponent` in `src/component.tsx` is the top-level dispatcher. It matches on the East variant tag and delegates to the appropriate component.

### File structure

```
src/
  component.tsx              # Top-level variant dispatcher
  hooks/usePersistedState.ts # localStorage persistence hook
  platform/                  # East state management (UIStore, DatasetStore)
  collections/               # Table, Gantt, Planner, TreeView, DataList
  disclosure/                # Tabs, Accordion, Carousel
  layout/                    # Box, Flex, Grid, Stack, Splitter, Separator
  forms/                     # Input, Select, Checkbox, Switch, Slider, etc.
  overlays/                  # Dialog, Drawer, Popover, Tooltip, Menu, etc.
  display/                   # Badge, Tag, Avatar, Stat, Icon
  typography/                # Text, Heading, Code, CodeBlock, Link, etc.
  charts/                    # Sparkline, Area, Bar, Line, Pie, etc.
  feedback/                  # Alert, Progress
  container/                 # Card
  buttons/                   # Button, IconButton, CopyButton
  utils/                     # RowStateManager, RowSortManager
```

## React Best Practices

These rules apply to all components in this package. They reflect React 19 conventions and the patterns established in this codebase.

### Memoization

Every component MUST be wrapped in `memo()` with a custom equality function using East's `equalFor`:

```tsx
const fooEqual = equalFor(Foo.Types.Foo);

export const EastChakraFoo = memo(function EastChakraFoo({ value }: Props) {
    // ...
}, (prev, next) => fooEqual(prev.value, next.value));
```

**Why:** East values are immutable data structures. Structural equality (`equalFor`) prevents re-renders when the value hasn't semantically changed, even if the reference is different.

If the component accepts additional props (like `storageKey`), include them in the comparison:

```tsx
(prev, next) => fooEqual(prev.value, next.value) && prev.storageKey === next.storageKey
```

### useMemo

Use `useMemo` for:
- **Derived props** from East values (`toChakra*` conversions)
- **Extracted callbacks** from East style options (`getSomeorUndefined(style.onFoo)`)
- **Computed data** from East values (column definitions, date ranges, slot positions)
- **Reactive state slices** when destructuring consolidated persisted state

Do NOT use `useMemo` for:
- Simple property access or trivial expressions (e.g., `value.items.length`)
- Values that are already primitives or stable references
- Object literals only used once in JSX (use inline instead)

```tsx
// Good: expensive conversion that produces a new object
const props = useMemo(() => toChakraFoo(value), [value]);

// Good: reactive slice from consolidated state
const sorting = useMemo(() => persistedState.sorting, [persistedState.sorting]);

// Bad: trivial expression
const count = useMemo(() => items.length, [items]); // just use items.length
```

### useCallback

Use `useCallback` for:
- **Event handlers** passed to child components or DOM elements
- **Callbacks that update persisted state** (since `setPersistedState` is itself a callback)
- **Handlers passed to TanStack Table** (`onSortingChange`, `onColumnSizingChange`)

Wrap East-side callbacks with `queueMicrotask` to avoid calling external code during render:

```tsx
const handleClick = useCallback((details: { value: string }) => {
    // Persist state synchronously
    setPersistedState(prev => ({ ...prev, selectedValue: details.value }));
    // Defer East callback to avoid render-time side effects
    if (onClickFn) {
        queueMicrotask(() => onClickFn(details.value));
    }
}, [onClickFn, setPersistedState]);
```

### useState vs usePersistedState

Use `usePersistedState` (with a `storageKey` prop) for **user layout preferences** that should survive page reloads:
- Sort configuration, column widths, splitter positions
- Expanded/collapsed state, selected tabs, selected tree nodes

Use plain `useState` for **transient interaction state**:
- Row selection, hover states, loading indicators
- Drag state, scroll position, animation state

The `usePersistedState` hook accepts a single consolidated state object per component. This avoids sync issues between multiple independent localStorage keys:

```tsx
interface FooPersistedState {
    sorting: SortingState;
    columnSizing: Record<string, number>;
}

const { state: persistedState, setState: setPersistedState } = usePersistedState<FooPersistedState>(
    storageKey,
    { sorting: [], columnSizing: {} },
);
```

### Props pattern

Components receive East values via a `value` prop typed with `ValueTypeOf<typeof Foo.Types.Foo>`. Extract optional style fields with `getSomeorUndefined`:

```tsx
const style = useMemo(() => getSomeorUndefined(value.style), [value.style]);
const onFooFn = useMemo(() => style ? getSomeorUndefined(style.onFoo) : undefined, [style]);
```

### Controlled vs uncontrolled

When adding persistence to Chakra components that support both `defaultValue` and `value`:
- **Without storageKey:** Pass through the East value's `defaultValue`/`value` as-is (uncontrolled)
- **With storageKey:** Switch to controlled mode by passing `value={persistedState.x}` and update via `onValueChange`

```tsx
{...(storageKey
    ? { value: persistedState.selectedValue }
    : { defaultValue: getSomeorUndefined(value.defaultValue) }
)}
```

### Virtualization (Table, Gantt, Planner)

These components use `@tanstack/react-virtual` for row virtualization:
- `RowStateManager` tracks loading/loaded/unloaded per row
- Visible rows trigger loading with a configurable delay (`loadingDelay`)
- Scroll sync between dual panes (table + timeline) uses direct DOM ref manipulation, not state

Do NOT persist scroll position. It's tied to virtualizer row count which changes with data.

### Module-level constants

Pre-define equality functions at module scope (outside the component):

```tsx
const fooEqual = equalFor(Foo.Types.Foo);
```

Also define pure conversion functions (`toChakra*`) at module scope. These are called inside `useMemo` but defined outside the component to avoid re-creation.

### Splitter persistence (Gantt/Planner)

Gantt and Planner have an internal `Splitter.Root` between the table and timeline panels. The splitter position is persisted as `tablePanelSize` (a percentage) via `onResizeEnd`. On mount, the persisted size takes priority over the prop and calculated default:

```
persisted > prop (tablePanelSize) > calculated from column widths
```

### Exports

All public components and types are exported from `src/index.ts`. When adding a new component or hook, add it to the appropriate section in the barrel export.
