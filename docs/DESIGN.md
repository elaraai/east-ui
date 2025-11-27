# East UI Design Document

## Overview

**East UI** provides UI component definitions for the East language. Unlike traditional UI libraries, East UI components return **typed data structures** (variants/structs) that describe the UI, rather than rendering directly. This separation allows:

1. **Portability**: UI definitions can be serialized and rendered in any environment
2. **Type Safety**: Full compile-time checking of component structure and styling
3. **Composability**: Components are just East functions that return typed values

## Core Design Principles

### 1. Components Return Data, Not DOM

Components return variant types that **describe** the UI structure. Rendering is deferred to a separate layer.

```typescript
// East UI component returns a struct describing a badge
const badge = Badge(row.status, { colorPalette: "green", variant: variant("solid", null) });
// Type: BadgeType (StructType with value, colorPalette, variant, size)
```

### 2. Style Objects Use SubtypeExprOrValue

`SubtypeExprOrValue<T>` enables ergonomic APIs by accepting **either** plain JavaScript values **or** East expressions. This eliminates verbose `East.value()` wrapping:

```typescript
// Component style interface
type BadgeStyle = {
  // Accept "green" string literal OR East.value(...) expression OR dynamic expression
  colorPalette?: SubtypeExprOrValue<ColorSchemeType> | "gray" | "red" | "green" | "blue";
  variant?: SubtypeExprOrValue<StyleVariantType> | "solid" | "subtle" | "outline";
}

// Usage - all of these work:
Badge.Root("Active", { colorPalette: "green" });                    // Plain string
Badge.Root("Active", { colorPalette: row.status.match({...}) });    // Dynamic expression
Badge.Root(row.label, { variant: "solid" });                        // Mixed
```

For variant types, add string literal unions (e.g., `| "solid" | "subtle"`) alongside `SubtypeExprOrValue<VariantType>` to enable shorthand syntax.

### 3. Variants for Component Types

Each component type is represented as a variant case, making pattern matching and rendering straightforward.

---

## Architecture

### Component Export Pattern

Each component follows a consistent export pattern with subdirectories containing separate files for component logic and style types.

#### File Structure

```
src/category/component-name/
  index.ts    # Component logic, factory functions, namespace export
  types.ts    # East types (ComponentType, ComponentStyleType) - NO import from component.ts
```

**Important:** `types.ts` must NOT import from `component.ts` to avoid circular dependencies.
The types in `types.ts` are imported by `component.ts`, so any reverse import creates a cycle.

#### Namespace Export Structure

All components export a namespace object:

```typescript
export const Component = {
    Root: createComponent,           // Main factory function
    Types: {
        Component: ComponentType,    // East StructType for component data
        Style: ComponentStyleType,   // East StructType for style data
    },
} as const;
```

**Compound components** add additional factories:
```typescript
export const Stack = {
    Root: createStack,
    HStack: createHStack,    // Convenience factory
    VStack: createVStack,    // Convenience factory
    Types: { Stack: StackType, Style: StackStyleType },
} as const;

export const Grid = {
    Root: createGrid,
    Item: createGridItem,    // Sub-component factory
    Types: { Grid: GridType, Item: GridItemType, Style: GridStyleType },
} as const;
```

#### Container vs Leaf Components

Components are categorized as **leaf** or **container** based on whether they support UI component children:

**Leaf Components** (no UI children): Badge, Tag, Avatar, Stat, Text, Button, Progress, Alert, inputs, etc.
- Their main type is defined in `types.ts`
- `component.ts` imports the type directly

**Container Components** (have UI children): Box, Stack, Card, Grid, Splitter, Accordion
- Their main type is defined **inline** in `component.ts` using `node` for recursion
- Only style types go in `types.ts`
- This is required because children need `ArrayType(node)` which only exists inside `RecursiveType`

#### types.ts Pattern

The types file contains East types that don't need `node` (the recursive UIComponentType reference). It must NOT import from `component.ts`.

