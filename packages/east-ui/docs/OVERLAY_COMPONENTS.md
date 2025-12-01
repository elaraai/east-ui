# Overlay Components Design Document

This document specifies the design for additional overlay components in East UI, based on Chakra UI v3.

## Overview

East UI currently has two overlay components:
- **Tooltip** - Hover-triggered floating content
- **Menu** - Click-triggered dropdown menu

This document specifies six additional overlay components:
- **Dialog** - Modal dialog/alert windows
- **Drawer** - Side panel overlays
- **Popover** - Click-triggered floating content
- **HoverCard** - Hover-triggered rich content cards
- **ActionBar** - Bottom action bar for batch operations
- **ToggleTip** - Click-activated tooltip (accessible alternative)

## Component Specifications

---

### 1. Dialog

Modal dialog for focused user interactions, confirmations, and alerts.

#### Structure

```
Dialog.Root
├── Dialog.Backdrop
├── Dialog.Positioner
│   └── Dialog.Content
│       ├── Dialog.Header
│       │   ├── Dialog.Title
│       │   └── Dialog.CloseTrigger
│       ├── Dialog.Body
│       │   └── Dialog.Description
│       └── Dialog.Footer
```

#### Props

**Dialog.Root (DialogRootProps)**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `onOpenChange` | `(details: { open: boolean }) => void` | - | Called when open state changes |
| `modal` | `boolean` | `true` | Prevents interaction outside, hides content below |
| `closeOnInteractOutside` | `boolean` | `true` | Close when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Close on escape key |
| `preventScroll` | `boolean` | `true` | Prevent body scroll when open |
| `trapFocus` | `boolean` | `true` | Trap focus inside dialog |
| `role` | `"dialog" \| "alertdialog"` | `"dialog"` | ARIA role |
| `lazyMount` | `boolean` | `false` | Delay mounting until first open |
| `unmountOnExit` | `boolean` | `false` | Unmount when closed |

**Style Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "cover" \| "full"` | `"md"` | Dialog size |
| `placement` | `"center" \| "top" \| "bottom"` | `"top"` | Vertical positioning |
| `scrollBehavior` | `"inside" \| "outside"` | `"outside"` | Scroll behavior |
| `motionPreset` | `"scale" \| "slide-in-bottom" \| "slide-in-top" \| "slide-in-left" \| "slide-in-right" \| "none"` | `"scale"` | Animation style |

#### Size Reference

| Size | Max Width |
|------|-----------|
| `xs` | `sm` (24rem) |
| `sm` | `md` (28rem) |
| `md` | `lg` (32rem) |
| `lg` | `2xl` (42rem) |
| `xl` | `4xl` (56rem) |
| `cover` | 100% with padding |
| `full` | 100dvw (full viewport) |

#### East UI Type Definition

```typescript
// types.ts
export const DialogSizeType = VariantType({
    xs: NullType,
    sm: NullType,
    md: NullType,
    lg: NullType,
    xl: NullType,
    cover: NullType,
    full: NullType,
});

export const DialogPlacementType = VariantType({
    center: NullType,
    top: NullType,
    bottom: NullType,
});

export const DialogScrollBehaviorType = VariantType({
    inside: NullType,
    outside: NullType,
});

export const DialogMotionPresetType = VariantType({
    scale: NullType,
    "slide-in-bottom": NullType,
    "slide-in-top": NullType,
    "slide-in-left": NullType,
    "slide-in-right": NullType,
    none: NullType,
});

export const DialogRoleType = VariantType({
    dialog: NullType,
    alertdialog: NullType,
});

export const DialogStyleType = StructType({
    size: OptionType(DialogSizeType),
    placement: OptionType(DialogPlacementType),
    scrollBehavior: OptionType(DialogScrollBehaviorType),
    motionPreset: OptionType(DialogMotionPresetType),
    role: OptionType(DialogRoleType),
});

