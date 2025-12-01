### 22. [x]  DataList (`src/display/data-list.ts`)

**Source:** `@chakra-ui/react@3.30.0` - `dist/types/components/data-list/`

**Chakra UI Structure:**
```tsx
<DataList.Root orientation="horizontal" size="md" variant="subtle">
  <DataList.Item>
    <DataList.ItemLabel>Status</DataList.ItemLabel>
    <DataList.ItemValue>Active</DataList.ItemValue>
  </DataList.Item>
  <DataList.Item>
    <DataList.ItemLabel>Created</DataList.ItemLabel>
    <DataList.ItemValue>Jan 1, 2024</DataList.ItemValue>
  </DataList.Item>
</DataList.Root>
```

**Compound Components (from namespace.d.ts):**
- `DataList.Root` - main container (`<dl>` - description list)
- `DataList.Item` - container for a label/value pair (`<div>`)
- `DataList.ItemLabel` - the term/label (`<dt>`)
- `DataList.ItemValue` - the definition/value (`<dd>`)

**Root Props (from data-list.d.ts & recipes/data-list.d.ts):**
- `orientation`: "horizontal" | "vertical" - layout direction
- `size`: "sm" | "md" | "lg"
- `variant`: "subtle" | "bold"

**East UI Types:**
```typescript
// DataList-specific variant types
export const DataListVariantType = VariantType({
  subtle: NullType,
  bold: NullType,
});

// Item type - a single label/value pair
export const DataListItemType = StructType({
  label: StringType,
  value: StringType,
});

// Root type - complete data list structure
export const DataListRootType = StructType({
  items: ArrayType(DataListItemType),
  orientation: OptionType(OrientationType),
  size: OptionType(SizeType),
  variant: OptionType(DataListVariantType),
});

export const DataList = {
  Root,
  Item,
  ItemLabel,
  ItemValue,
} as const;
```

**Usage:**
```typescript
// Static data list
DataList.Root({
  items: [
    { label: "Status", value: "Active" },
    { label: "Created", value: "Jan 1, 2024" },
    { label: "Updated", value: "Dec 15, 2024" },
  ],
  orientation: variant("horizontal", null),
  variant: variant("subtle", null),
});

// Dynamic data list from record
DataList.Root({
  items: record.entries().map(([key, val]) => ({
    label: key,
    value: val.toString(),
  })),
  orientation: variant("vertical", null),
  size: variant("md", null),
});
```

---

