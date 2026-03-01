/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type SubtypeExprOrValue,
    type ExprType,
    East,
    StringType,
    variant,
    ArrayType,
    some,
} from "@elaraai/east";

import { OverflowType } from "../../style.js";
import { UIComponentType } from "../../component.js";
import { PaddingType, MarginType } from "../../layout/style.js";
import { ListType, ListVariantType, type ListStyle } from "./types.js";

// Re-export types
export { ListType, ListVariantType, type ListStyle } from "./types.js";

/**
 * Creates a List component.
 *
 * @param items - Array of list items (strings or config objects)
 * @param style - Optional styling configuration
 * @returns An East expression representing the list component
 */
function createList(
    items: SubtypeExprOrValue<ArrayType<StringType>>,
    style?: ListStyle
): ExprType<UIComponentType> {
    const variantValue = style?.variant
        ? (typeof style.variant === "string"
            ? East.value(variant(style.variant, null), ListVariantType)
            : style.variant)
        : undefined;

    const overflowValue = style?.overflow
        ? (typeof style.overflow === "string"
            ? East.value(variant(style.overflow, null), OverflowType)
            : style.overflow)
        : undefined;

    const overflowXValue = style?.overflowX
        ? (typeof style.overflowX === "string"
            ? East.value(variant(style.overflowX, null), OverflowType)
            : style.overflowX)
        : undefined;

    const overflowYValue = style?.overflowY
        ? (typeof style.overflowY === "string"
            ? East.value(variant(style.overflowY, null), OverflowType)
            : style.overflowY)
        : undefined;

    const paddingValue = style?.padding
        ? (typeof style.padding === "string"
            ? East.value({
                top: some(style.padding),
                right: some(style.padding),
                bottom: some(style.padding),
                left: some(style.padding)
            }, PaddingType)
            : style.padding)
        : undefined;

    const marginValue = style?.margin
        ? (typeof style.margin === "string"
            ? East.value({
                top: some(style.margin),
                right: some(style.margin),
                bottom: some(style.margin),
                left: some(style.margin)
            }, MarginType)
            : style.margin)
        : undefined;

    return East.value(variant("List", {
        items,
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
        gap: style?.gap ? variant("some", style.gap) : variant("none", null),
        colorPalette: style?.colorPalette ? variant("some", style.colorPalette) : variant("none", null),
        overflow: overflowValue ? variant("some", overflowValue) : variant("none", null),
        overflowX: overflowXValue ? variant("some", overflowXValue) : variant("none", null),
        overflowY: overflowYValue ? variant("some", overflowYValue) : variant("none", null),
        width: style?.width ? variant("some", style.width) : variant("none", null),
        height: style?.height ? variant("some", style.height) : variant("none", null),
        minWidth: style?.minWidth ? variant("some", style.minWidth) : variant("none", null),
        minHeight: style?.minHeight ? variant("some", style.minHeight) : variant("none", null),
        maxWidth: style?.maxWidth ? variant("some", style.maxWidth) : variant("none", null),
        maxHeight: style?.maxHeight ? variant("some", style.maxHeight) : variant("none", null),
        padding: paddingValue ? variant("some", paddingValue) : variant("none", null),
        margin: marginValue ? variant("some", marginValue) : variant("none", null),
        opacity: style?.opacity !== undefined ? variant("some", style.opacity) : variant("none", null),
    }), UIComponentType);
}

/**
 * List component for ordered and unordered lists.
 *
 * @remarks
 * Use `List.Root(items, style)` to create lists with an array of string items.
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { List, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return List.Root([
 *         "First item",
 *         "Second item",
 *         "Third item",
 *     ], {
 *         variant: "unordered",
 *         gap: "2",
 *     });
 * });
 * ```
 */
export const List = {
    Root: createList,
    Types: {
        List: ListType,
        Variant: ListVariantType,
    },
} as const;