```typescript
// types.ts - NO import from component.ts!
import { OptionType, StringType, StructType, VariantType, NullType } from "@elaraai/east";
import { AlignItemsType, SizeType } from "../../style.js";

// Variant type
export const ComponentVariantType = VariantType({
    solid: NullType,
    outline: NullType,
    subtle: NullType,
});
export type ComponentVariantType = typeof ComponentVariantType;

// Style type (for serialization)
export const ComponentStyleType = StructType({
    gap: OptionType(StringType),
    align: OptionType(AlignItemsType),
    variant: OptionType(ComponentVariantType),
    size: OptionType(SizeType),
});
export type ComponentStyleType = typeof ComponentStyleType;

// TypeScript interface (accepts SubtypeExprOrValue for ergonomic API)
export interface ComponentStyle {
    gap?: SubtypeExprOrValue<StringType>;
    align?: SubtypeExprOrValue<AlignItemsType> | AlignItemsLiteral;
    variant?: SubtypeExprOrValue<ComponentVariantType> | "solid" | "outline" | "subtle";
    size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
}
```

#### index.ts Pattern

The index file imports types from `types.ts` and can safely import `UIComponentType` from `component.ts`.

```typescript
// index.ts
import { East, variant, type ExprType, type SubtypeExprOrValue } from "@elaraai/east";
import { UIComponentType } from "../../component.js";  // OK - only used in function body
import { ComponentType, ComponentStyleType, type ComponentStyle } from "./types.js";

// Re-export types
export { ComponentType, ComponentStyleType, type ComponentStyle } from "./types.js";

// 1. Private factory function (converts string literals to East values)
function createComponent(
    value: SubtypeExprOrValue<StringType>,
    style?: ComponentStyle
): ExprType<UIComponentType> {
    const alignValue = style?.align
        ? (typeof style.align === "string"
            ? East.value(variant(style.align, null), AlignItemsType)
            : style.align)
        : undefined;
    // ... rest of implementation
}

// 2. Public namespace export
export const Component = {
    Root: createComponent,
    Types: { Component: ComponentType, Style: ComponentStyleType },
} as const;

// 3. Optional convenience exports
export const SubComponent = createSubComponent;
```

#### Category Index Pattern

Category index files only export namespace objects:

```typescript
// display/index.ts
export { Badge } from "./badge/index.js";
export { Tag } from "./tag/index.js";

// layout/index.ts - with convenience exports
export { Stack, HStack, VStack } from "./stack/index.js";
```

#### Usage

```typescript
import { Stack, Text, HStack } from "@elaraai/east-ui";

// Create using .Root()
const stack = Stack.Root([Text.Root("Hello")], { gap: "4" });

// Access types via .Types
const type = Stack.Types.Stack;

// Convenience exports work standalone
const row = HStack([Text.Root("A"), Text.Root("B")]);
```

See CLAUDE.md for detailed documentation standards.

### Component-Specific Types

Types specific to a component should be defined in that component's `index.ts` or `style.ts`, not in the shared `style.ts`.

**Example:**
```typescript
// src/charts/sparkline/index.ts - SparklineChartType belongs with Sparkline
export const SparklineChartType = VariantType({ line: NullType, area: NullType });
export type SparklineChartType = typeof SparklineChartType;
```

### Shared Style Types (`src/style.ts`)

The shared `style.ts` should only contain variant types genuinely reused across multiple components:

- `FontWeightType` - used by Text, Badge, Table cells, etc.
- `FontStyleType` - used by Text, Table cells, etc.
- `TextAlignType` - used by Text, Table cells, etc.
- `ColorSchemeType` - used by Badge, Progress, Button, etc.
- `SizeType` - used by Badge, Button, Table, etc.
- `StyleVariantType` - used by Badge, Button, etc. (subtle/solid/outline)
- `OrientationType` - used by Slider, Stack, Splitter, etc.
- `FlexDirectionType`, `AlignItemsType`, `JustifyContentType` - layout components

### Compound Components

