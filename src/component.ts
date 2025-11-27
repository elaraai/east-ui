/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    RecursiveType,
    VariantType,
    ArrayType,
    OptionType,
    StructType,
    StringType,
    FloatType,
    BooleanType,
} from "@elaraai/east";

// Typography
import { TextType } from "./typography/types.js";

// Layout
import { BoxStyleType } from "./layout/box/types.js";
import { StackStyleType } from "./layout/stack/types.js";
import { SeparatorStyleType } from "./layout/separator/types.js";
import { GridStyleType } from "./layout/grid/types.js";
import { SplitterStyleType } from "./layout/splitter/types.js";

// Buttons
import { ButtonType } from "./buttons/button/types.js";

// Forms
import { StringInputType, IntegerInputType, FloatInputType, DateTimeInputType } from "./forms/input/types.js";
import { CheckboxType } from "./forms/checkbox/types.js";
import { SwitchType } from "./forms/switch/types.js";
import { SelectRootType } from "./forms/select/types.js";
import { SliderType } from "./forms/slider/types.js";
import { FileUploadType } from "./forms/file-upload/types.js";
import { FieldsetStyleType } from "./forms/fieldset/types.js";

// Feedback
import { ProgressType } from "./feedback/progress/types.js";
import { AlertType } from "./feedback/alert/types.js";

// Display
import { BadgeType } from "./display/badge/types.js";
import { TagType } from "./display/tag/types.js";
import { AvatarType } from "./display/avatar/types.js";
import { CardStyleType } from "./container/card/types.js";
import { StatType } from "./display/stat/types.js";

// Collections
import { DataListRootType } from "./collections/data-list/index.js";
import { TableRootType } from "./collections/table/index.js";
// import { TreeViewStyleType } from "./collections/tree-view/types.js";

// Charts
import { SparklineType } from "./charts/sparkline/types.js";
import { AreaChartType } from "./charts/area/types.js";
import { BarChartType } from "./charts/bar/types.js";
import { LineChartType } from "./charts/line/types.js";
import { ScatterChartType } from "./charts/scatter/types.js";
import { PieChartType } from "./charts/pie/types.js";
import { RadarChartType } from "./charts/radar/types.js";
import { BarListType } from "./charts/bar-list/types.js";
import { BarSegmentType } from "./charts/bar-segment/types.js";

// Disclosure
import { AccordionStyleType } from "./disclosure/accordion/types.js";

// Overlays
import { PlacementType } from "./overlays/tooltip/types.js";
import { MenuItemType } from "./overlays/menu/types.js";

/**
 * Recursive type representing any UI component in East UI.
 *
 * @remarks
 * This is a discriminated union of all available UI components.
 * The recursive structure allows container components (Box, Stack, Card)
 * to have children that are also UIComponentType.
 *
 * The `node` parameter in the RecursiveType callback represents
 * UIComponentType itself, enabling recursive children definitions.
 *
 * As new components are added, they should be registered here:
 * - Leaf components: just add their type directly
 * - Container components: use `ArrayType(node)` for children
 *
 * @property Text - Text component for displaying styled text (leaf)
 * @property Button - Button component for interactive actions (leaf)
 * @property Box - Box component for general-purpose layout (container with children)
 * @property Stack - Stack component for flex-based layout (container with children)
 * @property Separator - Separator component for visual dividers (leaf)
 * @property Grid - Grid component for CSS grid layouts (container with items)
 * @property Splitter - Splitter component for resizable panel layouts (container with panels)
 * @property StringInput - String input component for text entry (leaf)
 * @property IntegerInput - Integer input component for whole numbers (leaf)
 * @property FloatInput - Float input component for decimal numbers (leaf)
 * @property DateTimeInput - DateTime input component for date/time entry (leaf)
 * @property Checkbox - Checkbox component for boolean input (leaf)
 * @property Switch - Switch component for toggle input (leaf)
 * @property Select - Select component for dropdown selection (leaf)
 * @property Slider - Slider component for numeric range selection (leaf)
 * @property Field - Field component for form control wrappers (container with control)
 * @property Progress - Progress component for showing completion (leaf)
 * @property Alert - Alert component for feedback messages (leaf)
 * @property Badge - Badge component for labels and counts (leaf)
 * @property Tag - Tag component for categorization (leaf)
 * @property Avatar - Avatar component for user images (leaf)
 * @property Card - Card component for content containers (container with body)
 * @property Stat - Stat component for metric display (leaf)
 * @property DataList - DataList component for label-value pairs (leaf)
 * @property Table - Table component for data display (leaf)
 * @property TreeView - TreeView component for hierarchical data (leaf)
 * @property Accordion - Accordion component for collapsible panels (container with content children)
 * @property Sparkline - Sparkline component for compact inline charts (leaf)
 */
