# East UI Examples Plan

This document details every examples file to be created for the East UI test suite, including the tsconfig changes needed and a description of each example.

## Prerequisites: tsconfig Configuration

The current `tsconfig.json` does not include `test/**/*` and has no `rootDir` set, which means `test/` files cannot use `@elaraai/east-ui` package imports (they currently use relative `../../src/index.js` imports). Following the pattern from `east-py-datascience`:

**Changes to `/packages/east-ui/tsconfig.json`:**
- Add `"include": ["src/**/*", "test/**/*"]`
- Set `"rootDir": "."`
- Output changes to `dist/` will now mirror `src/` and `test/` subdirectories

This enables examples files to use `import { ... } from "@elaraai/east-ui"` instead of relative paths, which is critical since examples are extracted into a search index and shown as standalone code to AI agents.

---

## File Inventory

53 spec files across 13 categories need companion `*.examples.ts` files:

| # | Spec File | Examples File | Examples Count |
|---|-----------|---------------|----------------|
| 1 | `component.spec.ts` | `component.examples.ts` | 2 |
| 2 | `buttons/button.spec.ts` | `buttons/button.examples.ts` | 5 |
| 3 | `collections/data-list.spec.ts` | `collections/data-list.examples.ts` | 4 |
| 4 | `collections/table.spec.ts` | `collections/table.examples.ts` | 6 |
| 5 | `collections/gantt.spec.ts` | `collections/gantt.examples.ts` | 3 |
| 6 | `collections/planner.spec.ts` | `collections/planner.examples.ts` | 3 |
| 7 | `collections/tree-view.spec.ts` | `collections/tree-view.examples.ts` | 3 |
| 8 | `container/card.spec.ts` | `container/card.examples.ts` | 4 |
| 9 | `disclosure/accordion.spec.ts` | `disclosure/accordion.examples.ts` | 4 |
| 10 | `disclosure/carousel.spec.ts` | `disclosure/carousel.examples.ts` | 3 |
| 11 | `disclosure/tabs.spec.ts` | `disclosure/tabs.examples.ts` | 4 |
| 12 | `display/avatar.spec.ts` | `display/avatar.examples.ts` | 3 |
| 13 | `display/badge.spec.ts` | `display/badge.examples.ts` | 4 |
| 14 | `display/icon.spec.ts` | `display/icon.examples.ts` | 3 |
| 15 | `display/stat.spec.ts` | `display/stat.examples.ts` | 3 |
| 16 | `display/tag.spec.ts` | `display/tag.examples.ts` | 3 |
| 17 | `feedback/alert.spec.ts` | `feedback/alert.examples.ts` | 3 |
| 18 | `feedback/progress.spec.ts` | `feedback/progress.examples.ts` | 3 |
| 19 | `forms/checkbox.spec.ts` | `forms/checkbox.examples.ts` | 3 |
| 20 | `forms/combobox.spec.ts` | `forms/combobox.examples.ts` | 3 |
| 21 | `forms/field.spec.ts` | `forms/field.examples.ts` | 3 |
| 22 | `forms/file-upload.spec.ts` | `forms/file-upload.examples.ts` | 3 |
| 23 | `forms/input.spec.ts` | `forms/input.examples.ts` | 5 |
| 24 | `forms/select.spec.ts` | `forms/select.examples.ts` | 3 |
| 25 | `forms/slider.spec.ts` | `forms/slider.examples.ts` | 3 |
| 26 | `forms/switch.spec.ts` | `forms/switch.examples.ts` | 3 |
| 27 | `forms/tags-input.spec.ts` | `forms/tags-input.examples.ts` | 3 |
| 28 | `forms/textarea.spec.ts` | `forms/textarea.examples.ts` | 3 |
| 29 | `layout/box.spec.ts` | `layout/box.examples.ts` | 4 |
| 30 | `layout/flex.spec.ts` | `layout/flex.examples.ts` | 3 |
| 31 | `layout/grid.spec.ts` | `layout/grid.examples.ts` | 4 |
| 32 | `layout/separator.spec.ts` | `layout/separator.examples.ts` | 3 |
| 33 | `layout/splitter.spec.ts` | `layout/splitter.examples.ts` | 3 |
| 34 | `layout/stack.spec.ts` | `layout/stack.examples.ts` | 5 |
| 35 | `overlays/menu.spec.ts` | `overlays/menu.examples.ts` | 3 |
| 36 | `overlays/tooltip.spec.ts` | `overlays/tooltip.examples.ts` | 2 |
| 37 | `typography/text.spec.ts` | `typography/text.examples.ts` | 4 |
| 38 | `typography/code.spec.ts` | `typography/code.examples.ts` | 2 |
| 39 | `typography/code-block.spec.ts` | `typography/code-block.examples.ts` | 3 |
| 40 | `typography/heading.spec.ts` | `typography/heading.examples.ts` | 3 |
| 41 | `typography/highlight.spec.ts` | `typography/highlight.examples.ts` | 2 |
| 42 | `typography/link.spec.ts` | `typography/link.examples.ts` | 2 |
| 43 | `typography/list.spec.ts` | `typography/list.examples.ts` | 2 |
| 44 | `typography/mark.spec.ts` | `typography/mark.examples.ts` | 2 |
| 45 | `charts/area.spec.ts` | `charts/area.examples.ts` | 5 |
| 46 | `charts/bar.spec.ts` | `charts/bar.examples.ts` | 5 |
| 47 | `charts/bar-list.spec.ts` | `charts/bar-list.examples.ts` | 3 |
| 48 | `charts/bar-segment.spec.ts` | `charts/bar-segment.examples.ts` | 2 |
| 49 | `charts/line.spec.ts` | `charts/line.examples.ts` | 5 |
| 50 | `charts/pie.spec.ts` | `charts/pie.examples.ts` | 3 |
| 51 | `charts/radar.spec.ts` | `charts/radar.examples.ts` | 2 |
| 52 | `charts/scatter.spec.ts` | `charts/scatter.examples.ts` | 3 |
| 53 | `charts/sparkline.spec.ts` | `charts/sparkline.examples.ts` | 2 |
| 54 | `charts/composed.spec.ts` | `charts/composed.examples.ts` | 3 |