When Chakra UI uses compound components, East UI mirrors that structure:
- Main type for the complete component (e.g., `GridType`)
- Sub-component types (e.g., `GridItemType`)
- Factory functions in the namespace (e.g., `Grid.Root`, `Grid.Item`)

---

## Recursive Component Type (UIComponentType)

For components that can contain children (Box, Stack, Card, etc.), we need a recursive type similar to `EastTypeType`:

```typescript
/**
 * Recursive type representing any UI node that can contain children.
 * Similar to EastTypeType, this enables type-safe UI composition.
 */
export const UIComponentType = RecursiveType(node => VariantType({
  // Primitives (no children)
  Text: TextType,
  Badge: BadgeType,
  Spinner: SpinnerType,
  Icon: IconType,
  Image: ImageType,

  // Data display
  Progress: ProgressRootType,
  Sparkline: SparklineType,
  Stat: StatRootType,

  // Form controls
  Input: InputRootType,
  NumberInput: NumberInputRootType,
  Slider: SliderRootType,
  Switch: SwitchRootType,
  Checkbox: CheckboxRootType,
  Select: SelectRootType,
  Button: ButtonType,

  // Containers (recursive - can have children)
  Box: StructType({
    children: ArrayType(node),
    style: OptionType(BoxStyleType),
  }),
  Stack: StructType({
    direction: OrientationType,
    children: ArrayType(node),
    style: OptionType(StackStyleType),
  }),
  Card: CardRootType,

  // Collections
  Table: TableRootType,
  Accordion: AccordionRootType,
  Menu: MenuRootType,

  // Overlays
  Tooltip: TooltipRootType,
  Alert: AlertRootType,
}));

export type UIComponentType = typeof UIComponentType;
```

---

## Refactored style.ts

After moving component-specific types, `style.ts` contains only:

```typescript
// Font styling
export const FontWeightType = VariantType({ normal, bold, semibold, medium, light });
export const FontStyleType = VariantType({ normal, italic });

// Text behavior
export const TextAlignType = VariantType({ left, center, right, justify });
export const TextTransformType = VariantType({ uppercase, lowercase, capitalize, none });
export const VerticalAlignType = VariantType({ top, middle, bottom, baseline });

// Common component styling
export const SizeType = VariantType({ xs, sm, md, lg, xl });
export const ColorSchemeType = VariantType({ gray, red, orange, yellow, green, teal, blue, cyan, purple, pink });
export const StyleVariantType = VariantType({ subtle, solid, outline });
export const OrientationType = VariantType({ horizontal, vertical });

// Border styling
export const BorderWidthType = VariantType({ none, thin, medium, thick });
export const BorderStyleType = VariantType({ solid, dashed, dotted, double, none });

// Layout
export const DisplayType = VariantType({ block, inline, flex, inline_flex, grid, none });
export const FlexDirectionType = VariantType({ row, column, row_reverse, column_reverse });
export const JustifyContentType = VariantType({ flex_start, flex_end, center, space_between, space_around, space_evenly });
export const AlignItemsType = VariantType({ flex_start, flex_end, center, baseline, stretch });

export const Style = {
  FontWeight, FontStyle, TextAlign, TextTransform, Size, ColorScheme,
  StyleVariant, Orientation, BorderWidth, BorderStyle,
} as const;
```

---

## Migration Plan

### Phase 1: Reorganize Existing Code
1. Create individual component files for components in `## Component Specifications`
4. Update exports in `index.ts`

### Phase 2: Implement New Components
1. Container components: Box, Stack (with recursive UIComponentType)
2. Form components: Button, Input, Checkbox, Switch, Select
3. Display components: Card, Stat, Tag, Avatar
4. Overlay components: Tooltip, Menu, Accordion, Alert

### Phase 3: Implement UIComponentType
1. Define recursive type using RecursiveType pattern
2. Update container components to use UIComponentType for children
3. Add type utilities for working with UI trees

### Phase 4: Testing & Documentation
1. Write tests for each new component
2. Update CLAUDE.md with new file structure
3. Create examples for common patterns

