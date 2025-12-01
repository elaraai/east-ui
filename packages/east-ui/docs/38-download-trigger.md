### 38. [ ] DownloadTrigger (`src/buttons/download-trigger/`)

**Source:** `@chakra-ui/react` - DownloadTrigger component

**Chakra UI Structure:**
```tsx
<DownloadTrigger
  data="Hello, World!"
  fileName="hello.txt"
  mimeType="text/plain"
>
  <Button>Download</Button>
</DownloadTrigger>

<DownloadTrigger
  data={blob}
  fileName="image.png"
  mimeType="image/png"
>
  Download Image
</DownloadTrigger>
```

**Props:**
- `data`: string | Blob | File - content to download
- `fileName`: string - downloaded file name
- `mimeType`: string - MIME type of content
- `children`: ReactNode - trigger element (usually Button)

**East UI Types:**
```typescript
// DownloadTrigger wraps a button to trigger download
export const DownloadTriggerType = StructType({
  data: BlobType,  // content to download
  fileName: StringType,
  mimeType: OptionType(StringType),
  label: StringType,  // button label

  // Button styling
  variant: OptionType(ButtonVariantType),
  colorPalette: OptionType(ColorSchemeType),
  size: OptionType(SizeType),
  disabled: OptionType(BooleanType),
});

export interface DownloadTriggerStyle {
  mimeType?: SubtypeExprOrValue<StringType>;
  variant?: SubtypeExprOrValue<ButtonVariantType> | ButtonVariantLiteral;
  colorPalette?: SubtypeExprOrValue<ColorSchemeType> | ColorSchemeLiteral;
  size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
  disabled?: SubtypeExprOrValue<BooleanType>;
}

export const DownloadTrigger = {
  Root: createDownloadTrigger,
  Types: {
    DownloadTrigger: DownloadTriggerType,
  },
} as const;
```

**Usage:**
```typescript
// Text file download
DownloadTrigger.Root(
  East.value("Hello, World!", BlobType),
  "hello.txt",
  "Download Text",
  {
    mimeType: "text/plain",
    variant: "solid",
    colorPalette: "blue",
  }
);

// JSON export
DownloadTrigger.Root(
  row.toJSON(),
  "data.json",
  "Export JSON",
  {
    mimeType: "application/json",
    variant: "outline",
  }
);

// CSV download
DownloadTrigger.Root(
  generateCSV(data),
  "report.csv",
  "Download Report",
  {
    mimeType: "text/csv",
    size: "lg",
  }
);

// Binary file download
DownloadTrigger.Root(
  imageBlob,
  "screenshot.png",
  "Save Image",
  {
    mimeType: "image/png",
  }
);
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