**Total: 54 example files, ~175 individual examples**

---

## Import Pattern

All examples files use package imports, not relative paths:

```typescript
import { East, IntegerType, StringType, BooleanType, NullType, example } from "@elaraai/east";
import { Button, Text, Stack, Box, UIComponentType } from "@elaraai/east-ui";
```

Since examples return `UIComponentType` (a recursive variant type), most examples will **not** have a `returns` field — they will use the side-effect pattern where the `fn` return type is `NullType` and the component is created as a statement, OR they will return `UIComponentType` without asserting equality (since the recursive type makes literal comparison impractical). The spec files verify structure via `.unwrap()` chains, but examples focus on demonstrating **how to use** the API.

**Convention for UI examples:** Since `UIComponentType` values are complex recursive variants that cannot be meaningfully compared with `returns`, examples will omit `returns` and use `NullType` as the return type, with the component creation as a side-effect statement `$(component)`. This matches the pattern used for side-effect examples in other packages.

---

## Reactive.Root Pattern in Examples

Many examples will demonstrate the recommended `Reactive.Root` pattern from the showcases. This is the best-practice way to build interactive UIs with East UI:

```typescript
import { East, IntegerType, NullType, example } from "@elaraai/east";
import { Reactive, State, Text, Button, Stack, UIComponentType } from "@elaraai/east-ui";

export const reactiveCounter = example({
    keywords: ["Reactive", "Root", "State", "readTyped", "writeTyped", "interactive"],
    description: "Create a reactive counter that re-renders when state changes",
    fn: East.function([], NullType, ($) => {
        $(Reactive.Root($ => {
            const count = $.let(State.readTyped("counter", IntegerType)());
            // ... build UI from state
            return Stack.VStack([
                Text.Root(East.str`Count: ${count}`),
                Button.Root("Increment"),
            ]);
        }));
    }),
    inputs: [],
});
```

Examples that naturally suit reactive patterns (forms, interactive tables, accordions) will use `Reactive.Root`. Static display components (Badge, Tag, Text) will show plain usage.

---

## Detailed Example Descriptions by File

### 1. `component.examples.ts` — UIComponentType Composition

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `nestedDashboardLayout` | Build a complete dashboard layout with Box > VStack > header (HStack with Text + Badge), Separator, stats row (HStack with multiple Stat), content section (Box with Alert + Progress), and tags row (HStack with Tag components). Demonstrates deep nesting of container and leaf components. | UIComponentType, Box, VStack, HStack, Badge, Stat, Alert, Progress, Tag, Separator, nested, dashboard, composition | No |
| `reactiveDashboard` | Dashboard with Reactive.Root that reads state for live KPI values. Stats update when state changes. Shows the recommended pattern for building data-driven dashboards. | UIComponentType, Reactive, Root, State, dashboard, Stat, Badge, live, reactive | Yes |

### 2. `buttons/button.examples.ts` — Button Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `buttonBasic` | Create a simple button with a text label. Minimal usage of Button.Root. | Button, Root, label, basic, create | No |
| `buttonVariants` | Create buttons with different visual variants: solid, subtle, outline, ghost. Shows string literal shorthand for variant prop. | Button, Root, variant, solid, subtle, outline, ghost | No |
| `buttonWithColorAndSize` | Create a styled button with colorPalette and size options. Demonstrates combining multiple style properties. | Button, Root, colorPalette, size, Style, ColorScheme | No |
| `buttonLoadingDisabled` | Create buttons in loading and disabled states. Shows boolean style properties for interactive states. | Button, Root, loading, disabled, state | No |
| `buttonPrimaryAction` | Real-world "Save Changes" button with solid variant, blue color palette, and medium size — a typical primary action button pattern. | Button, Root, primary, action, save, solid, blue | No |

### 3. `collections/data-list.examples.ts` — DataList Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `dataListBasic` | Create a basic data list with label-value pairs showing user profile info (name, email, phone). | DataList, Root, Item, label, value, basic | No |
| `dataListHorizontal` | Create a horizontal data list with compact layout, useful for metadata bars or summary rows. | DataList, Root, orientation, horizontal | No |
| `dataListStyled` | Create a styled data list with size, variant (subtle/bold), and combined options. | DataList, Root, size, variant, subtle, bold | No |
| `dataListReactiveProfile` | User profile data list inside Reactive.Root that reads user state. Demonstrates dynamic data list content from state. | DataList, Root, Item, Reactive, State, profile, dynamic | Yes |