---

## Current File Structure

Organized by Chakra UI component categories. Each component has its own subdirectory with `index.ts` and `types.ts`:

```
src/
  index.ts              # Main exports
  style.ts              # Shared style types (FontWeight, TextAlign, Size, ColorScheme, etc.)
  component.ts          # UIComponentType recursive type definition

  buttons/
    index.ts            # Buttons category exports
    button/
      index.ts          # Button component
      types.ts          # ButtonType, ButtonStyleType definitions

  collections/
    index.ts            # Collections category exports
    data-list/
      index.ts          # DataList component
      types.ts          # DataListRootType, DataListItemType definitions

  container/
    index.ts            # Container category exports
    card/
      index.ts          # Card component (container with children)
      types.ts          # CardStyleType, CardVariantType definitions

  disclosure/
    index.ts            # Disclosure category exports
    accordion/
      index.ts          # Accordion component (container with children)
      types.ts          # AccordionStyleType, AccordionVariantType definitions

  display/
    index.ts            # Display category exports
    avatar/
      index.ts          # Avatar component
      types.ts          # AvatarType definitions
    badge/
      index.ts          # Badge component
      types.ts          # BadgeType, BadgeVariantType definitions
    stat/
      index.ts          # Stat component
      types.ts          # StatType, StatIndicatorType definitions
    tag/
      index.ts          # Tag component
      types.ts          # TagType definitions

  feedback/
    index.ts            # Feedback category exports
    alert/
      index.ts          # Alert component
      types.ts          # AlertType, AlertStatusType definitions
    progress/
      index.ts          # Progress bar
      types.ts          # ProgressType definitions

  forms/
    index.ts            # Forms category exports
    checkbox/
      index.ts          # Checkbox component
      types.ts          # CheckboxType definitions
    input/
      index.ts          # Input (String, Integer, Float, DateTime variants)
      types.ts          # StringInputType, IntegerInputType, etc. definitions
    select/
      index.ts          # Select dropdown
      types.ts          # SelectRootType, SelectItemType definitions
    slider/
      index.ts          # Range slider
      types.ts          # SliderType definitions
    switch/
      index.ts          # Toggle switch
      types.ts          # SwitchType definitions

  layout/
    index.ts            # Layout category exports
    box/
      index.ts          # Box container component (container with children)
      types.ts          # BoxStyleType definitions
    grid/
      index.ts          # CSS Grid layout (container with children)
      types.ts          # GridStyleType, GridAutoFlowType definitions
    separator/
      index.ts          # Visual divider
      types.ts          # SeparatorStyleType definitions
    splitter/
      index.ts          # Resizable panels (container with children)
      types.ts          # SplitterStyleType definitions
    stack/
      index.ts          # Stack, HStack, VStack components (container with children)
      types.ts          # StackStyleType definitions

  typography/
    index.ts            # Typography category exports
    text/
      index.ts          # Text component
      types.ts          # TextType definitions

test/
  platforms.spec.ts     # Test infrastructure (from East)
  style.spec.ts         # Tests for style types
  component.spec.ts     # Tests for UIComponentType and complex compositions
  buttons/              # Button component tests
  collections/          # Collections component tests (DataList)
  container/            # Container component tests (Card)
  disclosure/           # Disclosure component tests (Accordion)
  display/              # Display component tests (Avatar, Badge, Stat, Tag)
  feedback/             # Feedback component tests
  forms/                # Forms component tests
  layout/               # Layout component tests
  typography/           # Typography component tests
```

## Component Specifications

Each component has a detailed specification document:

