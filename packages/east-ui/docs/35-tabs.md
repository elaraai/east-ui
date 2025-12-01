### 35. [ ] Tabs (`src/disclosure/tabs/`)

*Already documented as section 21, updating with complete Chakra v3 props*

**Source:** `@chakra-ui/react` - built on Ark UI Tabs

**Chakra UI Structure:**
```tsx
<Tabs.Root defaultValue="tab1" variant="line" size="md" fitted>
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
    <Tabs.Trigger value="tab3" disabled>Tab 3</Tabs.Trigger>
    <Tabs.Indicator />
  </Tabs.List>
  <Tabs.ContentGroup>
    <Tabs.Content value="tab1">Content 1</Tabs.Content>
    <Tabs.Content value="tab2">Content 2</Tabs.Content>
    <Tabs.Content value="tab3">Content 3</Tabs.Content>
  </Tabs.ContentGroup>
</Tabs.Root>
```

**Compound Components:**
- `Tabs.Root` - main container
- `Tabs.List` - container for triggers
- `Tabs.Trigger` - individual tab button
- `Tabs.Content` - content panel for each tab
- `Tabs.ContentGroup` - container for content panels
- `Tabs.Indicator` - animated indicator

**Root Props:**
- `value`: string - controlled selected tab
- `defaultValue`: string - initial selected tab
- `orientation`: "horizontal" | "vertical" - layout direction
- `activationMode`: "automatic" | "manual" - keyboard nav behavior
- `lazyMount`: boolean - mount content only when selected
- `unmountOnExit`: boolean - unmount when deselected
- `variant`: "line" | "subtle" | "enclosed" | "outline" | "plain"
- `size`: "sm" | "md" | "lg"
- `fitted`: boolean - tabs take equal width
- `justify`: "start" | "center" | "end" - tab list alignment
- `colorPalette`: ColorScheme

**East UI Types:**
```typescript
// Tabs variant type
export const TabsVariantType = VariantType({
  line: NullType,
  subtle: NullType,
  enclosed: NullType,
  outline: NullType,
  plain: NullType,
});

// Tabs justify type
export const TabsJustifyType = VariantType({
  start: NullType,
  center: NullType,
  end: NullType,
});

// Tabs activation mode
export const TabsActivationModeType = VariantType({
  automatic: NullType,
  manual: NullType,
});

// Tab item type
export const TabsItemType = StructType({
  value: StringType,
  trigger: StringType,
  content: ArrayType(node),  // UI component children!
  disabled: OptionType(BooleanType),
});

// Tabs is a container component
// Defined inline in component.ts
Tabs: StructType({
  items: ArrayType(TabsItemType),
  value: OptionType(StringType),
  defaultValue: OptionType(StringType),
  orientation: OptionType(OrientationType),
  activationMode: OptionType(TabsActivationModeType),
  lazyMount: OptionType(BooleanType),
  unmountOnExit: OptionType(BooleanType),
  variant: OptionType(TabsVariantType),
  size: OptionType(SizeType),
  fitted: OptionType(BooleanType),
  justify: OptionType(TabsJustifyType),
  colorPalette: OptionType(ColorSchemeType),
}),

export const Tabs = {
  Root: createTabsRoot,
  Item: createTabsItem,
  Variant: TabsVariant,
  Types: {
    Tabs: TabsType,
    Item: TabsItemType,
    Variant: TabsVariantType,
    Justify: TabsJustifyType,
  },
} as const;
```

**Usage:**
```typescript
// Basic tabs
Tabs.Root([
  Tabs.Item("overview", "Overview", [Text.Root("Overview content")]),
  Tabs.Item("settings", "Settings", [Text.Root("Settings content")]),
  Tabs.Item("billing", "Billing", [Text.Root("Billing content")]),
], {
  defaultValue: "overview",
  variant: "line",
});

// Enclosed variant with equal width
Tabs.Root([
  Tabs.Item("tab1", "Tab 1", [Form.Root()]),
  Tabs.Item("tab2", "Tab 2", [Table.Root()]),
], {
  variant: "enclosed",
  fitted: true,
  size: "lg",
});

// Vertical tabs
Tabs.Root([
  Tabs.Item("profile", "Profile", [ProfileSection.Root()]),
  Tabs.Item("security", "Security", [SecuritySection.Root()]),
], {
  orientation: "vertical",
  variant: "subtle",
});

// Lazy-loaded tabs
Tabs.Root([
  Tabs.Item("dashboard", "Dashboard", [Dashboard.Root()]),
  Tabs.Item("analytics", "Analytics", [Analytics.Root()]),
], {
  lazyMount: true,
  unmountOnExit: true,
});
```

---