### 4. `collections/table.examples.ts` — Table Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `tableSimpleArray` | Create a table with array of field names for simple tabular display. Minimal table creation pattern. | Table, Root, array, fields, simple, basic | No |
| `tableObjectConfig` | Create a table with object column configuration including custom headers. | Table, Root, columns, header, config, object | No |
| `tableCustomRenderBadge` | Create a table where a "status" column renders as Badge components using a custom render function with `Table.Types.CellRenderContext`. | Table, Root, render, Badge, custom, CellRenderContext | No |
| `tableStyledInteractive` | Create a fully styled table with variant (line/outline), striped rows, sticky header, interactive hover, and color palette. | Table, Root, variant, striped, interactive, stickyHeader, colorPalette, style | No |
| `tableComplexFieldValue` | Create a table with array/struct fields that require `value` functions to extract sortable values. Demonstrates the `value` + `render` pattern for complex column types. | Table, Root, value, render, complex, array, struct, sort | No |
| `tableReactiveWithCallbacks` | Table inside Reactive.Root with row click callback that updates state. Demonstrates interactive table pattern with State.writeTyped for tracking selections. | Table, Root, Reactive, State, onClick, callback, interactive, selection | Yes |

### 5. `collections/gantt.examples.ts` — Gantt Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `ganttBasicTimeline` | Create a basic Gantt chart with tasks that have start/end dates, labels, and progress percentages. | Gantt, Root, Task, start, end, label, progress, timeline | No |
| `ganttWithMilestones` | Create a Gantt chart mixing tasks, milestones (single date markers), and gaps (empty time spans). | Gantt, Root, Task, Milestone, Gap, mixed | No |
| `ganttProjectPlan` | Real-world project plan Gantt chart with column configuration, colorPalette per task, and progress tracking. | Gantt, Root, Task, project, plan, colorPalette, columns | No |

### 6. `collections/planner.examples.ts` — Planner Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `plannerBasicSchedule` | Create a basic planner/calendar view with events that have start times, optional end times, and labels. | Planner, Root, Event, schedule, start, end, label | No |
| `plannerColorCoded` | Create a planner with color-coded events using colorPalette to distinguish event categories. | Planner, Root, Event, colorPalette, categories | No |
| `plannerWithSlotMode` | Create a planner with slotMode style option for controlling time slot display granularity. | Planner, Root, Event, slotMode, style | No |

### 7. `collections/tree-view.examples.ts` — TreeView Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `treeViewBasic` | Create a basic tree view with items and branches. Demonstrates TreeView.Item for leaves and TreeView.Branch for expandable nodes. | TreeView, Root, Item, Branch, tree, hierarchy, basic | No |
| `treeViewWithIcons` | Create a file explorer tree view using indicator icons (folder, file, file-code) with FontAwesome prefixes. | TreeView, Root, Item, Branch, indicator, icon, fas, file, folder | No |
| `treeViewNested` | Create a deeply nested tree view with multiple levels of branches, demonstrating recursive hierarchy. | TreeView, Root, Branch, nested, deep, recursive, hierarchy | No |

### 8. `container/card.examples.ts` — Card Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `cardBasic` | Create a basic card with title, description, and text children. Minimal card usage pattern. | Card, Root, title, description, children, basic | No |
| `cardWithHeaderFooter` | Create a card with complex header (VStack/HStack with Badge) and footer sections. Demonstrates the header/footer slot pattern. | Card, Root, header, footer, VStack, HStack, Badge, complex | No |
| `cardVariantsAndSizes` | Create cards with different variants (elevated, outline, subtle) and sizes (sm, md, lg). | Card, Root, variant, elevated, outline, subtle, size | No |
| `cardProductDisplay` | Real-world product card with image placeholder, title, description, price stat, and action buttons. Demonstrates a realistic card composition pattern. | Card, Root, product, display, Stat, Button, realistic | No |

### 9. `disclosure/accordion.examples.ts` — Accordion Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `accordionBasic` | Create a basic accordion with multiple items containing text content. Shows Accordion.Root and Accordion.Item usage. | Accordion, Root, Item, basic, sections | No |
| `accordionVariants` | Create accordions with different variants (enclosed, plain, subtle) and collapsible/multiple options. | Accordion, Root, Item, variant, enclosed, plain, subtle, collapsible, multiple | No |
| `accordionFAQ` | Build a FAQ section with collapsible Q&A items using subtle variant. Real-world documentation pattern. | Accordion, Root, Item, FAQ, questions, answers, collapsible, subtle | No |
| `accordionReactiveSettings` | Settings panel inside Reactive.Root where expanded sections are tracked in state. Demonstrates Accordion with onValueChange callback pattern. | Accordion, Root, Item, Reactive, State, settings, onValueChange, expanded, interactive | Yes |

### 10. `disclosure/carousel.examples.ts` — Carousel Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `carouselBasic` | Create a basic carousel with image/content slides and default navigation. | Carousel, Root, slides, basic, navigation | No |
| `carouselAutoplay` | Create an auto-playing carousel with loop, custom slidesPerView, and indicator dots. | Carousel, Root, autoplay, loop, slidesPerView, indicators | No |
| `carouselVertical` | Create a vertical carousel with custom spacing and controlled index. | Carousel, Root, vertical, orientation, spacing, index | No |

### 11. `disclosure/tabs.examples.ts` — Tabs Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `tabsBasic` | Create basic tabs with multiple tab items, each containing different content. Shows Tabs.Root and Tabs.Item. | Tabs, Root, Item, basic, panels, content | No |
| `tabsVariants` | Create tabs with different variants (line, subtle, enclosed, outline, plain) and sizes. | Tabs, Root, Item, variant, line, subtle, enclosed, outline, size | No |
| `tabsVerticalFitted` | Create vertical tabs with fitted layout and justified alignment. Demonstrates orientation and layout options. | Tabs, Root, Item, vertical, fitted, justify, orientation | No |
| `tabsReactiveContent` | Tabs inside Reactive.Root where the active tab drives what content is displayed. Demonstrates controlled tabs with state. | Tabs, Root, Item, Reactive, State, controlled, value, active | Yes |