export const UIComponentType = RecursiveType(node => VariantType({
    // Typography
    Text: TextType,

    // Buttons
    Button: ButtonType,

    // Layout - Containers
    Box: StructType({
        children: ArrayType(node),
        style: OptionType(BoxStyleType),
    }),

    Stack: StructType({
        children: ArrayType(node),
        style: OptionType(StackStyleType),
    }),

    Separator: SeparatorStyleType,

    Grid: StructType({
        items: ArrayType(StructType({
            content: node,
            colSpan: OptionType(StringType),
            rowSpan: OptionType(StringType),
            colStart: OptionType(StringType),
            colEnd: OptionType(StringType),
            rowStart: OptionType(StringType),
            rowEnd: OptionType(StringType),
        })),
        style: OptionType(GridStyleType),
    }),

    Splitter: StructType({
        panels: ArrayType(StructType({
            id: StringType,
            content: node,
            minSize: OptionType(FloatType),
            maxSize: OptionType(FloatType),
            collapsible: OptionType(BooleanType),
            defaultCollapsed: OptionType(BooleanType),
        })),
        defaultSize: ArrayType(FloatType),
        style: OptionType(SplitterStyleType),
    }),

    
    // Forms
    StringInput: StringInputType,
    IntegerInput: IntegerInputType,
    FloatInput: FloatInputType,
    DateTimeInput: DateTimeInputType,
    Checkbox: CheckboxType,
    Switch: SwitchType,
    Select: SelectRootType,
    Slider: SliderType,
    FileUpload: FileUploadType,
    Field: StructType({
        label: StringType,
        control: node,
        helperText: OptionType(StringType),
        errorText: OptionType(StringType),
        required: OptionType(BooleanType),
        disabled: OptionType(BooleanType),
        invalid: OptionType(BooleanType),
        readOnly: OptionType(BooleanType),
    }),
    Fieldset: StructType({
        legend: OptionType(StringType),
        helperText: OptionType(StringType),
        errorText: OptionType(StringType),
        content: ArrayType(node),
        disabled: OptionType(BooleanType),
        invalid: OptionType(BooleanType),
        style: OptionType(FieldsetStyleType),
    }),

    // Feedback
    Progress: ProgressType,
    Alert: AlertType,

    // Display
    Badge: BadgeType,
    Tag: TagType,
    Avatar: AvatarType,
    Stat: StatType,

    // Container
    Card: StructType({
        title: OptionType(StringType),
        description: OptionType(StringType),
        body: ArrayType(node),
        style: OptionType(CardStyleType),
    }),
    DataList: DataListRootType,
    Table: TableRootType,

    // Charts
    Sparkline: SparklineType,
    AreaChart: AreaChartType,
    BarChart: BarChartType,
    LineChart: LineChartType,
    ScatterChart: ScatterChartType,
    PieChart: PieChartType,
    RadarChart: RadarChartType,
    BarList: BarListType,
    BarSegment: BarSegmentType,

    // TreeView: StructType({
    //     nodes: ArrayType(RecursiveType(inner => StructType({
    //         value: StringType,
    //         label: StringType,
    //         children: ArrayType(inner),
    //     }))),
    //     label: OptionType(StringType),
    //     defaultExpandedValue: OptionType(ArrayType(StringType)),
    //     defaultSelectedValue: OptionType(ArrayType(StringType)),
    //     // style: OptionType(TreeViewStyleType),
    // }),

    // Disclosure
    Accordion: StructType({
        items: ArrayType(StructType({
            value: StringType,
            trigger: StringType,
            content: ArrayType(node),
            disabled: OptionType(BooleanType),
        })),
        style: OptionType(AccordionStyleType),
    }),

    // Overlays
    Tooltip: StructType({
        trigger: node,
        content: StringType,
        placement: OptionType(PlacementType),
        hasArrow: OptionType(BooleanType),
    }),

    Menu: StructType({
        trigger: node,
        items: ArrayType(MenuItemType),
        placement: OptionType(PlacementType),
    }),
}));

/**
 * Type alias for UIComponentType.
 */
export type UIComponentType = typeof UIComponentType;