// component.ts (container component - defined inline)
Dialog: StructType({
    trigger: node,
    title: OptionType(StringType),
    description: OptionType(StringType),
    body: ArrayType(node),
    footer: OptionType(ArrayType(node)),
    open: OptionType(BooleanType),
    defaultOpen: OptionType(BooleanType),
    modal: OptionType(BooleanType),
    closeOnInteractOutside: OptionType(BooleanType),
    closeOnEscape: OptionType(BooleanType),
    preventScroll: OptionType(BooleanType),
    trapFocus: OptionType(BooleanType),
    lazyMount: OptionType(BooleanType),
    unmountOnExit: OptionType(BooleanType),
    style: OptionType(DialogStyleType),
}),
```

#### Usage Example

```typescript
import { Dialog, Button, Text, Stack } from "@elaraai/east-ui";

// Confirmation dialog
const confirmDialog = Dialog.Root(
    Button.Root("Delete Item"),
    {
        title: "Confirm Deletion",
        description: "Are you sure you want to delete this item? This action cannot be undone.",
        footer: [
            Button.Root("Cancel", { variant: "outline" }),
            Button.Root("Delete", { colorPalette: "red" }),
        ],
        size: "sm",
        role: "alertdialog",
    }
);

// Form dialog
const formDialog = Dialog.Root(
    Button.Root("Edit Profile"),
    {
        title: "Edit Profile",
        body: [
            Field.Root("Name", StringInput.Root("name", "John Doe")),
            Field.Root("Email", StringInput.Root("email", "john@example.com")),
        ],
        footer: [
            Button.Root("Cancel", { variant: "outline" }),
            Button.Root("Save Changes"),
        ],
        size: "md",
    }
);
```

---

### 2. Drawer

Side panel overlay that slides in from screen edges.

#### Structure

```
Drawer.Root
├── Drawer.Backdrop
├── Drawer.Positioner
│   └── Drawer.Content
│       ├── Drawer.Header
│       │   ├── Drawer.Title
│       │   └── Drawer.CloseTrigger
│       ├── Drawer.Body
│       │   └── Drawer.Description
│       └── Drawer.Footer
```

#### Props

**Drawer.Root (DrawerRootProps)**

Inherits all Dialog props plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placement` | `"start" \| "end" \| "top" \| "bottom"` | `"end"` | Which edge to slide from |
| `contained` | `boolean` | `false` | Render within parent container |

**Style Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "full"` | `"xs"` | Drawer width/height |
| `placement` | `"start" \| "end" \| "top" \| "bottom"` | `"end"` | Edge placement |

#### Size Reference

| Size | Max Width (horizontal) |
|------|------------------------|
| `xs` | `xs` (20rem) |
| `sm` | `md` (28rem) |
| `md` | `lg` (32rem) |
| `lg` | `2xl` (42rem) |
| `xl` | `4xl` (56rem) |
| `full` | 100vw |

#### East UI Type Definition

```typescript
// types.ts
export const DrawerSizeType = VariantType({
    xs: NullType,
    sm: NullType,
    md: NullType,
    lg: NullType,
    xl: NullType,
    full: NullType,
});

export const DrawerPlacementType = VariantType({
    start: NullType,
    end: NullType,
    top: NullType,
    bottom: NullType,
});

export const DrawerStyleType = StructType({
    size: OptionType(DrawerSizeType),
    placement: OptionType(DrawerPlacementType),
    contained: OptionType(BooleanType),
});

// component.ts (container component - defined inline)
Drawer: StructType({
    trigger: node,
    title: OptionType(StringType),
    description: OptionType(StringType),
    body: ArrayType(node),
    footer: OptionType(ArrayType(node)),
    open: OptionType(BooleanType),
    defaultOpen: OptionType(BooleanType),
    closeOnInteractOutside: OptionType(BooleanType),
    closeOnEscape: OptionType(BooleanType),
    lazyMount: OptionType(BooleanType),
    unmountOnExit: OptionType(BooleanType),
    style: OptionType(DrawerStyleType),
}),
```

#### Usage Example

```typescript
import { Drawer, Button, Text, Stack } from "@elaraai/east-ui";

// Navigation drawer
const navDrawer = Drawer.Root(
    Button.Root("Menu", { variant: "ghost" }),
    {
        title: "Navigation",
        body: [
            Button.Root("Home", { variant: "ghost" }),
            Button.Root("Products", { variant: "ghost" }),
            Button.Root("About", { variant: "ghost" }),
            Button.Root("Contact", { variant: "ghost" }),
        ],
        placement: "start",
        size: "sm",
    }
);