### 12. `display/avatar.examples.ts` — Avatar Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `avatarBasic` | Create avatars with image src and fallback name. Shows basic Avatar.Root usage. | Avatar, Root, src, name, image, basic | No |
| `avatarSizesAndVariants` | Create avatars in different sizes (xs–lg) and variants (solid, subtle, outline). | Avatar, Root, size, variant, solid, subtle, outline | No |
| `avatarColorPalette` | Create colored avatar initials using colorPalette. Demonstrates fallback to initials when no src. | Avatar, Root, colorPalette, initials, fallback | No |

### 13. `display/badge.examples.ts` — Badge Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `badgeBasic` | Create a basic badge with string value. Minimal Badge.Root usage. | Badge, Root, value, basic, label | No |
| `badgeVariants` | Create badges with solid, subtle, and outline variants. Shows visual style options. | Badge, Root, variant, solid, subtle, outline | No |
| `badgeColorPaletteSizes` | Create badges with different color palettes (green, red, blue) and sizes (xs–lg). | Badge, Root, colorPalette, size, green, red, blue | No |
| `badgeReactiveStatus` | Status badge inside Reactive.Root that reads a status string from state and applies conditional colorPalette. Demonstrates dynamic badge styling. | Badge, Root, Reactive, State, status, conditional, colorPalette, dynamic | Yes |

### 14. `display/icon.examples.ts` — Icon Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `iconBasic` | Create icons with different FontAwesome prefixes (fas, far, fab) and names. | Icon, Root, fas, far, fab, FontAwesome, prefix, name | No |
| `iconSizesAndColors` | Create icons with size variants (xs–2xl) and custom colors. | Icon, Root, size, color, colorPalette | No |
| `iconInContext` | Use icons within other components (Button labels, TreeView indicators). Shows realistic icon placement patterns. | Icon, Root, Button, TreeView, indicator, context, composition | No |

### 15. `display/stat.examples.ts` — Stat Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `statBasic` | Create a basic stat with label, value (as Text component), and optional helpText. | Stat, Root, label, value, helpText, basic | No |
| `statWithIndicator` | Create stats with up/down trend indicators for KPI dashboards. | Stat, Root, indicator, up, down, trend, KPI | No |
| `statReactiveKPI` | Live KPI stat inside Reactive.Root reading a numeric value from state. Demonstrates real-time metric display. | Stat, Root, Reactive, State, KPI, live, metric, dynamic | Yes |

### 16. `display/tag.examples.ts` — Tag Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `tagBasic` | Create a basic tag with label text. Minimal Tag.Root usage. | Tag, Root, label, basic | No |
| `tagVariantsAndColors` | Create tags with solid/subtle/outline variants and color palettes. | Tag, Root, variant, solid, subtle, outline, colorPalette | No |
| `tagClosable` | Create closable tags with the closable flag. Demonstrates removable tag pattern. | Tag, Root, closable, removable, dismiss | No |

### 17. `feedback/alert.examples.ts` — Alert Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `alertStatus` | Create alerts with different status types: info, warning, success, error. Shows all alert severity levels. | Alert, Root, status, info, warning, success, error | No |
| `alertWithTitleDescription` | Create alerts with both title and description for detailed feedback messages. | Alert, Root, title, description, detail, message | No |
| `alertVariants` | Create alerts with solid, subtle, and outline variants. | Alert, Root, variant, solid, subtle, outline | No |

### 18. `feedback/progress.examples.ts` — Progress Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `progressBasic` | Create a basic progress bar with a value percentage. | Progress, Root, value, percentage, basic | No |
| `progressStyled` | Create progress bars with colorPalette, size, variant (outline/subtle), and striped/animated flags. | Progress, Root, colorPalette, size, variant, striped, animated | No |
| `progressReactiveUpload` | File upload progress bar inside Reactive.Root that reads upload percentage from state. Demonstrates live progress tracking. | Progress, Root, Reactive, State, upload, live, percentage, dynamic | Yes |

### 19. `forms/checkbox.examples.ts` — Checkbox Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `checkboxBasic` | Create a basic checkbox with checked state and label. | Checkbox, Root, checked, label, basic | No |
| `checkboxStates` | Create checkboxes in indeterminate and disabled states. | Checkbox, Root, indeterminate, disabled, state | No |
| `checkboxReactiveToggle` | Checkbox inside Reactive.Root that toggles a boolean state value. Demonstrates two-way binding pattern. | Checkbox, Root, Reactive, State, toggle, boolean, binding | Yes |

### 20. `forms/combobox.examples.ts` — Combobox Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `comboboxBasic` | Create a basic combobox (searchable dropdown) with items. Shows Combobox.Root and Combobox.Item. | Combobox, Root, Item, search, dropdown, basic | No |
| `comboboxMultiple` | Create a multi-select combobox with placeholder and allowCustomValue. | Combobox, Root, Item, multiple, custom, placeholder | No |
| `comboboxReactiveSearch` | Combobox inside Reactive.Root where selection updates a state value displayed elsewhere. | Combobox, Root, Item, Reactive, State, selection, search, dynamic | Yes |

