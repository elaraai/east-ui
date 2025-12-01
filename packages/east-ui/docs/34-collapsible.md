### 34. [ ] Collapsible (`src/disclosure/collapsible/`)

**Source:** `@chakra-ui/react` - built on Ark UI Collapsible

**Chakra UI Structure:**
```tsx
<Collapsible.Root defaultOpen>
  <Collapsible.Trigger>
    Toggle content
    <Collapsible.Indicator />
  </Collapsible.Trigger>
  <Collapsible.Content>
    <p>This content can be collapsed.</p>
  </Collapsible.Content>
</Collapsible.Root>
```

**Compound Components:**
- `Collapsible.Root` - main container
- `Collapsible.Trigger` - toggle button
- `Collapsible.Content` - collapsible content area
- `Collapsible.Indicator` - expand/collapse icon
- `Collapsible.Context` - access to open state

**Root Props:**
- `open`: boolean - controlled open state
- `defaultOpen`: boolean - initial open state
- `disabled`: boolean - disable toggle
- `lazyMount`: boolean - mount content only when opened
- `unmountOnExit`: boolean - unmount content when closed
- `onOpenChange`: (details: { open: boolean }) => void - change callback
- `onExitComplete`: () => void - animation complete callback

**East UI Types:**
```typescript
// Collapsible is a container component
// Defined inline in component.ts

// component.ts - inline definition
Collapsible: StructType({
  trigger: StringType,  // trigger text
  content: ArrayType(node),  // UI component children!
  open: OptionType(BooleanType),
  defaultOpen: OptionType(BooleanType),
  disabled: OptionType(BooleanType),
  lazyMount: OptionType(BooleanType),
  unmountOnExit: OptionType(BooleanType),
}),

// index.ts - namespace export
export const Collapsible = {
  Root: createCollapsibleRoot,
  Types: {
    Collapsible: CollapsibleType,
  },
} as const;
```

**Usage:**
```typescript
// Basic collapsible
Collapsible.Root("Show details", [
  Text.Root("This is the collapsible content."),
  Text.Root("It can contain any UI components."),
]);

// Initially open
Collapsible.Root("Advanced options", [
  Checkbox.Root(false, { label: "Enable feature A" }),
  Checkbox.Root(false, { label: "Enable feature B" }),
], {
  defaultOpen: true,
});

// Lazy mounted (better performance)
Collapsible.Root("Load on demand", [
  HeavyComponent.Root(),
], {
  lazyMount: true,
  unmountOnExit: true,
});

// Disabled collapsible
Collapsible.Root("Cannot toggle", [
  Text.Root("This section is locked."),
], {
  disabled: true,
  defaultOpen: true,
});
```

---