// Settings drawer
const settingsDrawer = Drawer.Root(
    Button.Root("Settings"),
    {
        title: "Settings",
        description: "Customize your preferences",
        body: [
            Field.Root("Theme", Select.Root([...])),
            Field.Root("Language", Select.Root([...])),
        ],
        footer: [
            Button.Root("Save", { colorPalette: "blue" }),
        ],
        placement: "end",
        size: "md",
    }
);
```

---

### 3. Popover

Click-triggered floating content panel with rich content support.

#### Structure

```
Popover.Root
├── Popover.Trigger
├── Popover.Positioner
│   └── Popover.Content
│       ├── Popover.Arrow
│       │   └── Popover.ArrowTip
│       ├── Popover.Header
│       │   ├── Popover.Title
│       │   └── Popover.CloseTrigger
│       ├── Popover.Body
│       │   └── Popover.Description
│       └── Popover.Footer
```

#### Props

**Popover.Root (PopoverRootProps)**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `onOpenChange` | `(details: { open: boolean }) => void` | - | Called when open state changes |
| `modal` | `boolean` | `false` | Enable modal mode |
| `closeOnInteractOutside` | `boolean` | `true` | Close when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Close on escape key |
| `autoFocus` | `boolean` | `true` | Auto-focus first focusable element |
| `portalled` | `boolean` | `true` | Render in portal |
| `positioning` | `PositioningOptions` | - | Positioning configuration |
| `lazyMount` | `boolean` | `false` | Delay mounting |
| `unmountOnExit` | `boolean` | `false` | Unmount when closed |

**Style Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` | Popover size |

**Positioning Options**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placement` | `PlacementType` | `"bottom"` | Position relative to trigger |
| `gutter` | `number` | `8` | Offset from trigger |
| `offset` | `{ mainAxis?: number; crossAxis?: number }` | - | Fine-grained offset |
| `flip` | `boolean` | `true` | Flip when insufficient space |
| `slide` | `boolean` | `true` | Slide when insufficient space |

#### East UI Type Definition

```typescript
// types.ts
export const PopoverSizeType = VariantType({
    xs: NullType,
    sm: NullType,
    md: NullType,
    lg: NullType,
});

export const PopoverStyleType = StructType({
    size: OptionType(PopoverSizeType),
    placement: OptionType(PlacementType),
    hasArrow: OptionType(BooleanType),
    gutter: OptionType(IntegerType),
});

// component.ts (container component - defined inline)
Popover: StructType({
    trigger: node,
    title: OptionType(StringType),
    description: OptionType(StringType),
    body: ArrayType(node),
    footer: OptionType(ArrayType(node)),
    open: OptionType(BooleanType),
    defaultOpen: OptionType(BooleanType),
    modal: OptionType(BooleanType),
    closeOnInteractOutside: OptionType(BooleanType),
    closeOnEscape: OptionType(BooleanType),
    autoFocus: OptionType(BooleanType),
    lazyMount: OptionType(BooleanType),
    unmountOnExit: OptionType(BooleanType),
    style: OptionType(PopoverStyleType),
}),
```

#### Usage Example

```typescript
import { Popover, Button, Text, Stack } from "@elaraai/east-ui";

// Simple popover
const infoPopover = Popover.Root(
    Button.Root("Info"),
    {
        title: "Information",
        body: [
            Text.Root("This is additional information about the feature."),
        ],
        placement: "top",
        hasArrow: true,
    }
);

// Action popover
const actionPopover = Popover.Root(
    Button.Root("Share"),
    {
        title: "Share",
        body: [
            Button.Root("Copy Link", { variant: "ghost" }),
            Button.Root("Email", { variant: "ghost" }),
            Button.Root("Twitter", { variant: "ghost" }),
        ],
        size: "sm",
    }
);
```

---

### 4. HoverCard

Hover-triggered floating card for previews and additional context.

#### Structure

```
HoverCard.Root
├── HoverCard.Trigger
├── HoverCard.Positioner
│   └── HoverCard.Content
│       └── HoverCard.Arrow
```

#### Props

**HoverCard.Root (HoverCardRootProps)**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `onOpenChange` | `(details: { open: boolean }) => void` | - | Called when open state changes |
| `openDelay` | `number` | `700` | Delay before opening (ms) |
| `closeDelay` | `number` | `300` | Delay before closing (ms) |
| `positioning` | `PositioningOptions` | - | Positioning configuration |
| `lazyMount` | `boolean` | `false` | Delay mounting |
| `unmountOnExit` | `boolean` | `false` | Unmount when closed |

**Style Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"xs" \| "sm" \| "md" \| "lg"` | `"md"` | Card size |