### 21. `forms/field.examples.ts` — Field Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `fieldStringInput` | Create a labeled form field wrapping a string input with helper text. | Field, StringInput, label, helperText, input | No |
| `fieldValidation` | Create form fields with error text and required/disabled/readOnly states. | Field, StringInput, Checkbox, error, required, disabled, readOnly, validation | No |
| `fieldReactiveForm` | Form field inside Reactive.Root with validation state read from state. Demonstrates dynamic error display. | Field, StringInput, Reactive, State, validation, error, dynamic | Yes |

### 22. `forms/file-upload.examples.ts` — FileUpload Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `fileUploadBasic` | Create a basic file upload with accept pattern and max file constraints. | FileUpload, Root, accept, maxFiles, basic | No |
| `fileUploadImage` | Create an image-only upload with drag-and-drop, custom labels, and size constraints. | FileUpload, Root, accept, image, allowDrop, maxFileSize, label | No |
| `fileUploadDocuments` | Create a document upload accepting PDFs with directory mode and custom trigger/dropzone text. | FileUpload, Root, accept, pdf, directory, triggerText, dropzoneText | No |

### 23. `forms/input.examples.ts` — Input Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `inputString` | Create a string input with placeholder, variant, and validation pattern. Basic text input usage. | Input, String, placeholder, variant, pattern, text | No |
| `inputInteger` | Create an integer input with min/max/step constraints. Numeric input for quantities. | Input, Integer, min, max, step, numeric, quantity | No |
| `inputFloat` | Create a float input with precision control. Demonstrates decimal number input. | Input, Float, min, max, step, precision, decimal | No |
| `inputDateTime` | Create a datetime input with date/time precision and custom format. | Input, DateTime, precision, date, time, format | No |
| `inputReactiveForm` | String input inside Reactive.Root where typed value updates state and is displayed in a Text component below. Demonstrates live input binding. | Input, String, Reactive, State, binding, live, form, dynamic | Yes |

### 24. `forms/select.examples.ts` — Select Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `selectBasic` | Create a basic select dropdown with items. Shows Select.Root and Select.Item. | Select, Root, Item, dropdown, basic | No |
| `selectMultiple` | Create a multi-select with placeholder and disabled items. | Select, Root, Item, multiple, placeholder, disabled | No |
| `selectReactiveFilter` | Select inside Reactive.Root that filters displayed content based on selection. Demonstrates controlled select with state-driven UI updates. | Select, Root, Item, Reactive, State, filter, controlled, dynamic | Yes |

### 25. `forms/slider.examples.ts` — Slider Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `sliderBasic` | Create a basic slider with value, min, max, and step. | Slider, Root, value, min, max, step, basic | No |
| `sliderStyled` | Create sliders with orientation (horizontal/vertical), colorPalette, size, and variant. | Slider, Root, orientation, colorPalette, size, variant | No |
| `sliderReactiveVolume` | Volume slider inside Reactive.Root where slider value is displayed as a percentage. | Slider, Root, Reactive, State, volume, percentage, dynamic | Yes |

### 26. `forms/switch.examples.ts` — Switch Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `switchBasic` | Create a basic switch with checked state and label. | Switch, Root, checked, label, basic | No |
| `switchStyled` | Create switches with colorPalette and size options. | Switch, Root, colorPalette, size, styled | No |
| `switchReactiveToggle` | Switch inside Reactive.Root that toggles a dark mode state, with a Text component showing current mode. | Switch, Root, Reactive, State, toggle, darkMode, dynamic | Yes |

### 27. `forms/tags-input.examples.ts` — TagsInput Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `tagsInputBasic` | Create a basic tags input with initial values and max constraint. | TagsInput, Root, value, max, basic, tags | No |
| `tagsInputStyled` | Create a tags input with variant, size, colorPalette, delimiter, and addOnPaste. | TagsInput, Root, variant, delimiter, addOnPaste, styled | No |
| `tagsInputReactiveSkills` | Tags input inside Reactive.Root for managing a skill list stored in state. | TagsInput, Root, Reactive, State, skills, dynamic, list | Yes |

### 28. `forms/textarea.examples.ts` — Textarea Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `textareaBasic` | Create a basic textarea with value and placeholder. | Textarea, Root, value, placeholder, basic | No |
| `textareaStyled` | Create a textarea with variant, size, resize control, rows, and maxLength. | Textarea, Root, variant, size, resize, rows, maxLength | No |
| `textareaReactiveNotes` | Textarea inside Reactive.Root for editing notes with live character count display. | Textarea, Root, Reactive, State, notes, character, count, dynamic | Yes |

### 29. `layout/box.examples.ts` — Box Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `boxBasic` | Create a basic box with children and padding. Shows Box.Root and Box.Padding helper. | Box, Root, children, padding, Padding, basic | No |
| `boxFlexLayout` | Create a box with flex display, direction, justifyContent, alignItems, and gap. Demonstrates box as a flex container. | Box, Root, display, flex, flexDirection, justifyContent, alignItems, gap | No |
| `boxStyled` | Create a box with background, color, borderRadius, width, and height. Demonstrates visual styling. | Box, Root, background, color, borderRadius, width, height, styled | No |
| `boxNested` | Create nested boxes demonstrating composition — an outer container with padded inner sections. | Box, Root, nested, composition, inner, outer, padding | No |

### 30. `layout/flex.examples.ts` — Flex Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `flexBasic` | Create a basic flex layout with direction and gap. | Flex, Root, direction, gap, basic | No |
| `flexWrap` | Create a flex layout with wrap and alignment options. | Flex, Root, wrap, justifyContent, alignItems | No |
| `flexResponsive` | Create a flex layout combining direction, gap, alignContent for responsive-style layouts. | Flex, Root, direction, gap, alignContent, responsive | No |

