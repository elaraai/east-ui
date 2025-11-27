### 20. [x] Table (`src/table/`)

**Source:** `@chakra-ui/react@3.30.0` - `dist/types/components/table/`

**Chakra UI Structure:**
```tsx
<Table.Root size="md" variant="line" striped interactive>
  <Table.Caption>Monthly Sales</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.ColumnHeader>Product</Table.ColumnHeader>
      <Table.ColumnHeader>Category</Table.ColumnHeader>
      <Table.ColumnHeader textAlign="end">Price</Table.ColumnHeader>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {items.map((item) => (
      <Table.Row key={item.id}>
        <Table.Cell>{item.name}</Table.Cell>
        <Table.Cell>{item.category}</Table.Cell>
        <Table.Cell textAlign="end">{item.price}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
  <Table.Footer>
    <Table.Row>
      <Table.Cell colSpan={3}>Total: $1,000</Table.Cell>
    </Table.Row>
  </Table.Footer>
</Table.Root>
```

**Compound Components (from namespace.d.ts):**
- `Table.Root` - main table element (`<table>`)
- `Table.Header` - table header section (`<thead>`)
- `Table.Body` - table body section (`<tbody>`)
- `Table.Footer` - table footer section (`<tfoot>`)
- `Table.Row` - table row (`<tr>`)
- `Table.ColumnHeader` - header cell (`<th>`)
- `Table.Cell` - data cell (`<td>`)
- `Table.Caption` - table caption (`<caption>`)
- `Table.ScrollArea` - wrapper for horizontal scrolling
- `Table.ColumnGroup` - column grouping (`<colgroup>`)
- `Table.Column` - column definition (`<col>`)

**Root Props (from table.d.ts & recipes/table.d.ts):**
- `native`: boolean - renders native HTML elements instead of Chakra styled components
- `variant`: "line" | "outline"
- `size`: "sm" | "md" | "lg"
- `interactive`: boolean - highlights rows on hover (uses colorPalette.subtle)
- `stickyHeader`: boolean - makes header sticky
- `striped`: boolean - adds zebra stripes to odd rows
- `showColumnBorder`: boolean - adds borders between columns
- `colorPalette`: ColorScheme - color for interactive hover