#### East UI Type Definition

```typescript
// types.ts
export const HoverCardSizeType = VariantType({
    xs: NullType,
    sm: NullType,
    md: NullType,
    lg: NullType,
});

export const HoverCardStyleType = StructType({
    size: OptionType(HoverCardSizeType),
    placement: OptionType(PlacementType),
    hasArrow: OptionType(BooleanType),
    openDelay: OptionType(IntegerType),
    closeDelay: OptionType(IntegerType),
});

// component.ts (container component - defined inline)
HoverCard: StructType({
    trigger: node,
    content: ArrayType(node),
    open: OptionType(BooleanType),
    defaultOpen: OptionType(BooleanType),
    lazyMount: OptionType(BooleanType),
    unmountOnExit: OptionType(BooleanType),
    style: OptionType(HoverCardStyleType),
}),
```

#### Usage Example

```typescript
import { HoverCard, Text, Avatar, Stack } from "@elaraai/east-ui";

// User profile hover card
const userHoverCard = HoverCard.Root(
    Text.Root("@johndoe", { textDecoration: "underline" }),
    {
        content: [
            Stack.Root([
                Avatar.Root({ name: "John Doe", src: "avatar.jpg", size: "lg" }),
                Text.Root("John Doe", { fontWeight: "bold" }),
                Text.Root("Software Engineer"),
                Text.Root("San Francisco, CA", { color: "fg.muted" }),
            ], { gap: "2" }),
        ],
        openDelay: 500,
        closeDelay: 200,
        placement: "bottom-start",
    }
);

// Link preview hover card
const linkHoverCard = HoverCard.Root(
    Text.Root("View Documentation"),
    {
        content: [
            Text.Root("East UI Documentation", { fontWeight: "bold" }),
            Text.Root("Complete guide to building UIs with East UI components."),
        ],
        size: "sm",
    }
);
```

---

### 5. ActionBar

Bottom action bar for bulk operations on selected items.

#### Structure

```
ActionBar.Root
├── ActionBar.Positioner
│   └── ActionBar.Content
│       ├── ActionBar.SelectionTrigger
│       ├── ActionBar.Separator
│       ├── [Action Buttons]
│       └── ActionBar.CloseTrigger
```

#### Props

**ActionBar.Root (ActionBarRootProps)**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `onOpenChange` | `(details: { open: boolean }) => void` | - | Called when open state changes |
| `closeOnInteractOutside` | `boolean` | `true` | Close when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Close on escape key |

**Note:** ActionBar is built on Popover internally but with fixed bottom positioning.

#### East UI Type Definition

```typescript
// types.ts
export const ActionBarStyleType = StructType({
    // No size/variant - fixed styling
});

// ActionBar uses a simplified structure
export const ActionBarItemType = VariantType({
    Action: StructType({
        label: StringType,
        value: StringType,
        disabled: OptionType(BooleanType),
    }),
    Separator: NullType,
});

// component.ts (container component - defined inline)
ActionBar: StructType({
    selectionCount: OptionType(IntegerType),
    selectionLabel: OptionType(StringType),
    items: ArrayType(ActionBarItemType),
    open: OptionType(BooleanType),
    defaultOpen: OptionType(BooleanType),
    closeOnInteractOutside: OptionType(BooleanType),
    closeOnEscape: OptionType(BooleanType),
}),
```

#### Usage Example

```typescript
import { ActionBar } from "@elaraai/east-ui";

// Table selection action bar
const selectionBar = ActionBar.Root({
    selectionCount: 5,
    selectionLabel: "items selected",
    items: [
        ActionBar.Action("edit", "Edit"),
        ActionBar.Action("duplicate", "Duplicate"),
        ActionBar.Separator(),
        ActionBar.Action("delete", "Delete"),
    ],
    open: true,
});
```

