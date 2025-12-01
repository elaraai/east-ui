### 26. [x] Splitter (`src/layout/splitter/index.ts`, `src/layout/splitter/style.ts`)

**Source:** `@chakra-ui/react@3.30.0` - built on Ark UI Splitter

**Chakra UI Structure:**
```tsx
<Splitter.Root defaultSize={[50, 50]} orientation="horizontal">
  <Splitter.Panel id="left">Left panel</Splitter.Panel>
  <Splitter.ResizeTrigger id="left:right" />
  <Splitter.Panel id="right">Right panel</Splitter.Panel>
</Splitter.Root>
```

**Compound Components:**
- `Splitter.Root` - main container
- `Splitter.Panel` - resizable panel
- `Splitter.ResizeTrigger` - draggable handle between panels

**East UI Types:**
```typescript
// Panel configuration
export const SplitterPanelType = StructType({
  id: StringType,
  content: UIComponentType,
  minSize: OptionType(FloatType),  // percentage
  maxSize: OptionType(FloatType),
  collapsible: OptionType(BooleanType),
  defaultCollapsed: OptionType(BooleanType),
});

// Root type
export const SplitterType = StructType({
  panels: ArrayType(SplitterPanelType),
  defaultSize: ArrayType(FloatType),  // percentages for each panel
  orientation: OptionType(OrientationType),  // horizontal | vertical
  onSizeChange: OptionType(FunctionType([ArrayType(FloatType)], NullType)),
});

export const Splitter = {
  Root: SplitterRoot,
  Panel: SplitterPanel,
} as const;
```

**Usage:**
```typescript
// Horizontal splitter
Splitter.Root({
  orientation: variant("horizontal", null),
  defaultSize: [30, 70],
  panels: [
    {
      id: "sidebar",
      content: Sidebar({ ... }),
      minSize: 20,
      collapsible: true,
    },
    {
      id: "main",
      content: MainContent({ ... }),
      minSize: 50,
    },
  ],
});

// Vertical splitter (top/bottom)
Splitter.Root({
  orientation: variant("vertical", null),
  defaultSize: [60, 40],
  panels: [
    { id: "editor", content: CodeEditor({ ... }) },
    { id: "terminal", content: Terminal({ ... }), collapsible: true },
  ],
});
```

---

