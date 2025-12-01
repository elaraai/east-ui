# East UI Usage Guide

Usage guide for East UI component definitions.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Component Pattern](#component-pattern)
- [Layout Components](#layout-components)
  - [Box](#box)
  - [Stack, HStack, VStack](#stack-hstack-vstack)
  - [Grid](#grid)
  - [Splitter](#splitter)
  - [Separator](#separator)
- [Typography](#typography)
  - [Text](#text)
- [Buttons](#buttons)
  - [Button](#button)
  - [IconButton](#iconbutton)
- [Forms](#forms)
  - [Input](#input)
  - [Select](#select)
  - [Checkbox](#checkbox)
  - [Switch](#switch)
  - [Slider](#slider)
  - [Textarea](#textarea)
  - [TagsInput](#tagsinput)
  - [FileUpload](#fileupload)
  - [Field](#field)
  - [Fieldset](#fieldset)
- [Collections](#collections)
  - [Table](#table)
  - [DataList](#datalist)
  - [TreeView](#treeview)
- [Charts](#charts)
  - [Area Chart](#area-chart)
  - [Bar Chart](#bar-chart)
  - [Line Chart](#line-chart)
  - [Pie Chart](#pie-chart)
  - [Radar Chart](#radar-chart)
  - [Scatter Chart](#scatter-chart)
  - [Sparkline](#sparkline)
  - [BarList](#barlist)
  - [BarSegment](#barsegment)
- [Display Components](#display-components)
  - [Badge](#badge)
  - [Tag](#tag)
  - [Avatar](#avatar)
  - [Stat](#stat)
  - [Icon](#icon)
- [Feedback](#feedback)
  - [Alert](#alert)
  - [Progress](#progress)
- [Disclosure](#disclosure)
  - [Accordion](#accordion)
  - [Tabs](#tabs)
  - [Carousel](#carousel)
- [Overlays](#overlays)
  - [Dialog](#dialog)
  - [Drawer](#drawer)
  - [Popover](#popover)
  - [Tooltip](#tooltip)
  - [Menu](#menu)
  - [HoverCard](#hovercard)
- [Container](#container)
  - [Card](#card)
- [State Management](#state-management)
- [Styling](#styling)

---

## Quick Start

```typescript
import { East, ArrayType } from "@elaraai/east";
import { Stack, Text, Button, UIComponentType, variant } from "@elaraai/east-ui";

// Define a UI component function
const MyComponent = East.function(
    [],
    UIComponentType,
    $ => {
        return Stack.Root([
            Text.Root("Hello, World!", {
                fontSize: "2xl",
                fontWeight: "bold"
            }),
            Button.Root("Click Me", {
                variant: "solid",
                colorPalette: "blue"
            }),
        ], {
            gap: "4",
            direction: "column"
        });
    }
);

// Convert to IR for serialization
const ir = MyComponent.toIR();
```

---

## Component Pattern

All East UI components follow a consistent namespace pattern:

```typescript
import { ComponentName } from "@elaraai/east-ui";

// Create component using .Root()
const component = ComponentName.Root(/* args */, { /* style options */ });

// Access East types via .Types
const componentType = ComponentName.Types.Component;
const styleType = ComponentName.Types.Style;
```

**Key patterns:**
- `Component.Root(...)` - Main factory function
- `Component.Types.Component` - East type for the component
- `Component.Types.Style` - East type for component styling
- `Component.Item(...)` - Sub-component factory (for compound components)

---

## Layout Components

### Box

Generic container with flexible styling.

**Import:**
```typescript
import { Box } from "@elaraai/east-ui";
```

**Signature:**
```typescript
Box.Root(
    children: UIComponent[],
    style?: BoxStyle
): UIComponent
```

**Style Options:**
| Property | Type | Description |
|----------|------|-------------|
| `padding` | `PaddingType \| string` | Padding (e.g., "4", { x: "2", y: "4" }) |
| `margin` | `MarginType \| string` | Margin |
| `background` | `string` | Background color |
| `borderRadius` | `string` | Border radius |
| `width` | `string` | Width |
| `height` | `string` | Height |
| `minHeight` | `string` | Minimum height |

**Example:**
```typescript
const container = Box.Root([
    Text.Root("Content inside box"),
], {
    padding: "4",
    background: "gray.100",
    borderRadius: "md",
});
```

---

### Stack, HStack, VStack

Flexbox-based stack layout components.

**Import:**
```typescript
import { Stack, HStack, VStack } from "@elaraai/east-ui";
```

**Signatures:**
```typescript
Stack.Root(children: UIComponent[], style?: StackStyle): UIComponent
HStack(children: UIComponent[], style?: StackStyle): UIComponent  // Horizontal
VStack(children: UIComponent[], style?: StackStyle): UIComponent  // Vertical
```

**Style Options:**
| Property | Type | Description |
|----------|------|-------------|
| `gap` | `string` | Gap between items (e.g., "2", "4") |
| `direction` | `"row" \| "column"` | Flex direction |
| `align` | `AlignItemsType` | Align items |
| `justify` | `JustifyContentType` | Justify content |
| `wrap` | `"wrap" \| "nowrap"` | Flex wrap |
| `padding` | `PaddingType \| string` | Padding |

**Example:**
```typescript
// Vertical stack with gap
const vertical = VStack([
    Text.Root("Item 1"),
    Text.Root("Item 2"),
    Text.Root("Item 3"),
], { gap: "4" });

// Horizontal stack centered
const horizontal = HStack([
    Button.Root("Left"),
    Button.Root("Right"),
], { gap: "2", justify: "center" });
```

---

### Grid

CSS Grid layout component.

**Import:**
```typescript
import { Grid } from "@elaraai/east-ui";
```

**Signatures:**
```typescript
Grid.Root(children: UIComponent[], style?: GridStyle): UIComponent
Grid.Item(children: UIComponent[], style?: GridItemStyle): UIComponent
```

**Style Options:**
| Property | Type | Description |
|----------|------|-------------|
| `templateColumns` | `string` | Grid template columns (e.g., "repeat(3, 1fr)") |
| `templateRows` | `string` | Grid template rows |
| `gap` | `string` | Gap between cells |
| `alignItems` | `AlignItemsType` | Align items |

**Example:**
```typescript
const grid = Grid.Root([
    Grid.Item([Text.Root("Cell 1")], { colSpan: 2 }),
    Grid.Item([Text.Root("Cell 2")]),
    Grid.Item([Text.Root("Cell 3")]),
], {
    templateColumns: "repeat(3, 1fr)",
    gap: "4",
});
```

---

### Splitter

Resizable split pane layout.

**Import:**
```typescript
import { Splitter } from "@elaraai/east-ui";
```

**Signatures:**
```typescript
Splitter.Root(panels: SplitterPanel[], style?: SplitterStyle): UIComponent
Splitter.Panel(children: UIComponent[], style?: PanelStyle): SplitterPanel
```

**Example:**
```typescript
const split = Splitter.Root([
    Splitter.Panel([Text.Root("Left panel")], { id: "left", size: 50 }),
    Splitter.Panel([Text.Root("Right panel")], { id: "right", size: 50 }),
], { orientation: "horizontal" });
```

---

### Separator

Visual divider between content.

**Import:**
```typescript
import { Separator } from "@elaraai/east-ui";
```

**Signature:**
```typescript
Separator.Root(style?: SeparatorStyle): UIComponent
```

**Example:**
```typescript
const layout = VStack([
    Text.Root("Section 1"),
    Separator.Root({ orientation: "horizontal" }),
    Text.Root("Section 2"),
], { gap: "4" });
```

---

## Typography

### Text

Text display with comprehensive styling.

**Import:**
```typescript
import { Text } from "@elaraai/east-ui";
```

**Signature:**
```typescript
Text.Root(
    content: string | StringExpr,
    style?: TextStyle
): UIComponent
```

**Style Options:**
| Property | Type | Description |
|----------|------|-------------|
| `fontSize` | `string` | Size: "xs", "sm", "md", "lg", "xl", "2xl", etc. |
| `fontWeight` | `FontWeightType \| string` | Weight: "normal", "medium", "semibold", "bold" |
| `color` | `string` | Text color |
| `textAlign` | `TextAlignType \| string` | Alignment: "left", "center", "right" |
| `lineClamp` | `number` | Truncate to N lines |

**Example:**
```typescript
// Simple text
const simple = Text.Root("Hello, World!");

// Styled text
const styled = Text.Root("Important Message", {
    fontSize: "xl",
    fontWeight: "bold",
    color: "blue.600",
    textAlign: "center",
});

// Dynamic text
const dynamic = Text.Root(East.str`Hello, ${name}!`, {
    fontSize: "lg",
});
```

---

## Buttons

### Button

Interactive button component.

**Import:**
```typescript
import { Button } from "@elaraai/east-ui";
```

**Signature:**
```typescript
Button.Root(
    label: string | StringExpr,
    style?: ButtonStyle
): UIComponent
```

**Style Options:**
| Property | Type | Description |
|----------|------|-------------|
| `variant` | `"solid" \| "subtle" \| "outline" \| "ghost"` | Visual variant |
| `colorPalette` | `string` | Color: "gray", "blue", "red", "green", etc. |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | Button size |
| `disabled` | `boolean` | Disabled state |
| `loading` | `boolean` | Loading state |

**Example:**
```typescript
// Primary button
const primary = Button.Root("Submit", {
    variant: "solid",
    colorPalette: "blue",
});

// Danger button
const danger = Button.Root("Delete", {
    variant: "solid",
    colorPalette: "red",
});

// Ghost button
const ghost = Button.Root("Cancel", {
    variant: "ghost",
});
```

---

### IconButton

Button with icon instead of text.

**Import:**
```typescript
import { IconButton } from "@elaraai/east-ui";
```

**Signature:**
```typescript
IconButton.Root(
    icon: string,
    style?: IconButtonStyle
): UIComponent
```

**Example:**
```typescript
const menuButton = IconButton.Root("menu", {
    variant: "ghost",
    size: "sm",
    ariaLabel: "Open menu",
});
```

---

## Forms

### Input

Text input with multiple types.

**Import:**
```typescript
import { Input } from "@elaraai/east-ui";
```

**Signatures:**
```typescript
Input.String(style?: StringInputStyle): UIComponent
Input.Integer(style?: IntegerInputStyle): UIComponent
Input.Float(style?: FloatInputStyle): UIComponent
Input.DateTime(style?: DateTimeInputStyle): UIComponent
```

**Style Options:**
| Property | Type | Description |
|----------|------|-------------|
| `placeholder` | `string` | Placeholder text |
| `value` | `string \| number` | Current value |
| `disabled` | `boolean` | Disabled state |
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | Input size |
| `variant` | `"outline" \| "subtle" \| "flushed"` | Visual variant |

**Example:**
```typescript
const form = VStack([
    Input.String({ placeholder: "Enter name", size: "md" }),
    Input.Integer({ placeholder: "Enter age" }),
    Input.Float({ placeholder: "Enter amount" }),
    Input.DateTime({ placeholder: "Select date" }),
], { gap: "4" });
```

---

### Select

Dropdown selection component.

**Import:**
```typescript
import { Select } from "@elaraai/east-ui";
```

**Signatures:**
```typescript
Select.Root(items: SelectItem[], style?: SelectStyle): UIComponent
Select.Item(value: string, label: string): SelectItem
```

**Example:**
```typescript
const countrySelect = Select.Root([
    Select.Item("us", "United States"),
    Select.Item("uk", "United Kingdom"),
    Select.Item("au", "Australia"),
], {
    placeholder: "Select country",
    size: "md",
});
```

---

### Checkbox

Checkbox input component.

**Import:**
```typescript
import { Checkbox } from "@elaraai/east-ui";
```

**Signature:**
```typescript
Checkbox.Root(
    label: string,
    style?: CheckboxStyle
): UIComponent
```

**Example:**
```typescript
const checkbox = Checkbox.Root("I agree to the terms", {
    checked: false,
    colorPalette: "blue",
});
```

---

### Switch

Toggle switch component.

**Import:**
```typescript
import { Switch } from "@elaraai/east-ui";
```

**Signature:**
```typescript
Switch.Root(
    label: string,
    style?: SwitchStyle
): UIComponent
```

**Example:**
```typescript
const toggle = Switch.Root("Enable notifications", {
    checked: true,
    colorPalette: "green",
});
```

---

### Slider

Range slider component.

**Import:**
```typescript
import { Slider } from "@elaraai/east-ui";
```

**Signature:**
```typescript
Slider.Root(style?: SliderStyle): UIComponent
```

**Example:**
```typescript
const volumeSlider = Slider.Root({
    min: 0,
    max: 100,
    value: 50,
    step: 1,
    colorPalette: "blue",
});
```

---

## Collections

### Table

Data table component with typed rows.

**Import:**
```typescript
import { Table } from "@elaraai/east-ui";
```

**Signatures:**
```typescript
Table.Root<T, Fields>(
    data: ArrayExpr<T>,
    rowBuilder: ($, row) => TableRow<Fields>,
    style?: TableStyle
): ArrayExpr<TableRow<Fields>>

Table.Row<Fields>(
    cells: Record<string, TableCell>,
    style?: TableRowStyle
): TableRow<Fields>

Table.Cell<T>(
    value: Expr<T>,
    style?: TableCellStyle
): TableCell<T>
```

**Example:**
```typescript
const PersonType = StructType({
    id: StringType,
    name: StringType,
    age: IntegerType,
});

const table = Table.Root(
    people,
    ($, row) => Table.Row({
        name: Table.Cell(row.name),
        age: Table.Cell(row.age, { textAlign: "right" }),
    }, { key: row.id }),
    { variant: "striped", size: "md" }
);
```

---

### DataList

Key-value data display.

**Import:**
```typescript
import { DataList } from "@elaraai/east-ui";
```

**Signatures:**
```typescript
DataList.Root(items: DataListItem[], style?: DataListStyle): UIComponent
DataList.Item(label: string, value: string | UIComponent): DataListItem
```

**Example:**
```typescript
const details = DataList.Root([
    DataList.Item("Name", "John Doe"),
    DataList.Item("Email", "john@example.com"),
    DataList.Item("Status", Badge.Root("Active", { colorPalette: "green" })),
], { orientation: "horizontal" });
```

---

### TreeView

Hierarchical tree display.

**Import:**
```typescript
import { TreeView } from "@elaraai/east-ui";
```

**Example:**
```typescript
const fileTree = TreeView.Root([
    TreeView.Branch("src", [
        TreeView.Item("index.ts"),
        TreeView.Item("utils.ts"),
    ]),
    TreeView.Branch("test", [
        TreeView.Item("index.test.ts"),
    ]),
]);
```

---

## Charts

All charts follow a similar pattern with data series and styling options.

### Area Chart

**Import:**
```typescript
import { Chart } from "@elaraai/east-ui";
```

**Example:**
```typescript
const areaChart = Chart.Area.Root(data, [
    Chart.Area.Series("revenue", { color: "blue.500" }),
    Chart.Area.Series("profit", { color: "green.500" }),
], {
    xAxis: { dataKey: "month" },
    grid: true,
    legend: true,
    stacked: true,
});
```

---

### Bar Chart

**Example:**
```typescript
const barChart = Chart.Bar.Root(data, [
    Chart.Bar.Series("sales", { color: "blue.500" }),
], {
    xAxis: { dataKey: "category" },
    layout: "horizontal",  // or "vertical" for horizontal bars
});
```

---

### Line Chart

**Example:**
```typescript
const lineChart = Chart.Line.Root(data, [
    Chart.Line.Series("temperature", { color: "red.500", curve: "natural" }),
], {
    xAxis: { dataKey: "time" },
    dots: true,
    grid: true,
});
```

---

### Pie Chart

**Example:**
```typescript
const pieChart = Chart.Pie.Root(data, {
    dataKey: "value",
    nameKey: "name",
    innerRadius: 60,  // Makes it a donut chart
    legend: true,
});
```

---

### Sparkline

Compact inline chart.

**Example:**
```typescript
const sparkline = Chart.Sparkline.Root([10, 20, 15, 30, 25], {
    type: "line",  // or "area"
    color: "blue.500",
    height: "32px",
});
```

---

## Display Components

### Badge

Status indicator badge.

**Import:**
```typescript
import { Badge } from "@elaraai/east-ui";
```

**Signature:**
```typescript
Badge.Root(
    label: string,
    style?: BadgeStyle
): UIComponent
```

**Example:**
```typescript
const statusBadge = Badge.Root("Active", {
    variant: "solid",
    colorPalette: "green",
});
```

---

### Tag

Labeled tag with optional close button.

**Import:**
```typescript
import { Tag } from "@elaraai/east-ui";
```

**Example:**
```typescript
const tag = Tag.Root("TypeScript", {
    variant: "subtle",
    colorPalette: "blue",
    closable: true,
});
```

---

### Stat

Statistic display with label and value.

**Import:**
```typescript
import { Stat } from "@elaraai/east-ui";
```

**Example:**
```typescript
const stat = Stat.Root({
    label: "Total Revenue",
    value: "$45,231",
    helpText: "+20.1% from last month",
    indicator: "increase",
});
```

---

### Icon

Icon display component.

**Import:**
```typescript
import { Icon } from "@elaraai/east-ui";
```

**Example:**
```typescript
const icon = Icon.Root("check", {
    size: "lg",
    color: "green.500",
});
```

---

## Feedback

### Alert

Alert/notification component.

**Import:**
```typescript
import { Alert } from "@elaraai/east-ui";
```

**Example:**
```typescript
const alert = Alert.Root({
    status: "success",  // "info" | "warning" | "error" | "success"
    title: "Success!",
    description: "Your changes have been saved.",
});
```

---

### Progress

Progress indicator.

**Import:**
```typescript
import { Progress } from "@elaraai/east-ui";
```

**Example:**
```typescript
const progress = Progress.Root({
    value: 75,
    colorPalette: "blue",
    size: "md",
    striped: true,
});
```

---

## Disclosure

### Accordion

Expandable content panels.

**Import:**
```typescript
import { Accordion } from "@elaraai/east-ui";
```

**Example:**
```typescript
const faq = Accordion.Root([
    Accordion.Item("faq-1", "What is East?", [
        Text.Root("East is a typed expression language..."),
    ]),
    Accordion.Item("faq-2", "How do I install?", [
        Text.Root("Run: npm install @elaraai/east"),
    ]),
], {
    variant: "enclosed",
    collapsible: true,
});
```

---

### Tabs

Tabbed content panels.

**Import:**
```typescript
import { Tabs } from "@elaraai/east-ui";
```

**Example:**
```typescript
const tabs = Tabs.Root([
    Tabs.Tab("overview", "Overview", [
        Text.Root("Overview content..."),
    ]),
    Tabs.Tab("details", "Details", [
        Text.Root("Details content..."),
    ]),
], {
    variant: "line",
    fitted: true,
});
```

---

## Overlays

### Dialog

Modal dialog component.

**Import:**
```typescript
import { Dialog } from "@elaraai/east-ui";
```

**Example:**
```typescript
const confirmDialog = Dialog.Root({
    title: "Confirm Delete",
    body: [Text.Root("Are you sure you want to delete this item?")],
    footer: [
        Button.Root("Cancel", { variant: "ghost" }),
        Button.Root("Delete", { variant: "solid", colorPalette: "red" }),
    ],
});
```

---

### Tooltip

Hover tooltip.

**Import:**
```typescript
import { Tooltip } from "@elaraai/east-ui";
```

**Example:**
```typescript
const tooltipButton = Tooltip.Root(
    Button.Root("Hover me"),
    "This is a helpful tooltip"
);
```

---

## Container

### Card

Content card with header and body.

**Import:**
```typescript
import { Card } from "@elaraai/east-ui";
```

**Example:**
```typescript
const card = Card.Root({
    title: "Card Title",
    description: "Optional description",
    body: [
        Text.Root("Card content goes here..."),
    ],
});
```

---

## State Management

East UI provides platform functions for state management:

**Import:**
```typescript
import { State } from "@elaraai/east-ui";
```

**Functions:**
| Signature | Description |
|-----------|-------------|
| `State.read<T>(key: string, type: T, defaultValue: ValueOf<T>): Expr<T>` | Read state value |
| `State.write<T>(key: string, value: Expr<T>): NullExpr` | Write state value |

**Example:**
```typescript
const Counter = East.function([], UIComponentType, $ => {
    const count = $.let(State.read("counter", IntegerType, 0n));

    return VStack([
        Text.Root(East.str`Count: ${count}`),
        Button.Root("Increment", {
            onClick: State.write("counter", count.add(1n)),
        }),
    ], { gap: "4" });
});
```

---

## Styling

### Common Style Types

**Size:**
```typescript
import { Style } from "@elaraai/east-ui";

Style.Size("md")  // "xs" | "sm" | "md" | "lg" | "xl"
```

**ColorScheme:**
```typescript
Style.ColorScheme("blue")  // "gray" | "red" | "blue" | "green" | etc.
```

**FontWeight:**
```typescript
Style.FontWeight("bold")  // "normal" | "medium" | "semibold" | "bold"
```

**TextAlign:**
```typescript
Style.TextAlign("center")  // "left" | "center" | "right" | "justify"
```

### Padding and Margin

Structured padding/margin with directional control:

```typescript
// Simple padding
{ padding: "4" }

// Directional padding
{ padding: { x: "4", y: "2" } }
{ padding: { top: "2", bottom: "4", left: "2", right: "2" } }
```

---

## License

Dual-licensed under AGPL-3.0 (open source) and commercial license. See [LICENSE.md](LICENSE.md).