---

### 6. ToggleTip

Click-activated tooltip for accessible information disclosure.

#### Structure

```
ToggleTip.Root
├── ToggleTip.Trigger
├── ToggleTip.Positioner
│   └── ToggleTip.Content
│       └── ToggleTip.Arrow
```

#### Props

**ToggleTip.Root (ToggleTipRootProps)**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `onOpenChange` | `(details: { open: boolean }) => void` | - | Called when open state changes |
| `closeOnInteractOutside` | `boolean` | `true` | Close when clicking outside |
| `closeOnEscape` | `boolean` | `true` | Close on escape key |
| `positioning` | `PositioningOptions` | - | Positioning configuration |

**Note:** ToggleTip is similar to Tooltip but activated by click instead of hover, making it more accessible for keyboard and touch users.

#### East UI Type Definition

```typescript
// types.ts
export const ToggleTipStyleType = StructType({
    placement: OptionType(PlacementType),
    hasArrow: OptionType(BooleanType),
});

// component.ts (container component - defined inline)
ToggleTip: StructType({
    trigger: node,
    content: StringType,
    open: OptionType(BooleanType),
    defaultOpen: OptionType(BooleanType),
    closeOnInteractOutside: OptionType(BooleanType),
    closeOnEscape: OptionType(BooleanType),
    style: OptionType(ToggleTipStyleType),
}),
```

#### Usage Example

```typescript
import { ToggleTip, Button, Icon } from "@elaraai/east-ui";

// Info toggle tip
const infoTip = ToggleTip.Root(
    Icon.Root("fas", "circle-info"),
    {
        content: "Click anywhere outside to close this tip.",
        placement: "top",
        hasArrow: true,
    }
);

// Help toggle tip
const helpTip = ToggleTip.Root(
    Button.Root("?", { variant: "ghost", size: "xs" }),
    {
        content: "This field is required for form submission.",
        placement: "right",
    }
);
```

---

## Shared Types

### PlacementType (already exists)

Used by Tooltip, Menu, Popover, HoverCard, ToggleTip:

```typescript
export const PlacementType = VariantType({
    top: NullType,
    "top-start": NullType,
    "top-end": NullType,
    bottom: NullType,
    "bottom-start": NullType,
    "bottom-end": NullType,
    left: NullType,
    "left-start": NullType,
    "left-end": NullType,
    right: NullType,
    "right-start": NullType,
    "right-end": NullType,
});
```

---

## Implementation Priority

1. **Dialog** - Essential for confirmations, forms, and alerts
2. **Drawer** - Common pattern for navigation and settings
3. **Popover** - Rich alternative to tooltips
4. **HoverCard** - User previews and link cards
5. **ActionBar** - Batch operations UI pattern
6. **ToggleTip** - Accessibility enhancement

---

## File Structure

```
src/overlays/
├── index.ts                    # Category exports
├── tooltip/                    # (existing)
├── menu/                       # (existing)
├── dialog/
│   ├── index.ts
│   └── types.ts
├── drawer/
│   ├── index.ts
│   └── types.ts
├── popover/
│   ├── index.ts
│   └── types.ts
├── hover-card/
│   ├── index.ts
│   └── types.ts
├── action-bar/
│   ├── index.ts
│   └── types.ts
└── toggle-tip/
    ├── index.ts
    └── types.ts
```

---

## References

- [Chakra UI Dialog](https://www.chakra-ui.com/docs/components/dialog)
- [Chakra UI Drawer](https://www.chakra-ui.com/docs/components/drawer)
- [Chakra UI Popover](https://www.chakra-ui.com/docs/components/popover)
- [Chakra UI HoverCard](https://www.chakra-ui.com/docs/components/hover-card)
- [Chakra UI ActionBar](https://www.chakra-ui.com/docs/components/action-bar)
- [Chakra UI ToggleTip](https://www.chakra-ui.com/docs/components/toggle-tip)
- [Zag.js Dialog](https://zagjs.com/components/react/dialog)
- [Zag.js Popover](https://zagjs.com/components/react/popover)
- [Zag.js HoverCard](https://zagjs.com/components/react/hover-card)
