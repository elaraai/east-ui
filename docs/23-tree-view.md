### 23. [x]  TreeView (`src/collections/tree-view.ts`)

**Source:** `@chakra-ui/react@3.30.0` - `dist/types/components/tree-view/`

**Chakra UI Structure:**
```tsx
<TreeView.Root collection={collection} size="md" variant="subtle">
  <TreeView.Label>File Explorer</TreeView.Label>
  <TreeView.Tree>
    <TreeView.Node
      render={({ node, nodeState }) => (
        <TreeView.Item value={node.value}>
          <TreeView.ItemIndicator />
          <TreeView.ItemText>{node.label}</TreeView.ItemText>
        </TreeView.Item>
      )}
      renderBranch={({ node, nodeState }) => (
        <TreeView.Branch value={node.value}>
          <TreeView.BranchControl>
            <TreeView.BranchTrigger />
            <TreeView.BranchIndicator />
            <TreeView.BranchText>{node.label}</TreeView.BranchText>
          </TreeView.BranchControl>
          <TreeView.BranchContent>
            <TreeView.BranchIndentGuide />
          </TreeView.BranchContent>
        </TreeView.Branch>
      )}
    />
  </TreeView.Tree>
</TreeView.Root>
```

**Compound Components (from namespace.d.ts):**
- `TreeView.Root` - main container
- `TreeView.Tree` - the tree container element
- `TreeView.Label` - optional label for the tree
- `TreeView.Branch` - a branch node (has children)
- `TreeView.BranchControl` - clickable control area of branch
- `TreeView.BranchTrigger` - trigger button to expand/collapse
- `TreeView.BranchIndicator` - expand/collapse chevron icon
- `TreeView.BranchText` - text label of branch
- `TreeView.BranchContent` - content area containing children
- `TreeView.BranchIndentGuide` - visual indent guide line
- `TreeView.Item` - a leaf node (no children)
- `TreeView.ItemIndicator` - indicator icon for item
- `TreeView.ItemText` - text label of item
- `TreeView.Node` - helper for rendering nodes recursively
- `TreeView.NodeCheckbox` - checkbox for multi-selection

**Root Props (from tree-view.d.ts - inherits ArkTreeView.RootBaseProps):**
- `collection`: TreeCollection - the tree data structure
- `expandedValue`: string[] - controlled expanded node values
- `defaultExpandedValue`: string[] - default expanded nodes
- `onExpandedChange`: callback when expanded state changes
- `selectedValue`: string[] - controlled selected node values
- `defaultSelectedValue`: string[] - default selected nodes
- `onSelectionChange`: callback when selection changes
- `onFocusChange`: callback when focus changes
- `selectionMode`: "single" | "multiple"
- `typeahead`: boolean - enable typeahead search
- `loadChildren`: async function to load children dynamically

**Recipe Props (from recipes/tree-view.d.ts):**
- `size`: "xs" | "sm" | "md"
- `variant`: "subtle" | "solid"
- `animateContent`: boolean - animate expand/collapse

**East UI Types:**
```typescript
// TreeView-specific variant types
export const TreeViewVariantType = VariantType({
  subtle: NullType,
  solid: NullType,
});

export const TreeViewSizeType = VariantType({
  xs: NullType,
  sm: NullType,
  md: NullType,
});

export const TreeViewSelectionModeType = VariantType({
  single: NullType,
  multiple: NullType,
});

// Recursive tree node type
export const TreeNodeType: RecursiveType = RecursiveType(self => StructType({
  value: StringType,
  label: StringType,
  children: OptionType(ArrayType(self)),
}));

export type TreeNodeType = typeof TreeNodeType;

// Root type - complete tree view structure
export const TreeViewRootType = StructType({
  // Data
  nodes: ArrayType(TreeNodeType),
  label: OptionType(StringType),

  // Expansion state
  expandedValue: OptionType(ArrayType(StringType)),
  defaultExpandedValue: OptionType(ArrayType(StringType)),
  onExpandedChange: OptionType(FunctionType([ArrayType(StringType)], NullType)),

  // Selection state
  selectedValue: OptionType(ArrayType(StringType)),
  defaultSelectedValue: OptionType(ArrayType(StringType)),
  onSelectionChange: OptionType(FunctionType([ArrayType(StringType)], NullType)),
  selectionMode: OptionType(TreeViewSelectionModeType),

  // Behavior
  typeahead: OptionType(BooleanType),

  // Styling
  size: OptionType(TreeViewSizeType),
  variant: OptionType(TreeViewVariantType),
  animateContent: OptionType(BooleanType),
});

export const TreeView = {
  Root,
  Tree,
  Label,
  Branch,
  BranchControl,
  BranchTrigger,
  BranchIndicator,
  BranchText,
  BranchContent,
  BranchIndentGuide,
  Item,
  ItemIndicator,
  ItemText,
  Node,
  NodeCheckbox,
} as const;
```

**Usage:**
```typescript
// Static tree
TreeView.Root({
  label: "File Explorer",
  nodes: [
    {
      value: "src",
      label: "src",
      children: [
        { value: "index.ts", label: "index.ts" },
        { value: "utils.ts", label: "utils.ts" },
      ],
    },
    {
      value: "package.json",
      label: "package.json",
    },
  ],
  defaultExpandedValue: ["src"],
  variant: variant("subtle", null),
});

// Dynamic tree from hierarchical data
TreeView.Root({
  nodes: categories.map(cat => ({
    value: cat.id,
    label: cat.name,
    children: cat.subcategories.map(sub => ({
      value: sub.id,
      label: sub.name,
    })),
  })),
  selectionMode: variant("multiple", null),
  animateContent: true,
});
```

---

