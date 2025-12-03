# East UI Developer Guide

Usage guide for East UI component definitions.

---

## Table of Contents

- [Quick Start](#quick-start)
- [UIComponentType](#uicomponenttype)
- [Style Types](#style-types)
- [Layout](#layout)
- [Typography](#typography)
- [Buttons](#buttons)
- [Forms](#forms)
- [Collections](#collections)
- [Charts](#charts)
- [Display](#display)
- [Feedback](#feedback)
- [Disclosure](#disclosure)
- [Overlays](#overlays)
- [Container](#container)

---

## Quick Start

East UI is a typed UI component library for East. Components return data structures describing UI layouts rather than rendering directly.

```typescript
import { East } from "@elaraai/east";
import { Stack, Text, Button, UIComponentType } from "@elaraai/east-ui";

const MyComponent = East.function([], UIComponentType, $ => {
    return Stack.VStack([
        Text.Root("Hello, World!", { fontSize: "lg", fontWeight: "bold" }),
        Button.Root("Click Me", { variant: "solid", colorPalette: "blue" }),
    ], { gap: "4" });
});

const ir = MyComponent.toIR();
```

---

## UIComponentType

`UIComponentType` is the recursive variant type representing any UI component in East UI. It is exported from `@elaraai/east-ui` and used as the return type for East functions that produce UI.

```typescript
import { East } from "@elaraai/east";
import { UIComponentType, Text, Stack } from "@elaraai/east-ui";

// Use as return type for East functions
const MyUI = East.function([], UIComponentType, $ => {
    return Text.Root("Hello");
});

// Container components accept arrays of UIComponentType
Stack.Root([
    Text.Root("Child 1"),
    Button.Root("Child 2"),
], { gap: "4" });
```

The recursive structure allows container components (Box, Stack, Card, Grid, etc.) to have children that are also `UIComponentType`.

---

## Style Types

Common style variant types exported from `@elaraai/east-ui`. Style properties accept string literals (e.g., `"bold"`), Style helpers (e.g., `Style.FontWeight("bold")`), East variants (e.g., `variant("bold", null)`), or East expressions for dynamic styling.

| Type | Values |
|------|--------|
| `FontWeightType` | `normal`, `medium`, `semibold`, `bold`, `light` |
| `FontStyleType` | `normal`, `italic` |
| `TextAlignType` | `left`, `center`, `right`, `justify` |
| `SizeType` | `xs`, `sm`, `md`, `lg` |
| `ColorSchemeType` | `gray`, `red`, `orange`, `yellow`, `green`, `teal`, `blue`, `cyan`, `purple`, `pink` |
| `FlexDirectionType` | `row`, `column`, `row-reverse`, `column-reverse` |
| `JustifyContentType` | `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly` |
| `AlignItemsType` | `flex-start`, `flex-end`, `center`, `baseline`, `stretch` |
| `FlexWrapType` | `nowrap`, `wrap`, `wrap-reverse` |
| `DisplayType` | `block`, `inline`, `inline-block`, `flex`, `inline-flex`, `grid`, `inline-grid`, `none` |
| `OrientationType` | `horizontal`, `vertical` |
| `TableVariantType` | `simple`, `line`, `outline` |
| `TextOverflowType` | `clip`, `ellipsis` |
| `WhiteSpaceType` | `normal`, `nowrap`, `pre`, `pre-wrap`, `pre-line` |
| `OverflowType` | `visible`, `hidden`, `scroll`, `auto` |
| `BorderWidthType` | `none`, `thin`, `medium`, `thick` |
| `BorderStyleType` | `solid`, `dashed`, `dotted`, `double`, `none` |
| `TextTransformType` | `uppercase`, `lowercase`, `capitalize`, `none` |

---

## Layout

### Box

Generic container with flexible styling. Maps to a div element.

```typescript
import { Box, Text } from "@elaraai/east-ui";

// Simple box with children
const container = Box.Root([
    Text.Root("Content"),
], {
    padding: "4",
    background: "gray.100",
    borderRadius: "md",
});

// Directional padding using helper
const paddedBox = Box.Root([Text.Root("Content")], {
    padding: Box.Padding({ top: "2", bottom: "4", left: "4", right: "4" }),
});
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Box.Root(children: SubtypeExprOrValue<ArrayType<UIComponentType>>, style?: BoxStyle): ExprType<UIComponentType>` | Create box container with children | `Box.Root([Text.Root("Hi")], { padding: "4" })` |
| `Box.Padding(config: PaddingConfig): ExprType<PaddingType>` | Create padding configuration | `Box.Padding({ top: "2", bottom: "4" })` |
| `Box.Margin(config: MarginConfig): ExprType<MarginType>` | Create margin configuration | `Box.Margin({ left: "4", right: "4" })` |
| `Box.Types.Box` | East StructType for Box component | `Box.Types.Box` |
| `Box.Types.Style` | East StructType for Box style | `Box.Types.Style` |
| `Box.Types.Padding` | East StructType for padding | `Box.Types.Padding` |
| `Box.Types.Margin` | East StructType for margin | `Box.Types.Margin` |

**BoxStyle Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `display` | `SubtypeExprOrValue<DisplayType> \| DisplayLiteral` | CSS display property |
| `width` | `SubtypeExprOrValue<StringType>` | Width (Chakra token or CSS) |
| `height` | `SubtypeExprOrValue<StringType>` | Height (Chakra token or CSS) |
| `padding` | `SubtypeExprOrValue<PaddingType> \| string` | Padding (use `Box.Padding()` or string) |
| `margin` | `SubtypeExprOrValue<MarginType> \| string` | Margin (use `Box.Margin()` or string) |
| `background` | `SubtypeExprOrValue<StringType>` | Background color |
| `color` | `SubtypeExprOrValue<StringType>` | Text color |
| `borderRadius` | `SubtypeExprOrValue<StringType>` | Border radius |
| `flexDirection` | `SubtypeExprOrValue<FlexDirectionType> \| FlexDirectionLiteral` | Flex direction |
| `justifyContent` | `SubtypeExprOrValue<JustifyContentType> \| JustifyContentLiteral` | Justify content |
| `alignItems` | `SubtypeExprOrValue<AlignItemsType> \| AlignItemsLiteral` | Align items |
| `gap` | `SubtypeExprOrValue<StringType>` | Gap between children |

---

### Stack

Flexbox-based stack layout.

```typescript
import { Stack, Text, Button } from "@elaraai/east-ui";

// Vertical stack (VStack)
const vertical = Stack.VStack([
    Text.Root("Item 1"),
    Text.Root("Item 2"),
], { gap: "4" });

// Horizontal stack (HStack)
const horizontal = Stack.HStack([
    Button.Root("Left"),
    Button.Root("Right"),
], { gap: "2", justify: "center" });

// Generic stack with explicit direction
const stack = Stack.Root([Text.Root("Content")], {
    direction: "column",
    gap: "4",
    align: "center",
});
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Stack.Root(children: SubtypeExprOrValue<ArrayType<UIComponentType>>, style?: StackStyle): ExprType<UIComponentType>` | Create stack container | `Stack.Root([...], { gap: "4" })` |
| `Stack.HStack(children: SubtypeExprOrValue<ArrayType<UIComponentType>>, style?: Omit<StackStyle, "direction">): ExprType<UIComponentType>` | Horizontal stack (direction: row) | `Stack.HStack([...], { gap: "2" })` |
| `Stack.VStack(children: SubtypeExprOrValue<ArrayType<UIComponentType>>, style?: Omit<StackStyle, "direction">): ExprType<UIComponentType>` | Vertical stack (direction: column) | `Stack.VStack([...], { gap: "4" })` |
| `Stack.Padding(config: PaddingConfig): ExprType<PaddingType>` | Create padding configuration | `Stack.Padding({ x: "4" })` |
| `Stack.Margin(config: MarginConfig): ExprType<MarginType>` | Create margin configuration | `Stack.Margin({ y: "2" })` |
| `Stack.Types.Stack` | East StructType for Stack component | `Stack.Types.Stack` |
| `Stack.Types.Style` | East StructType for Stack style | `Stack.Types.Style` |

**StackStyle Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `direction` | `SubtypeExprOrValue<FlexDirectionType> \| FlexDirectionLiteral` | Stack direction |
| `gap` | `SubtypeExprOrValue<StringType>` | Gap between items |
| `align` | `SubtypeExprOrValue<AlignItemsType> \| AlignItemsLiteral` | Cross-axis alignment |
| `justify` | `SubtypeExprOrValue<JustifyContentType> \| JustifyContentLiteral` | Main-axis alignment |
| `wrap` | `SubtypeExprOrValue<FlexWrapType> \| FlexWrapLiteral` | Flex wrap behavior |
| `padding` | `SubtypeExprOrValue<PaddingType> \| string` | Padding |
| `margin` | `SubtypeExprOrValue<MarginType> \| string` | Margin |
| `background` | `SubtypeExprOrValue<StringType>` | Background color |
| `width` | `SubtypeExprOrValue<StringType>` | Width |
| `height` | `SubtypeExprOrValue<StringType>` | Height |

---

### Grid

CSS Grid layout component.

```typescript
import { Grid, Text } from "@elaraai/east-ui";

const grid = Grid.Root([
    Grid.Item(Text.Root("Cell 1"), { colSpan: "2" }),
    Grid.Item(Text.Root("Cell 2")),
    Grid.Item(Text.Root("Cell 3")),
], { templateColumns: "repeat(3, 1fr)", gap: "4" });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Grid.Root(items: SubtypeExprOrValue<ArrayType<GridItemType>>, style?: GridStyle): ExprType<UIComponentType>` | Create grid container | `Grid.Root([Grid.Item(...)], { gap: "4" })` |
| `Grid.Item(content: ExprType<UIComponentType>, style?: GridItemStyle): ExprType<GridItemType>` | Create grid item wrapping a component | `Grid.Item(Text.Root("Cell"), { colSpan: "2" })` |
| `Grid.Types.Grid` | East StructType for Grid component | `Grid.Types.Grid` |
| `Grid.Types.Item` | East StructType for Grid item | `Grid.Types.Item` |
| `Grid.Types.Style` | East StructType for Grid style | `Grid.Types.Style` |

**GridStyle Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `templateColumns` | `SubtypeExprOrValue<StringType>` | Grid template columns (e.g., "repeat(3, 1fr)") |
| `templateRows` | `SubtypeExprOrValue<StringType>` | Grid template rows |
| `gap` | `SubtypeExprOrValue<StringType>` | Gap between cells |
| `columnGap` | `SubtypeExprOrValue<StringType>` | Column gap |
| `rowGap` | `SubtypeExprOrValue<StringType>` | Row gap |
| `alignItems` | `SubtypeExprOrValue<AlignItemsType> \| AlignItemsLiteral` | Align items |
| `justifyItems` | `SubtypeExprOrValue<JustifyContentType> \| JustifyContentLiteral` | Justify items |

**GridItemStyle Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `colSpan` | `SubtypeExprOrValue<StringType>` | Columns to span |
| `rowSpan` | `SubtypeExprOrValue<StringType>` | Rows to span |
| `colStart` | `SubtypeExprOrValue<StringType>` | Starting column |
| `colEnd` | `SubtypeExprOrValue<StringType>` | Ending column |
| `rowStart` | `SubtypeExprOrValue<StringType>` | Starting row |
| `rowEnd` | `SubtypeExprOrValue<StringType>` | Ending row |

---

### Splitter

Resizable split pane layout.

```typescript
import { Splitter, Text } from "@elaraai/east-ui";

const split = Splitter.Root([
    Splitter.Panel("left", Text.Root("Left"), { minSize: 20 }),
    Splitter.Panel("right", Text.Root("Right")),
], [50, 50], { orientation: "horizontal" });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Splitter.Root(panels: SplitterPanel[], defaultSize: number[], style?: SplitterStyle): ExprType<UIComponentType>` | Create splitter container | `Splitter.Root([...], [50, 50])` |
| `Splitter.Panel(id: string, content: ExprType<UIComponentType>, style?: PanelStyle): SplitterPanel` | Create splitter panel | `Splitter.Panel("left", Text.Root("Left"))` |

---

### Separator

Visual divider between content.

```typescript
import { Separator } from "@elaraai/east-ui";

const divider = Separator.Root({ orientation: "horizontal", variant: "solid" });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Separator.Root(style?: SeparatorStyle): ExprType<UIComponentType>` | Create separator | `Separator.Root({ variant: "dashed" })` |

**SeparatorStyle Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `orientation` | `SubtypeExprOrValue<OrientationType> \| OrientationLiteral` | "horizontal" or "vertical" |
| `variant` | `SubtypeExprOrValue<SeparatorVariantType> \| SeparatorVariantLiteral` | "solid" or "dashed" |

---

## Typography

### Text

Text display with comprehensive styling.

```typescript
import { Text } from "@elaraai/east-ui";
import { East } from "@elaraai/east";

// Simple text
const text = Text.Root("Hello");

// Styled text with string literals
const styled = Text.Root("Important Message", {
    fontSize: "lg",
    fontWeight: "bold",
    color: "blue.600",
    textAlign: "center",
});

// Dynamic text with East string interpolation
const dynamic = Text.Root(East.str`Hello, ${name}!`, { fontSize: "lg" });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Text.Root(value: SubtypeExprOrValue<StringType>, style?: TextStyle): ExprType<UIComponentType>` | Create text component | `Text.Root("Hello", { fontWeight: "bold" })` |
| `Text.Types.Text` | East StructType for Text component | `Text.Types.Text` |

**TextStyle Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `color` | `SubtypeExprOrValue<StringType>` | Text color |
| `background` | `SubtypeExprOrValue<StringType>` | Background color |
| `fontWeight` | `SubtypeExprOrValue<FontWeightType> \| FontWeightLiteral` | Font weight |
| `fontStyle` | `SubtypeExprOrValue<FontStyleType> \| FontStyleLiteral` | Font style |
| `fontSize` | `SubtypeExprOrValue<SizeType> \| SizeLiteral` | Font size |
| `textAlign` | `SubtypeExprOrValue<TextAlignType> \| TextAlignLiteral` | Text alignment |
| `textTransform` | `SubtypeExprOrValue<TextTransformType> \| TextTransformLiteral` | Text transform |
| `textOverflow` | `SubtypeExprOrValue<TextOverflowType> \| TextOverflowLiteral` | Text overflow |
| `whiteSpace` | `SubtypeExprOrValue<WhiteSpaceType> \| WhiteSpaceLiteral` | White space handling |
| `overflow` | `SubtypeExprOrValue<OverflowType> \| OverflowLiteral` | Overflow behavior |
| `borderWidth` | `SubtypeExprOrValue<BorderWidthType> \| BorderWidthLiteral` | Border width |
| `borderStyle` | `SubtypeExprOrValue<BorderStyleType> \| BorderStyleLiteral` | Border style |
| `borderColor` | `SubtypeExprOrValue<StringType>` | Border color |

---

## Buttons

### Button

Interactive button component.

```typescript
import { Button } from "@elaraai/east-ui";

const primary = Button.Root("Submit", { variant: "solid", colorPalette: "blue" });
const danger = Button.Root("Delete", { variant: "solid", colorPalette: "red" });
const ghost = Button.Root("Cancel", { variant: "ghost" });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Button.Root(label: SubtypeExprOrValue<StringType>, style?: ButtonStyle): ExprType<UIComponentType>` | Create button | `Button.Root("Click", { variant: "solid" })` |
| `Button.Types.Button` | East StructType for Button component | `Button.Types.Button` |
| `Button.Types.Style` | East StructType for Button style | `Button.Types.Style` |
| `Button.Types.Variant` | East VariantType for button variant | `Button.Types.Variant` |

**ButtonStyle Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `variant` | `SubtypeExprOrValue<ButtonVariantType> \| ButtonVariantLiteral` | "solid", "subtle", "outline", "ghost", "plain" |
| `colorPalette` | `SubtypeExprOrValue<ColorSchemeType> \| ColorSchemeLiteral` | Color scheme |
| `size` | `SubtypeExprOrValue<SizeType> \| SizeLiteral` | Button size |
| `disabled` | `SubtypeExprOrValue<BooleanType>` | Disabled state |
| `loading` | `SubtypeExprOrValue<BooleanType>` | Loading state |

---

### IconButton

Button with icon instead of text.

```typescript
import { IconButton } from "@elaraai/east-ui";

const iconBtn = IconButton.Root("search", { ariaLabel: "Search", variant: "ghost" });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `IconButton.Root(icon: SubtypeExprOrValue<StringType>, style?: IconButtonStyle): ExprType<UIComponentType>` | Create icon button | `IconButton.Root("menu", { ariaLabel: "Menu" })` |

---

## Forms

### Input

Text input with multiple types.

```typescript
import { Input } from "@elaraai/east-ui";

const stringInput = Input.String("initial value", { placeholder: "Enter text" });
const intInput = Input.Integer(0n, { placeholder: "Enter number" });
const floatInput = Input.Float(0.0, { placeholder: "Enter decimal" });
const dateInput = Input.DateTime(new Date(), { placeholder: "Select date" });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Input.String(value: SubtypeExprOrValue<StringType>, style?: InputStyle): ExprType<UIComponentType>` | String input | `Input.String("", { placeholder: "Name" })` |
| `Input.Integer(value: SubtypeExprOrValue<IntegerType>, style?: InputStyle): ExprType<UIComponentType>` | Integer input | `Input.Integer(0n, { placeholder: "Age" })` |
| `Input.Float(value: SubtypeExprOrValue<FloatType>, style?: InputStyle): ExprType<UIComponentType>` | Float input | `Input.Float(0.0)` |
| `Input.DateTime(value: SubtypeExprOrValue<DateTimeType>, style?: InputStyle): ExprType<UIComponentType>` | DateTime input | `Input.DateTime(new Date())` |

**InputStyle Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `placeholder` | `SubtypeExprOrValue<StringType>` | Placeholder text |
| `disabled` | `SubtypeExprOrValue<BooleanType>` | Disabled state |
| `readOnly` | `SubtypeExprOrValue<BooleanType>` | Read-only state |
| `size` | `SubtypeExprOrValue<SizeType> \| SizeLiteral` | Input size |
| `variant` | `SubtypeExprOrValue<InputVariantType> \| InputVariantLiteral` | "outline", "subtle", "flushed" |

---

### Select

Dropdown selection component.

```typescript
import { Select } from "@elaraai/east-ui";

const select = Select.Root([
    Select.Item("us", "United States"),
    Select.Item("uk", "United Kingdom"),
], { placeholder: "Select country" });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Select.Root(items: SelectItem[], style?: SelectStyle): ExprType<UIComponentType>` | Create select | `Select.Root([Select.Item(...)])` |
| `Select.Item(value: string, label: string): SelectItem` | Create select item | `Select.Item("us", "United States")` |

---

### Checkbox

Checkbox input component.

```typescript
import { Checkbox } from "@elaraai/east-ui";

const checkbox = Checkbox.Root("Accept terms", { checked: false, colorPalette: "blue" });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Checkbox.Root(label: SubtypeExprOrValue<StringType>, style?: CheckboxStyle): ExprType<UIComponentType>` | Create checkbox | `Checkbox.Root("Accept", { checked: true })` |

---

### Switch

Toggle switch component.

```typescript
import { Switch } from "@elaraai/east-ui";

const toggle = Switch.Root("Enable notifications", { checked: true });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Switch.Root(label: SubtypeExprOrValue<StringType>, style?: SwitchStyle): ExprType<UIComponentType>` | Create switch | `Switch.Root("Dark mode")` |

---

### Slider

Range slider component.

```typescript
import { Slider } from "@elaraai/east-ui";

const slider = Slider.Root({ min: 0, max: 100, value: 50, step: 1 });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Slider.Root(style?: SliderStyle): ExprType<UIComponentType>` | Create slider | `Slider.Root({ min: 0, max: 100 })` |

---

## Collections

### Table

Data table component with typed rows.

```typescript
import { Table, Badge } from "@elaraai/east-ui";

const data = [
    { name: "Alice", email: "alice@example.com", role: "Admin" },
    { name: "Bob", email: "bob@example.com", role: "User" },
];

// Simple: array of field names (uses field name as header)
const simple = Table.Root(data, ["name", "email", "role"]);

// With custom headers and optional rendering
const custom = Table.Root(data, {
    name: { header: "Name" },
    email: { header: "Email" },
    role: { header: "Role", render: value => Badge.Root(value, { colorPalette: "blue" }) },
}, { variant: "line", striped: true });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Table.Root<T>(data: T, columns: ColumnSpec<T>, style?: TableStyle): ExprType<UIComponentType>` | Create table from data array | `Table.Root(data, ["name", "age"])` |
| `Table.Types.Root` | East StructType for Table component | `Table.Types.Root` |
| `Table.Types.Style` | East StructType for Table style | `Table.Types.Style` |
| `Table.Types.Column` | East StructType for table column | `Table.Types.Column` |
| `Table.Types.Cell` | East StructType for table cell | `Table.Types.Cell` |

**Parameters:**
- `data` - Array of struct data (e.g., `[{ name: "Alice", age: 30n }]`)
- `columns` - Array of field names `["name", "email"]` OR object config `{ name: { header: "Name", render?: val => ... } }`
- `style` - Optional table styling

**TableColumnConfig Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `header` | `SubtypeExprOrValue<StringType>` | Column header text (defaults to field name) |
| `render` | `(value: ExprType<FieldType>) => ExprType<UIComponentType>` | Custom render function |

**TableStyle Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `variant` | `SubtypeExprOrValue<TableVariantType> \| TableVariantLiteral` | "simple", "line", "outline" |
| `size` | `SubtypeExprOrValue<TableSizeType> \| TableSizeLiteral` | "sm", "md", "lg" |
| `striped` | `SubtypeExprOrValue<BooleanType>` | Alternating row colors |
| `interactive` | `SubtypeExprOrValue<BooleanType>` | Hover effects |
| `stickyHeader` | `SubtypeExprOrValue<BooleanType>` | Sticky header |
| `showColumnBorder` | `SubtypeExprOrValue<BooleanType>` | Column borders |
| `colorPalette` | `SubtypeExprOrValue<ColorSchemeType> \| ColorSchemeLiteral` | Color scheme |

---

### Gantt

Gantt chart for project timelines.

```typescript
import { Gantt } from "@elaraai/east-ui";

const gantt = Gantt.Root(
    [
        { task: "Design", start: new Date("2024-01-01"), end: new Date("2024-01-15") },
        { task: "Development", start: new Date("2024-01-10"), end: new Date("2024-02-01") },
    ],
    { task: { header: "Task" } },
    row => [
        Gantt.Task({ start: row.start, end: row.end, colorPalette: "blue" }),
    ],
    { variant: "line", showToday: true }
);

// With milestones
const withMilestones = Gantt.Root(
    [{ name: "Sprint 1", start: new Date("2024-01-01"), end: new Date("2024-01-14"), release: new Date("2024-01-14") }],
    { name: { header: "Sprint" } },
    row => [
        Gantt.Task({ start: row.start, end: row.end }),
        Gantt.Milestone({ date: row.release, label: "Release", colorPalette: "green" }),
    ]
);
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Gantt.Root<T>(data: T, columns: ColumnSpec<T>, events: (row) => GanttEvent[], style?: GanttStyle): ExprType<UIComponentType>` | Create Gantt chart | `Gantt.Root(data, {...}, row => [...])` |
| `Gantt.Task(input: TaskInput): GanttEvent` | Create task bar | `Gantt.Task({ start, end })` |
| `Gantt.Milestone(input: MilestoneInput): GanttEvent` | Create milestone marker | `Gantt.Milestone({ date, label })` |

**TaskInput Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `start` | `SubtypeExprOrValue<DateTimeType>` | Start date |
| `end` | `SubtypeExprOrValue<DateTimeType>` | End date |
| `label` | `SubtypeExprOrValue<StringType>` | Optional label on task bar |
| `progress` | `SubtypeExprOrValue<IntegerType>` | Progress percentage (0-100) |
| `colorPalette` | `SubtypeExprOrValue<ColorSchemeType> \| ColorSchemeLiteral` | Color scheme |

**MilestoneInput Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `date` | `SubtypeExprOrValue<DateTimeType>` | Milestone date |
| `label` | `SubtypeExprOrValue<StringType>` | Optional label |
| `colorPalette` | `SubtypeExprOrValue<ColorSchemeType> \| ColorSchemeLiteral` | Color scheme |

---

### DataList

Key-value data display.

```typescript
import { DataList } from "@elaraai/east-ui";

const list = DataList.Root([
    DataList.Item("Name", "Alice"),
    DataList.Item("Email", "alice@example.com"),
], { orientation: "horizontal" });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `DataList.Root(items: DataListItem[], style?: DataListStyle): ExprType<UIComponentType>` | Create data list | `DataList.Root([...])` |
| `DataList.Item(label: string, value: SubtypeExprOrValue<StringType>): DataListItem` | Create data list item | `DataList.Item("Name", "Alice")` |

---

### TreeView

Hierarchical tree display.

```typescript
import { TreeView } from "@elaraai/east-ui";

const tree = TreeView.Root([
    TreeView.Branch("folder-1", "Documents", [
        TreeView.Item("file-1", "Resume.pdf"),
        TreeView.Item("file-2", "Cover Letter.docx"),
    ]),
    TreeView.Item("file-3", "README.md"),
]);
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `TreeView.Root(nodes: TreeNode[], style?: TreeViewStyle): ExprType<UIComponentType>` | Create tree view | `TreeView.Root([...])` |
| `TreeView.Branch(value: string, label: string, children: TreeNode[], style?: BranchStyle): TreeNode` | Create branch node | `TreeView.Branch("id", "Folder", [...])` |
| `TreeView.Item(value: string, label: string, style?: ItemStyle): TreeNode` | Create leaf node | `TreeView.Item("id", "File.txt")` |

---

## Charts

Access all charts through the `Chart` namespace.

### Chart.Line

```typescript
import { Chart } from "@elaraai/east-ui";

const lineChart = Chart.Line(
    [
        { month: "Jan", revenue: 186 },
        { month: "Feb", revenue: 305 },
    ],
    { revenue: { color: "teal.solid" } },
    {
        xAxis: Chart.Axis({ dataKey: "month" }),
        grid: Chart.Grid({ show: true }),
    }
);
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Chart.Line<T>(data: T, series: SeriesConfig, style?: ChartStyle): ExprType<UIComponentType>` | Create line chart | `Chart.Line(data, { revenue: {...} })` |
| `Chart.Bar<T>(data: T, series: SeriesConfig, style?: BarChartStyle): ExprType<UIComponentType>` | Create bar chart | `Chart.Bar(data, { value: {...} })` |
| `Chart.Area<T>(data: T, series: SeriesConfig, style?: ChartStyle): ExprType<UIComponentType>` | Create area chart | `Chart.Area(data, {...})` |
| `Chart.Scatter<T>(data: T, series: SeriesConfig, style?: ChartStyle): ExprType<UIComponentType>` | Create scatter chart | `Chart.Scatter(data, {...})` |
| `Chart.Pie<T>(data: T, style?: PieChartStyle): ExprType<UIComponentType>` | Create pie chart | `Chart.Pie(data, {...})` |
| `Chart.Radar<T>(data: T, series: SeriesConfig, style?: ChartStyle): ExprType<UIComponentType>` | Create radar chart | `Chart.Radar(data, {...})` |
| `Chart.BarList<T>(data: T, style?: BarListStyle): ExprType<UIComponentType>` | Create bar list | `Chart.BarList(data)` |
| `Chart.BarSegment<T>(data: T, style?: BarSegmentStyle): ExprType<UIComponentType>` | Create bar segment | `Chart.BarSegment(data)` |

**Chart Helpers:**

| Signature | Description | Example |
|-----------|-------------|---------|
| `Chart.Axis(options: AxisConfig): AxisConfig` | Create axis configuration | `Chart.Axis({ dataKey: "month" })` |
| `Chart.Grid(options: GridConfig): GridConfig` | Create grid configuration | `Chart.Grid({ show: true })` |
| `Chart.Legend(options: LegendConfig): LegendConfig` | Create legend configuration | `Chart.Legend({ show: true })` |
| `Chart.Tooltip(options: TooltipConfig): TooltipConfig` | Create tooltip configuration | `Chart.Tooltip({ show: true })` |
| `Chart.TickFormat.Number(options): TickFormatter` | Number tick formatter | `Chart.TickFormat.Number({ compact: true })` |
| `Chart.TickFormat.Currency(options): TickFormatter` | Currency tick formatter | `Chart.TickFormat.Currency({ currency: "USD" })` |
| `Chart.TickFormat.Percent(options): TickFormatter` | Percent tick formatter | `Chart.TickFormat.Percent()` |
| `Chart.TickFormat.Date(options): TickFormatter` | Date tick formatter | `Chart.TickFormat.Date({ format: "MMM" })` |

---

### Sparkline

Compact inline trend visualization.

```typescript
import { Sparkline } from "@elaraai/east-ui";

const trend = Sparkline.Root([1.2, 2.4, 1.8, 3.1, 2.9], {
    type: "area",
    color: "teal.500",
});
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Sparkline.Root(data: number[], style?: SparklineStyle): ExprType<UIComponentType>` | Create sparkline | `Sparkline.Root([1, 2, 3])` |

---

## Display

### Badge

```typescript
import { Badge } from "@elaraai/east-ui";

const badge = Badge.Root("New", { variant: "solid", colorPalette: "green" });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Badge.Root(label: SubtypeExprOrValue<StringType>, style?: BadgeStyle): ExprType<UIComponentType>` | Create badge | `Badge.Root("Active", { colorPalette: "blue" })` |

---

### Tag

```typescript
import { Tag } from "@elaraai/east-ui";

const tag = Tag.Root("JavaScript", { variant: "subtle", closable: true });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Tag.Root(label: SubtypeExprOrValue<StringType>, style?: TagStyle): ExprType<UIComponentType>` | Create tag | `Tag.Root("React", { closable: true })` |

---

### Avatar

```typescript
import { Avatar } from "@elaraai/east-ui";

const avatar = Avatar.Root("AB", { name: "Alice Brown", src: "https://..." });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Avatar.Root(fallback: SubtypeExprOrValue<StringType>, style?: AvatarStyle): ExprType<UIComponentType>` | Create avatar | `Avatar.Root("AB", { name: "Alice" })` |

---

### Stat

Key metric display with optional trend indicator.

```typescript
import { Stat } from "@elaraai/east-ui";

// Simple stat
const revenue = Stat.Root("Revenue", "$45,000");

// With help text and trend indicator
const growth = Stat.Root("Growth", "+23.5%", {
    helpText: "vs last month",
    indicator: "up",
});

// Dynamic indicator based on data
const metric = Stat.Root("Profit", East.str`$${East.print(value)}`, {
    indicator: East.greater(value, 0.0).ifElse(
        $ => Stat.Indicator("up"),
        $ => Stat.Indicator("down")
    ),
});
```

| Signature | Description |
|-----------|-------------|
| `Stat.Root(label, value, style?): ExprType<UIComponentType>` | Create stat display |
| `Stat.Indicator(direction): ExprType<StatIndicatorType>` | Create indicator value ("up" or "down") |

**StatStyle Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `helpText` | `SubtypeExprOrValue<StringType>` | Help text or trend description |
| `indicator` | `SubtypeExprOrValue<StatIndicatorType> \| "up" \| "down"` | Trend indicator direction |

---

### Icon

```typescript
import { Icon } from "@elaraai/east-ui";

const icon = Icon.Root("check", { size: "lg", color: "green.500" });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Icon.Root(name: SubtypeExprOrValue<StringType>, style?: IconStyle): ExprType<UIComponentType>` | Create icon | `Icon.Root("search")` |

---

## Feedback

### Alert

```typescript
import { Alert } from "@elaraai/east-ui";

const alert = Alert.Root({ status: "success", title: "Saved", description: "Changes saved successfully" });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Alert.Root(style?: AlertStyle): ExprType<UIComponentType>` | Create alert | `Alert.Root({ status: "error", title: "Error" })` |

**AlertStyle Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `status` | `SubtypeExprOrValue<AlertStatusType> \| AlertStatusLiteral` | "info", "warning", "error", "success" |
| `title` | `SubtypeExprOrValue<StringType>` | Alert title |
| `description` | `SubtypeExprOrValue<StringType>` | Alert description |
| `variant` | `SubtypeExprOrValue<AlertVariantType> \| AlertVariantLiteral` | "subtle", "solid", "outline" |

---

### Progress

Progress bar for displaying completion status.

```typescript
import { Progress } from "@elaraai/east-ui";

// Simple progress
const progress = Progress.Root(75.0);

// Styled progress
const styled = Progress.Root(60.0, {
    colorPalette: "green",
    size: "md",
    striped: true,
});

// Dynamic progress from data
const dynamic = Progress.Root(task.completion.toFloat(), {
    colorPalette: "blue",
});
```

| Signature | Description |
|-----------|-------------|
| `Progress.Root(value, style?): ExprType<UIComponentType>` | Create progress bar |

**ProgressStyle Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `min` | `SubtypeExprOrValue<FloatType>` | Minimum value (default 0) |
| `max` | `SubtypeExprOrValue<FloatType>` | Maximum value (default 100) |
| `colorPalette` | `SubtypeExprOrValue<ColorSchemeType> \| ColorSchemeLiteral` | Color scheme |
| `size` | `SubtypeExprOrValue<SizeType> \| SizeLiteral` | Size variant |
| `striped` | `SubtypeExprOrValue<BooleanType>` | Show striped pattern |
| `animated` | `SubtypeExprOrValue<BooleanType>` | Animate the progress |
| `label` | `SubtypeExprOrValue<StringType>` | Label text |
| `valueText` | `SubtypeExprOrValue<StringType>` | Value display text |

---

## Disclosure

### Accordion

```typescript
import { Accordion, Text } from "@elaraai/east-ui";

const accordion = Accordion.Root([
    Accordion.Item("section-1", "Section 1", [Text.Root("Content 1")]),
    Accordion.Item("section-2", "Section 2", [Text.Root("Content 2")]),
], { variant: "enclosed", collapsible: true });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Accordion.Root(items: AccordionItem[], style?: AccordionStyle): ExprType<UIComponentType>` | Create accordion | `Accordion.Root([...])` |
| `Accordion.Item(value: string, trigger: string, content: UIComponent[], style?: ItemStyle): AccordionItem` | Create accordion item | `Accordion.Item("id", "Title", [...])` |

---

### Tabs

```typescript
import { Tabs, Text } from "@elaraai/east-ui";

const tabs = Tabs.Root([
    Tabs.Tab("tab-1", "Overview", [Text.Root("Overview content")]),
    Tabs.Tab("tab-2", "Details", [Text.Root("Details content")]),
], { variant: "line", fitted: true });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Tabs.Root(items: TabItem[], style?: TabsStyle): ExprType<UIComponentType>` | Create tabs | `Tabs.Root([...])` |
| `Tabs.Tab(value: string, trigger: string, content: UIComponent[], style?: TabStyle): TabItem` | Create tab item | `Tabs.Tab("id", "Label", [...])` |

---

### Carousel

```typescript
import { Carousel, Text } from "@elaraai/east-ui";

const carousel = Carousel.Root([
    Text.Root("Slide 1"),
    Text.Root("Slide 2"),
], { loop: true, autoplay: true, showIndicators: true });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Carousel.Root(items: UIComponent[], style?: CarouselStyle): ExprType<UIComponentType>` | Create carousel | `Carousel.Root([...], { loop: true })` |

---

## Overlays

### Dialog

```typescript
import { Dialog, Button, Text } from "@elaraai/east-ui";

const dialog = Dialog.Root(
    Button.Root("Open Dialog"),
    [Text.Root("Dialog content")],
    { title: "Confirm Action", size: "md" }
);
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Dialog.Root(trigger: UIComponent, body: UIComponent[], style?: DialogStyle): ExprType<UIComponentType>` | Create dialog | `Dialog.Root(Button.Root("Open"), [...])` |

---

### Drawer

```typescript
import { Drawer, Button, Text } from "@elaraai/east-ui";

const drawer = Drawer.Root(
    Button.Root("Open Drawer"),
    [Text.Root("Drawer content")],
    { title: "Settings", placement: "end" }
);
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Drawer.Root(trigger: UIComponent, body: UIComponent[], style?: DrawerStyle): ExprType<UIComponentType>` | Create drawer | `Drawer.Root(Button.Root("Open"), [...])` |

---

### Tooltip

```typescript
import { Tooltip, Button } from "@elaraai/east-ui";

const tooltip = Tooltip.Root(Button.Root("Hover me"), "Helpful information");
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Tooltip.Root(trigger: UIComponent, content: SubtypeExprOrValue<StringType>, style?: TooltipStyle): ExprType<UIComponentType>` | Create tooltip | `Tooltip.Root(Button.Root("?"), "Help text")` |

---

### Popover

```typescript
import { Popover, Button, Text } from "@elaraai/east-ui";

const popover = Popover.Root(
    Button.Root("Click me"),
    [Text.Root("Popover content")],
    { title: "More Info", placement: "bottom" }
);
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Popover.Root(trigger: UIComponent, body: UIComponent[], style?: PopoverStyle): ExprType<UIComponentType>` | Create popover | `Popover.Root(Button.Root("Info"), [...])` |

---

### Menu

```typescript
import { Menu, Button } from "@elaraai/east-ui";

const menu = Menu.Root(Button.Root("Actions"), [
    Menu.Item("edit", "Edit"),
    Menu.Separator(),
    Menu.Item("delete", "Delete"),
]);
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Menu.Root(trigger: UIComponent, items: MenuItem[], style?: MenuStyle): ExprType<UIComponentType>` | Create menu | `Menu.Root(Button.Root("..."), [...])` |
| `Menu.Item(value: string, label: string, style?: ItemStyle): MenuItem` | Create menu item | `Menu.Item("edit", "Edit")` |
| `Menu.Separator(): MenuItem` | Create separator | `Menu.Separator()` |

---

## Container

### Card

Content card with header and body.

```typescript
import { Card, Text } from "@elaraai/east-ui";

const card = Card.Root([
    Text.Root("Card content here"),
], { title: "Card Title", description: "Optional description", variant: "elevated" });
```

| Signature | Description | Example |
|-----------|-------------|---------|
| `Card.Root(body: UIComponent[], style?: CardStyle): ExprType<UIComponentType>` | Create card | `Card.Root([...], { title: "Title" })` |

**CardStyle Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `title` | `SubtypeExprOrValue<StringType>` | Card title |
| `description` | `SubtypeExprOrValue<StringType>` | Card description |
| `variant` | `SubtypeExprOrValue<CardVariantType> \| CardVariantLiteral` | "elevated", "outline", "subtle" |
| `size` | `SubtypeExprOrValue<SizeType> \| SizeLiteral` | Card size |

---

## License

Dual-licensed under AGPL-3.0 (open source) and commercial license. See [LICENSE.md](LICENSE.md).
