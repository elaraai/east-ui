### 36. [ ] EmptyState (`src/display/empty-state/`)

**Source:** `@chakra-ui/react` - EmptyState component

**Chakra UI Structure:**
```tsx
<EmptyState.Root size="md">
  <EmptyState.Content>
    <EmptyState.Indicator>
      <Icon />
    </EmptyState.Indicator>
    <VStack textAlign="center">
      <EmptyState.Title>No results found</EmptyState.Title>
      <EmptyState.Description>
        Try adjusting your search criteria.
      </EmptyState.Description>
    </VStack>
    <EmptyState.Actions>
      <Button>Clear filters</Button>
    </EmptyState.Actions>
  </EmptyState.Content>
</EmptyState.Root>
```

**Compound Components:**
- `EmptyState.Root` - main container
- `EmptyState.Content` - content wrapper
- `EmptyState.Indicator` - icon/illustration container
- `EmptyState.Title` - heading text
- `EmptyState.Description` - descriptive text
- `EmptyState.Actions` - action buttons container

**Root Props:**
- `size`: "sm" | "md" | "lg" - overall size

**East UI Types:**
```typescript
// EmptyState is a container component for actions
// Defined inline in component.ts

// types.ts
export const EmptyStateSizeType = VariantType({
  sm: NullType,
  md: NullType,
  lg: NullType,
});

// component.ts - inline definition
EmptyState: StructType({
  title: StringType,
  description: OptionType(StringType),
  icon: OptionType(StringType),  // icon name
  actions: OptionType(ArrayType(node)),  // UI component children for actions!
  size: OptionType(EmptyStateSizeType),
}),

export const EmptyState = {
  Root: createEmptyStateRoot,
  Types: {
    EmptyState: EmptyStateType,
    Size: EmptyStateSizeType,
  },
} as const;
```

**Usage:**
```typescript
// No results state
EmptyState.Root({
  title: "No results found",
  description: "Try adjusting your search criteria.",
  icon: "search",
  actions: [
    Button.Root("Clear filters", { variant: "outline" }),
  ],
  size: "md",
});

// Empty inbox
EmptyState.Root({
  title: "Your inbox is empty",
  description: "When you receive messages, they will appear here.",
  icon: "inbox",
  size: "lg",
});

// No data with action
EmptyState.Root({
  title: "No projects yet",
  description: "Create your first project to get started.",
  icon: "folder",
  actions: [
    Button.Root("Create project", { colorPalette: "blue" }),
  ],
});

// Small inline empty state
EmptyState.Root({
  title: "No items",
  size: "sm",
});
```

---