### 31. `layout/grid.examples.ts` — Grid Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `gridBasic` | Create a basic grid with templateColumns and gap. Shows Grid.Root and Grid.Item. | Grid, Root, Item, templateColumns, gap, basic | No |
| `gridTemplateAreas` | Create a grid with named template areas for semantic layout. | Grid, Root, Item, templateAreas, templateRows, named, semantic | No |
| `gridAutoFlow` | Create a grid with auto columns/rows and auto-flow (row, column, dense). | Grid, Root, Item, autoColumns, autoRows, autoFlow, dense | No |
| `gridDashboardLayout` | Real-world dashboard grid with spanning items (colSpan) and mixed content. Demonstrates a realistic page layout. | Grid, Root, Item, colSpan, dashboard, layout, spanning, realistic | No |

### 32. `layout/separator.examples.ts` — Separator Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `separatorBasic` | Create a basic horizontal separator. Minimal usage. | Separator, Root, horizontal, basic | No |
| `separatorVariants` | Create separators with orientation (horizontal/vertical), variant (solid/dashed/dotted), and size. | Separator, Root, orientation, variant, solid, dashed, dotted, size | No |
| `separatorWithLabel` | Create a separator with a text label for section dividers. | Separator, Root, label, divider, section | No |

### 33. `layout/splitter.examples.ts` — Splitter Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `splitterBasic` | Create a basic horizontal splitter with two panels and default sizes. Shows Splitter.Root and Splitter.Panel. | Splitter, Root, Panel, horizontal, basic | No |
| `splitterCollapsible` | Create a splitter with collapsible panels, min/max sizes, and default collapsed state. | Splitter, Root, Panel, collapsible, minSize, maxSize, collapsed | No |
| `splitterVertical` | Create a vertical splitter for top/bottom panel layout. | Splitter, Root, Panel, vertical, orientation | No |

### 34. `layout/stack.examples.ts` — Stack Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `stackBasic` | Create a basic stack with children and gap. | Stack, Root, children, gap, basic | No |
| `stackHorizontal` | Create a horizontal stack using Stack.HStack shorthand with justify and align options. | Stack, HStack, horizontal, justify, align | No |
| `stackVertical` | Create a vertical stack using Stack.VStack shorthand with padding and background. | Stack, VStack, vertical, padding, background | No |
| `stackNavbar` | Build a navigation bar using HStack with left-aligned title, spacer, and right-aligned action buttons. Real-world layout pattern. | Stack, HStack, navbar, navigation, layout, realistic | No |
| `stackReactiveFormLayout` | Form layout using VStack inside Reactive.Root with input fields and a submit button. State tracks form values. | Stack, VStack, Reactive, State, form, layout, input, submit, dynamic | Yes |

### 35. `overlays/menu.examples.ts` — Menu Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `menuBasic` | Create a basic dropdown menu with a trigger button and items. Shows Menu.Root, Menu.Item. | Menu, Root, Item, trigger, dropdown, basic | No |
| `menuWithSeparators` | Create a menu with separators between item groups. Shows Menu.Separator for visual grouping. | Menu, Root, Item, Separator, groups, divider | No |
| `menuPlacement` | Create menus with different placement options (bottom, top, right, left). | Menu, Root, Item, placement, bottom, top, right, left | No |

### 36. `overlays/tooltip.examples.ts` — Tooltip Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `tooltipBasic` | Create a basic tooltip with trigger component and text content. Shows Tooltip.Root. | Tooltip, Root, trigger, content, basic | No |
| `tooltipPlacement` | Create tooltips with different placement and arrow options. | Tooltip, Root, placement, hasArrow, top, bottom, left, right | No |

### 37. `typography/text.examples.ts` — Text Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `textBasic` | Create basic text with a string value. Minimal Text.Root usage. | Text, Root, value, basic | No |
| `textFontStyles` | Create text with fontWeight (bold, semibold, light), fontStyle (italic), and textTransform (uppercase, capitalize). | Text, Root, fontWeight, fontStyle, textTransform, bold, italic, uppercase | No |
| `textColorAndAlign` | Create text with custom color, background, and textAlign (left, center, right, justify). | Text, Root, color, background, textAlign, left, center, right | No |
| `textWithBorders` | Create text with border styling: borderWidth, borderStyle (solid, dashed, dotted), and borderColor. | Text, Root, borderWidth, borderStyle, borderColor, solid, dashed, dotted | No |

### 38. `typography/code.examples.ts` — Code Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `codeBasic` | Create inline code with a value string. | Code, Root, inline, value, basic | No |
| `codeStyled` | Create styled code with variant (subtle, surface, outline), colorPalette, and size. | Code, Root, variant, subtle, surface, outline, colorPalette, size | No |

### 39. `typography/code-block.examples.ts` — CodeBlock Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `codeBlockBasic` | Create a code block with code string and language. | CodeBlock, Root, code, language, basic | No |
| `codeBlockWithLineNumbers` | Create a code block with line numbers and highlighted lines. | CodeBlock, Root, showLineNumbers, highlightLines, lines | No |
| `codeBlockMaxHeight` | Create a scrollable code block with maxHeight constraint for long code. | CodeBlock, Root, maxHeight, scrollable, long | No |