**East UI Types:**
```typescript
// =============================================================================
// Style Types
// =============================================================================

const TextAlignType = VariantType({
  left: NullType,
  center: NullType,
  right: NullType,
  justify: NullType,
});

const TableVariantType = VariantType({
  line: NullType,
  outline: NullType,
});

const TableSizeType = VariantType({
  sm: NullType,
  md: NullType,
  lg: NullType,
});

const TableCellStyleType = StructType({
  textAlign: OptionType(TextAlignType),
  color: OptionType(StringType),
  background: OptionType(StringType),
});

const TableRowStyleType = StructType({
  background: OptionType(StringType),
});

// =============================================================================
// Table.Cell - East type and factory
// =============================================================================

// East type for a cell (generic over value type)
type TableCellType<T extends EastType> = StructType<{
  value: T;
  style: OptionType<TableCellStyleType>;
}>;

// Factory input
type TableCellStyleInput = {
  textAlign?: SubtypeExprOrValue<TextAlignType>;
  color?: SubtypeExprOrValue<StringType>;
  background?: SubtypeExprOrValue<StringType>;
};

// Factory function
function TableCell<T extends EastType>(
  value: ExprType<T>,
  style?: TableCellStyleInput
): ExprType<TableCellType<T>>;

// =============================================================================
// Table.Row - East type and factory
// =============================================================================

// East type for a row (generic over fields)
// Fields maps field names to their East types
type TableRowType<Fields extends Record<string, EastType>> = StructType<{
  cells: StructType<{ [K in keyof Fields]: TableCellType<Fields[K]> }>;
  key: OptionType<StringType>;
  style: OptionType<TableRowStyleType>;
}>;

// Factory input
type TableRowStyleInput = {
  key?: SubtypeExprOrValue<StringType>;
  background?: SubtypeExprOrValue<StringType>;
};

// Factory function - infers Fields from cells
function TableRow<Fields extends Record<string, EastType>>(
  cells: { [K in keyof Fields]: ExprType<TableCellType<Fields[K]>> },
  style?: TableRowStyleInput
): ExprType<TableRowType<Fields>>;

// =============================================================================
// Table.Column - East type and factory
// =============================================================================

const TableColumnType = StructType({
  header: OptionType(StringType),
  style: OptionType(TableCellStyleType),
});

type TableColumnInput = {
  header?: SubtypeExprOrValue<StringType>;
  textAlign?: SubtypeExprOrValue<TextAlignType>;
};

function TableColumn(input?: TableColumnInput): ExprType<TableColumnType>;

// =============================================================================
// Table.Root - East type and factory
// =============================================================================

// Helper: Pick fields from RowData by column keys
type PickFields<
  RowData extends StructType,
  Keys extends keyof RowData["fields"]
> = {
  [K in Keys]: RowData["fields"][K];
};

// Root config - Columns constrains both columns object and row builder return
// NoInfer prevents TypeScript from inferring Columns from the row return type
type TableRootConfig<
  RowData extends StructType,
  Columns extends keyof RowData["fields"]
> = {
  data: ExprType<ArrayType<RowData>>;
  columns: { [K in Columns]: ExprType<TableColumnType> };
  row: (
    $: BlockBuilder,
    rowData: ExprType<RowData>
  ) => NoInfer<ExprType<TableRowType<PickFields<RowData, Columns>>>>;

  // Styling
  variant?: SubtypeExprOrValue<TableVariantType>;
  size?: SubtypeExprOrValue<TableSizeType>;
  striped?: SubtypeExprOrValue<BooleanType>;
};

// Factory function
function TableRoot<
  RowData extends StructType,
  Columns extends keyof RowData["fields"]
>(config: TableRootConfig<RowData, Columns>): ExprType<StructType>;

export const Table = {
  Root: TableRoot,
  Row: TableRow,
  Cell: TableCell,
  Column: TableColumn,
} as const;
```

**Type Safety Guarantees:**

1. **Column keys constrained to RowData fields**: The `Columns` type parameter is constrained to `keyof RowData["fields"]`, so only valid field names can be used as column keys.

2. **Row cells must match column definitions**: The row builder return type is constrained via `NoInfer<ExprType<TableRowType<PickFields<RowData, Columns>>>>`, ensuring the row cells match the defined columns.

3. **Cell value types must match field types**: `PickFields` extracts the East types for each column from `RowData["fields"]`, so `TableCellType<Fields[K]>` ensures type safety.

4. **Missing columns error at compile time**: If the row builder is missing a cell that's defined in columns, TypeScript reports an error.

**Known Limitations:**

- **Invalid column keys**: When an invalid key is in columns, TypeScript's inference may fall back to all keys, causing errors on the row instead of the column.
- **Extra columns in rows**: TypeScript's structural subtyping allows extra cells in rows; they are silently ignored.

**Usage:**
```typescript
const PersonType = StructType({
  id: StringType,
  name: StringType,
  age: IntegerType,
  salary: FloatType,
});

const people: ExprType<ArrayType<typeof PersonType>> = ...;

// Valid: columns and row cells match
Table.Root({
  data: people,
  columns: {
    name: Table.Column({ header: "Full Name" }),
    age: Table.Column({ header: "Age", textAlign: variant("right", null) }),
  },
  row: ($, person) => Table.Row({
    name: Table.Cell(person.name),
    age: Table.Cell(person.age),
  }),
  variant: variant("line", null),
});

// Error: row is missing "age" cell
Table.Root({
  data: people,
  columns: {
    name: Table.Column(),
    age: Table.Column(),
  },
  row: ($, person) => Table.Row({
    name: Table.Cell(person.name),
    // Missing: age: Table.Cell(person.age),
  }),
});

// Error: cell type mismatch (StringType instead of IntegerType)
Table.Root({
  data: people,
  columns: {
    age: Table.Column(),
  },
  row: ($, person) => Table.Row({
    age: Table.Cell(person.name),  // Error: name is StringType, age is IntegerType
  }),
});
```

---