- [x] [01-progress.md](01-progress.md) - Progress (`src/feedback/progress/`)
- [x] [02-sparkline.md](02-sparkline.md) - Sparkline (`src/charts/sparkline/`)
- [x] [03-slider.md](03-slider.md) - Slider (`src/forms/slider/`)
- [x] [04-badge.md](04-badge.md) - Badge (`src/display/badge/`)
- [x] [05-box.md](05-box.md) - Box (`src/layout/box/`)
- [x] [06-stack.md](06-stack.md) - Stack (`src/layout/stack/`)
- [x] [07-button.md](07-button.md) - Button (`src/buttons/button/`)
- [x] [08-input.md](08-input.md) - Input (`src/forms/input/`)
- [x] [09-checkbox.md](09-checkbox.md) - Checkbox (`src/forms/checkbox/`)
- [x] [10-switch.md](10-switch.md) - Switch (`src/forms/switch/`)
- [x] [11-card.md](11-card.md) - Card (`src/container/card/`)
- [x] [12-stat.md](12-stat.md) - Stat (`src/display/stat/`)
- [x] [13-tag.md](13-tag.md) - Tag (`src/display/tag/`)
- [x] [14-select.md](14-select.md) - Select (`src/forms/select/`)
- [x] [15-alert.md](15-alert.md) - Alert (`src/feedback/alert/`)
- [x] [16-tooltip.md](16-tooltip.md) - Tooltip (`src/overlays/tooltip/`)
- [x] [17-avatar.md](17-avatar.md) - Avatar (`src/display/avatar/`)
- [x] [18-accordion.md](18-accordion.md) - Accordion (`src/disclosure/accordion/`)
- [x] [19-menu.md](19-menu.md) - Menu (`src/overlays/menu/`)
- [x] [20-table.md](20-table.md) - Table (`src/table/`)
- [x] [22-data-list.md](22-data-list.md) - DataList (`src/collections/data-list/`)
- [x] [23-tree-view.md](23-tree-view.md) - TreeView (`src/collections/tree-view/`)
- [x] [24-charts.md](24-charts.md) - Charts (`src/charts/`) - See also [CHAKRA_CHARTS_REFERENCE.md](CHAKRA_CHARTS_REFERENCE.md)
- [x] [25-grid.md](25-grid.md) - Grid (`src/layout/grid/`)
- [x] [26-splitter.md](26-splitter.md) - Splitter (`src/layout/splitter/`)
- [x] [27-separator.md](27-separator.md) - Separator (`src/layout/separator/`)
- [x] [28-field.md](28-field.md) - Field (`src/forms/field/`)
- [x] [29-file-upload.md](29-file-upload.md) - FileUpload (`src/forms/file-upload/`)
- [x] [30-fieldset.md](30-fieldset.md) - Fieldset (`src/forms/fieldset/`)
- [ ] [31-textarea.md](31-textarea.md) - Textarea (`src/forms/textarea/`)
- [ ] [32-tags-input.md](32-tags-input.md) - TagsInput (`src/forms/tags-input/`)
- [ ] [33-carousel.md](33-carousel.md) - Carousel (`src/disclosure/carousel/`)
- [ ] [34-collapsible.md](34-collapsible.md) - Collapsible (`src/disclosure/collapsible/`)
- [ ] [35-tabs.md](35-tabs.md) - Tabs (`src/disclosure/tabs/`)
- [ ] [36-empty-state.md](36-empty-state.md) - EmptyState (`src/display/empty-state/`)
- [ ] [37-skeleton.md](37-skeleton.md) - Skeleton (`src/display/skeleton/`)
- [ ] [38-download-trigger.md](38-download-trigger.md) - DownloadTrigger (`src/buttons/download-trigger/`)

---

## Future Components (Not Yet Implemented)

The following components are specified but not yet implemented:

- **Typography**: Heading, Code, Blockquote
- **Buttons**: IconButton, CloseButton, DownloadTrigger (38)
- **Forms**: FileUpload (29), Fieldset (30), Textarea (31), TagsInput (32)
- **Collections**: TreeView
- **Overlays**: Menu, Tooltip, Popover, Dialog, Drawer
- **Disclosure**: Carousel (33), Collapsible (34), Tabs (35)
- **Feedback**: Spinner, Toast
- **Display**: Icon, Image, Table, EmptyState (36), Skeleton (37)
- **Charts**: Cartesian, Pie, Radar, BarList (Sparkline ✓)