### 40. `typography/heading.examples.ts` — Heading Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `headingBasic` | Create a basic heading with value and size. | Heading, Root, value, size, basic | No |
| `headingSemantic` | Create headings with semantic level (h1–h6) using the `as` prop. | Heading, Root, as, h1, h2, h3, semantic, level | No |
| `headingStyled` | Create headings with color and textAlign options. | Heading, Root, color, textAlign, styled | No |

### 41. `typography/highlight.examples.ts` — Highlight Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `highlightBasic` | Highlight search terms within text using query array. | Highlight, Root, query, search, terms, basic | No |
| `highlightCustomColor` | Highlight with custom highlight color. | Highlight, Root, query, color, custom, styled | No |

### 42. `typography/link.examples.ts` — Link Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `linkBasic` | Create a basic link with value and href. | Link, Root, value, href, basic | No |
| `linkExternal` | Create an external link with variant (underline/plain) and colorPalette. | Link, Root, external, variant, underline, plain, colorPalette | No |

### 43. `typography/list.examples.ts` — List Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `listUnordered` | Create an unordered list with string items and gap spacing. | List, Root, unordered, items, gap, basic | No |
| `listOrdered` | Create an ordered list with colorPalette styling. | List, Root, ordered, colorPalette, styled | No |

### 44. `typography/mark.examples.ts` — Mark Component

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `markBasic` | Create a basic text mark/highlight with value. | Mark, Root, value, highlight, basic | No |
| `markVariantsAndColors` | Create marks with different variants (subtle, solid, text, plain) and color palettes. | Mark, Root, variant, subtle, solid, colorPalette, yellow, green | No |

### 45. `charts/area.examples.ts` — Area Chart

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `areaChartBasic` | Create a basic area chart with single series and color. | Chart, Area, series, color, basic | No |
| `areaChartStacked` | Create a stacked area chart with multiple series using stackId and stackOffset expand. | Chart, Area, stacked, stackId, stackOffset, expand, multiple | No |
| `areaChartComplete` | Create a complete area chart with axis config, grid, tooltip, legend, fill opacity, and natural curve type. | Chart, Area, xAxis, grid, tooltip, legend, fillOpacity, curveType, complete | No |
| `areaChartPivot` | Create an area chart using pivotKey for long/pivoted data format with pivotColors mapping. | Chart, Area, pivotKey, valueKey, pivotColors, long, pivoted | No |
| `areaChartMulti` | Create an area chart with Chart.AreaMulti for sparse multi-series data in record form. | Chart, AreaMulti, multi, sparse, series, record | No |

### 46. `charts/bar.examples.ts` — Bar Chart

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `barChartBasic` | Create a basic vertical bar chart with single series. | Chart, Bar, vertical, series, basic | No |
| `barChartStacked` | Create a stacked bar chart with multiple series. | Chart, Bar, stacked, stackId, multiple | No |
| `barChartHorizontal` | Create a horizontal bar chart using layout: "vertical". | Chart, Bar, horizontal, layout, vertical | No |
| `barChartComplete` | Create a complete bar chart with axis formatting, grid, tooltip, legend, brush, and barSize/barGap. | Chart, Bar, xAxis, tickFormat, grid, tooltip, legend, brush, barSize, barGap, complete | No |
| `barChartPivot` | Create a bar chart with pivotKey for dynamic series from pivoted data. | Chart, Bar, pivotKey, valueKey, pivotColors, dynamic | No |

### 47. `charts/bar-list.examples.ts` — BarList Chart

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `barListBasic` | Create a basic horizontal bar list with name-value pairs. | Chart, BarList, horizontal, name, value, basic | No |
| `barListSorted` | Create a bar list with sort configuration (by value/name, asc/desc) and value formatting (compact, percent, currency). | Chart, BarList, sort, valueFormat, compact, currency, percent | No |
| `barListTrafficSource` | Real-world traffic source bar list with per-item colors and showValue/showLabel display options. | Chart, BarList, traffic, source, color, showValue, showLabel, realistic | No |

### 48. `charts/bar-segment.examples.ts` — BarSegment Chart

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `barSegmentBasic` | Create a basic bar segment chart with colored segments. | Chart, BarSegment, segments, color, basic | No |
| `barSegmentStyled` | Create a bar segment chart with sort, showValue, showLabel, and per-item colors. | Chart, BarSegment, sort, showValue, showLabel, styled | No |

### 49. `charts/line.examples.ts` — Line Chart

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `lineChartBasic` | Create a basic line chart with single series. | Chart, Line, series, basic | No |
| `lineChartMultiSeries` | Create a line chart with multiple series and different curve types. | Chart, Line, multiple, series, curveType, natural, monotone | No |
| `lineChartWithDots` | Create a line chart with showDots, connectNulls, and stroke width customization. | Chart, Line, showDots, connectNulls, strokeWidth | No |
| `lineChartReference` | Create a line chart with reference lines, reference dots, and reference areas for annotations. | Chart, Line, referenceLines, referenceDots, referenceAreas, annotations | No |
| `lineChartComplete` | Create a complete line chart with all display options, brush, margin, and axis configuration. | Chart, Line, grid, tooltip, legend, brush, margin, xAxis, yAxis, complete | No |

### 50. `charts/pie.examples.ts` — Pie Chart

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `pieChartBasic` | Create a basic pie chart with data slices (name, value, color). | Chart, Pie, slices, name, value, color, basic | No |
| `pieChartDonut` | Create a donut chart with innerRadius and outerRadius configuration. | Chart, Pie, donut, innerRadius, outerRadius | No |
| `pieChartSemiCircle` | Create a semi-circle pie chart with startAngle and endAngle, plus labels, legend, and tooltip. | Chart, Pie, semiCircle, startAngle, endAngle, showLabels, legend | No |

