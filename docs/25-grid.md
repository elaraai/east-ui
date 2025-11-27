### 25. [x] Grid (`src/layout/grid/index.ts`, `src/layout/grid/style.ts`)

**Source:** `@chakra-ui/react@3.30.0` - `dist/types/components/grid/`

**Chakra UI Structure:**
```tsx
<Grid templateColumns="repeat(3, 1fr)" gap={4}>
  <GridItem colSpan={2}>Main content</GridItem>
  <GridItem>Sidebar</GridItem>
  <GridItem colSpan={3}>Footer</GridItem>
</Grid>
```

**East UI Types:**
```typescript
// Grid template values
export const GridTemplateType = VariantType({
  auto: NullType,
  min_content: NullType,
  max_content: NullType,
});

// Grid item type
export const GridItemType = StructType({
  content: UIComponentType,
  colSpan: OptionType(IntegerType),
  rowSpan: OptionType(IntegerType),
  colStart: OptionType(IntegerType),
  colEnd: OptionType(IntegerType),
  rowStart: OptionType(IntegerType),
  rowEnd: OptionType(IntegerType),
});

// Grid root type
export const GridType = StructType({
  items: ArrayType(GridItemType),

  // Template definitions (CSS grid syntax or responsive object)
  templateColumns: OptionType(StringType),  // e.g., "repeat(3, 1fr)"
  templateRows: OptionType(StringType),
  templateAreas: OptionType(StringType),

  // Gap
  gap: OptionType(StringType),  // Chakra spacing token
  columnGap: OptionType(StringType),
  rowGap: OptionType(StringType),

  // Alignment
  justifyItems: OptionType(JustifyContentType),
  alignItems: OptionType(AlignItemsType),
  justifyContent: OptionType(JustifyContentType),
  alignContent: OptionType(AlignItemsType),

  // Auto placement
  autoColumns: OptionType(StringType),
  autoRows: OptionType(StringType),
  autoFlow: OptionType(GridAutoFlowType),
});

export const GridAutoFlowType = VariantType({
  row: NullType,
  column: NullType,
  dense: NullType,
  row_dense: NullType,
  column_dense: NullType,
});

export const Grid = {
  Root: GridRoot,
  Item: GridItem,
} as const;
```

**Usage:**
```typescript
// Basic 3-column grid
Grid.Root({
  templateColumns: "repeat(3, 1fr)",
  gap: "4",
  items: [
    { content: Card({ ... }), colSpan: 2 },
    { content: Sidebar({ ... }) },
    { content: Footer({ ... }), colSpan: 3 },
  ],
});

// Responsive grid
Grid.Root({
  templateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "6",
  items: products.map(p => ({
    content: ProductCard(p),
  })),
});
```

---

