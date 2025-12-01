/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    OptionType,
    StructType,
    ArrayType,
    variant,
    StringType,
    some,
    none,
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import {
    GridAutoFlowType,
    GridStyleType,
    type GridStyle,
} from "./types.js";
import {
    JustifyContentType,
    AlignItemsType,
} from "../../style.js";


// Re-export style types
export {
    GridStyleType,
    GridAutoFlowType,
    type GridStyle,
} from "./types.js";
export { GridAutoFlow } from "./types.js";

// ============================================================================
// Grid Item Type
// ============================================================================

/**
 * The concrete East type for Grid item data.
 *
 * @remarks
 * This struct type represents a single item within a Grid.
 * Each item has content (a UI component) and optional placement properties.
 *
 * @property content - The UI component to render in this grid cell
 * @property colSpan - Number of columns the item spans
 * @property rowSpan - Number of rows the item spans
 * @property colStart - Starting column line
 * @property colEnd - Ending column line
 * @property rowStart - Starting row line
 * @property rowEnd - Ending row line
 */
export const GridItemType = StructType({
    content: UIComponentType,
    colSpan: OptionType(StringType),
    rowSpan: OptionType(StringType),
    colStart: OptionType(StringType),
    colEnd: OptionType(StringType),
    rowStart: OptionType(StringType),
    rowEnd: OptionType(StringType),
});

export interface GridItemStyle {
    colSpan?: SubtypeExprOrValue<StringType>;
    rowSpan?: SubtypeExprOrValue<StringType>;
    colStart?: SubtypeExprOrValue<StringType>;
    colEnd?: SubtypeExprOrValue<StringType>;
    rowStart?: SubtypeExprOrValue<StringType>;
    rowEnd?: SubtypeExprOrValue<StringType>;
}

/**
 * Type representing the Grid item structure.
 */
export type GridItemType = typeof GridItemType;

export function GridItem(
    content: SubtypeExprOrValue<UIComponentType>,
    style?: GridItemStyle
): ExprType<GridItemType> {
    const content_expr = East.value(content, UIComponentType);
    return East.value({
        content: content_expr,
        colSpan: style?.colSpan ? some(style.colSpan) : none,
        rowSpan: style?.rowSpan ? some(style.rowSpan) : none,
        colStart: style?.colStart ? some(style.colStart) : none,
        colEnd: style?.colEnd ? some(style.colEnd) : none,
        rowStart: style?.rowStart ? some(style.rowStart) : none,
        rowEnd: style?.rowEnd ? some(style.rowEnd) : none,
    }, GridItemType);
}

// ============================================================================
// Grid Root Function
// ============================================================================

/**
 * Creates a Grid container component with items and optional styling.
 *
 * @param items - Array of grid items created with Grid.Item
 * @param style - Optional styling configuration for the grid
 * @returns An East expression representing the styled grid component
 *
 * @remarks
 * Grid is a powerful layout component that uses CSS Grid for two-dimensional
 * layouts. It supports template definitions, gap configuration, alignment,
 * and automatic item placement.
 *
 * @example
 * ```ts
 * import { Grid, Text } from "@elaraai/east-ui";
 * import { East, variant, ArrayType } from "@elaraai/east";
 *
 * // Basic 3-column grid
 * const grid = Grid.Root(
 *   East.value([
 *     Grid.Item(variant("Text", Text(...))),
 *     Grid.Item(variant("Text", Text(...)), { colSpan: 2 }),
 *     Grid.Item(variant("Text", Text(...))),
 *   ], ArrayType(GridItemType)),
 *   {
 *     templateColumns: "repeat(3, 1fr)",
 *     gap: "4",
 *   }
 * );
 *
 * // Responsive grid with auto-fit
 * const responsiveGrid = Grid.Root(items, {
 *   templateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
 *   gap: "6",
 * });
 * ```
 */
function GridRoot(
    items: SubtypeExprOrValue<ArrayType<GridItemType>>,
    style?: GridStyle
): ExprType<UIComponentType> {
    const items_expr = East.value(items, ArrayType(GridItemType));
    const toStringOption = (value: SubtypeExprOrValue<StringType> | undefined) => {
        if (value === undefined) return variant("none", null);
        return variant("some", value);
    };

    const justifyItemsValue = style?.justifyItems
        ? (typeof style.justifyItems === "string"
            ? East.value(variant(style.justifyItems, null), JustifyContentType)
            : style.justifyItems)
        : undefined;

    const alignItemsValue = style?.alignItems
        ? (typeof style.alignItems === "string"
            ? East.value(variant(style.alignItems, null), AlignItemsType)
            : style.alignItems)
        : undefined;

    const justifyContentValue = style?.justifyContent
        ? (typeof style.justifyContent === "string"
            ? East.value(variant(style.justifyContent, null), JustifyContentType)
            : style.justifyContent)
        : undefined;

    const alignContentValue = style?.alignContent
        ? (typeof style.alignContent === "string"
            ? East.value(variant(style.alignContent, null), AlignItemsType)
            : style.alignContent)
        : undefined;

    const autoFlowValue = style?.autoFlow
        ? (typeof style.autoFlow === "string"
            ? East.value(variant(style.autoFlow, null), GridAutoFlowType)
            : style.autoFlow)
        : undefined;
    return East.value(variant("Grid", {
        items: items_expr,
        style: style ?
            variant("some", {
                templateColumns: toStringOption(style.templateColumns),
                templateRows: toStringOption(style.templateRows),
                templateAreas: toStringOption(style.templateAreas),
                gap: toStringOption(style.gap),
                columnGap: toStringOption(style.columnGap),
                rowGap: toStringOption(style.rowGap),
                justifyItems: justifyItemsValue ? variant("some", justifyItemsValue) : variant("none", null),
                alignItems: alignItemsValue ? variant("some", alignItemsValue) : variant("none", null),
                justifyContent: justifyContentValue ? variant("some", justifyContentValue) : variant("none", null),
                alignContent: alignContentValue ? variant("some", alignContentValue) : variant("none", null),
                autoColumns: toStringOption(style.autoColumns),
                autoRows: toStringOption(style.autoRows),
                autoFlow: autoFlowValue ? variant("some", autoFlowValue) : variant("none", null),
            }) :
            variant("none", null),
    }), UIComponentType);
}

export const GridType = StructType({
    items: ArrayType(GridItemType),
    style: OptionType(GridStyleType),
})

// ============================================================================
// Grid Namespace Export
// ============================================================================

/**
 * Grid compound component for CSS Grid layouts.
 *
 * @remarks
 * Grid provides a two-dimensional layout system using CSS Grid.
 * Use Grid.Root to create the container and Grid.Item for each cell.
 *
 * @example
 * ```ts
 * import { Grid, Text } from "@elaraai/east-ui";
 *
 * const layout = Grid.Root(
 *   East.value([
 *     Grid.Item(variant("Text", mainContent), { colSpan: 2 }),
 *     Grid.Item(variant("Text", sidebar)),
 *     Grid.Item(variant("Text", footer), { colSpan: 3 }),
 *   ], ArrayType(GridItemType)),
 *   {
 *     templateColumns: "repeat(3, 1fr)",
 *     gap: "4",
 *   }
 * );
 * ```
 */
export const Grid = {
    Root: GridRoot,
    Item: GridItem,
    Types: {
        Grid: GridType,
        Item: GridItemType,
        Style: GridStyleType,
    },
} as const;