### 51. `charts/radar.examples.ts` — Radar Chart

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `radarChartBasic` | Create a basic radar chart with single series and dataKey for labels. | Chart, Radar, series, dataKey, basic | No |
| `radarChartMulti` | Create a radar chart with multiple overlapping series, fill opacity, grid, and legend. | Chart, Radar, multiple, series, fillOpacity, grid, legend | No |

### 52. `charts/scatter.examples.ts` — Scatter Chart

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `scatterChartBasic` | Create a basic scatter plot with x/y data series. | Chart, Scatter, series, x, y, basic | No |
| `scatterChartStyled` | Create a scatter chart with axis configuration, grid, tooltip, custom point size. | Chart, Scatter, xAxis, yAxis, grid, tooltip, pointSize, styled | No |
| `scatterChartMulti` | Create a scatter chart with Chart.ScatterMulti for multiple independent series. | Chart, ScatterMulti, multi, multiple, series | No |

### 53. `charts/sparkline.examples.ts` — Sparkline

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `sparklineBasic` | Create a basic sparkline with data array. | Sparkline, data, basic, inline | No |
| `sparklineStyled` | Create a sparkline with chart type (line/area), color, and custom dimensions. | Sparkline, type, line, area, color, height, width, styled | No |

### 54. `charts/composed.examples.ts` — Composed Chart

| Export Name | Description | Keywords | Reactive |
|-------------|-------------|----------|----------|
| `composedChartBasic` | Create a basic composed chart mixing bar and line series in one chart. | Chart, Composed, bar, line, mixed, basic | No |
| `composedChartWithAreaRange` | Create a composed chart with area-range (confidence band) series using lowKey/highKey alongside line series. | Chart, Composed, area, range, lowKey, highKey, confidence, band | No |
| `composedChartComplete` | Create a complete composed chart with bar, line, area, scatter series, individual series options (showDots, strokeDasharray, fillOpacity), and all display options. | Chart, Composed, bar, line, area, scatter, grid, tooltip, legend, curveType, complete | No |

---

## Wiring Examples into Spec Files

Each spec file will be updated to:

1. Add import: `import * as ex from "./<name>.examples.js";`
2. Add `assert.examples(test, { ... })` calls before relevant test sections

Since these tests don't use a custom `assertEast` object with `examples()` method (they use `describeEast` + `Assert` from `@elaraai/east-node-std`), we need to either:
- **Option A:** Create a shared `assertEast` helper in the test directory (like `platforms.spec.ts` in other packages) that provides `examples()` functionality
- **Option B:** Register examples inline using individual test calls

**Recommendation:** Create `test/platforms.spec.ts` with an `assertEast` object that includes the `examples()` method, following the pattern from other East packages. Then each spec file imports `assertEast` and wires examples.

---

## Implementation Order

1. **Phase 1 — Infrastructure:**
   - Update `tsconfig.json` to include test files and set rootDir
   - Create `test/platforms.spec.ts` with `assertEast.examples()` helper

2. **Phase 2 — Layout & Typography (foundational):**
   - `box.examples.ts`, `stack.examples.ts`, `flex.examples.ts`, `grid.examples.ts`
   - `separator.examples.ts`, `splitter.examples.ts`
   - `text.examples.ts`, `heading.examples.ts`, `code.examples.ts`, `code-block.examples.ts`
   - `link.examples.ts`, `list.examples.ts`, `mark.examples.ts`, `highlight.examples.ts`

3. **Phase 3 — Display & Feedback:**
   - `badge.examples.ts`, `tag.examples.ts`, `avatar.examples.ts`, `stat.examples.ts`, `icon.examples.ts`
   - `alert.examples.ts`, `progress.examples.ts`

4. **Phase 4 — Forms:**
   - `input.examples.ts`, `select.examples.ts`, `checkbox.examples.ts`, `switch.examples.ts`
   - `slider.examples.ts`, `textarea.examples.ts`, `tags-input.examples.ts`
   - `combobox.examples.ts`, `field.examples.ts`, `file-upload.examples.ts`

5. **Phase 5 — Containers & Disclosure:**
   - `button.examples.ts`, `card.examples.ts`
   - `accordion.examples.ts`, `tabs.examples.ts`, `carousel.examples.ts`
   - `menu.examples.ts`, `tooltip.examples.ts`

6. **Phase 6 — Collections:**
   - `table.examples.ts`, `data-list.examples.ts`
   - `tree-view.examples.ts`, `gantt.examples.ts`, `planner.examples.ts`

7. **Phase 7 — Charts:**
   - `area.examples.ts`, `bar.examples.ts`, `line.examples.ts`, `pie.examples.ts`
   - `scatter.examples.ts`, `radar.examples.ts`, `sparkline.examples.ts`
   - `bar-list.examples.ts`, `bar-segment.examples.ts`, `composed.examples.ts`

8. **Phase 8 — Composition:**
   - `component.examples.ts` (depends on many components being available)

---

## Summary

- **54 example files** with **~175 total examples**
- **~25 examples** use `Reactive.Root` with State for interactive patterns
- **~150 examples** demonstrate static component creation
- All examples use `@elaraai/east-ui` package imports (not relative paths)
- Every example has `keywords` for search indexing and a `description` for documentation
- Examples prioritize realistic use cases (dashboard layouts, form patterns, data tables) over exhaustive variant testing (that's what the spec files are for)
