/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    East,
    OptionType,
    StructType,
    ArrayType,
    variant,
    type SubtypeExprOrValue,
    some,
} from "@elaraai/east";

import {
    FlexDirectionType,
    JustifyContentType,
    AlignItemsType,
    FlexWrapType,
} from "../../style.js";
import { UIComponentType } from "../../component.js";
import { StackStyleType, type StackStyle } from "./types.js";
import { Padding, PaddingType, Margin, MarginType } from "../style.js";

// Re-export style types
export { StackStyleType, type StackStyle } from "./types.js";

/**
 * The concrete East type for Stack component data.
 *
 * @remarks
 * This struct type represents the serializable data structure for a Stack component.
 * Stack is a container component that arranges children in a single direction.
 *
 * @property children - Array of child UI components
 * @property style - Optional styling configuration wrapped in OptionType
 */
export const StackType = StructType({
    children: ArrayType(UIComponentType),
    style: OptionType(StackStyleType),
});

/**
 * Type representing the Stack component structure.
 */
export type StackType = typeof StackType;

/**
 * Creates a Stack container component with children and optional styling.
 *
 * @param children - Array of child UI components
 * @param style - Optional styling configuration for the stack
 * @returns An East expression representing the styled stack component
 *
 * @remarks
 * Stack arranges children in a single direction (row or column) with consistent
 * spacing. Use HStack for horizontal layout and VStack for vertical layout.
 *
 * @example
 * ```ts
 * import { Stack, Text, Style } from "@elaraai/east-ui";
 * import { East, variant, ArrayType } from "@elaraai/east";
 *
 * // Vertical stack (default)
 * const vstack = Stack(East.value([
 *   variant("Text", Text(East.value(variant("String", "Item 1"), LiteralValueType))),
 *   variant("Text", Text(East.value(variant("String", "Item 2"), LiteralValueType))),
 * ], ArrayType(UIComponentType)), {
 *   gap: "4",
 * });
 *
 * // Horizontal stack
 * const hstack = Stack(East.value([...children], ArrayType(UIComponentType)), {
 *   direction: Style.FlexDirection("row"),
 *   gap: "4",
 *   align: Style.AlignItems("center"),
 * });
 * ```
 */
function createStack(
    children: SubtypeExprOrValue<ArrayType<UIComponentType>>,
    style?: StackStyle
): ExprType<UIComponentType> {
    const directionValue = style?.direction
        ? (typeof style.direction === "string"
            ? East.value(variant(style.direction, null), FlexDirectionType)
            : style.direction)
        : undefined;

    const alignValue = style?.align
        ? (typeof style.align === "string"
            ? East.value(variant(style.align, null), AlignItemsType)
            : style.align)
        : undefined;

    const justifyValue = style?.justify
        ? (typeof style.justify === "string"
            ? East.value(variant(style.justify, null), JustifyContentType)
            : style.justify)
        : undefined;

    const wrapValue = style?.wrap
        ? (typeof style.wrap === "string"
            ? East.value(variant(style.wrap, null), FlexWrapType)
            : style.wrap)
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

    return East.value(variant("Stack", {
        children: children,
        style: style ? variant("some", East.value({
            direction: directionValue ? variant("some", directionValue) : variant("none", null),
            gap: style.gap ? variant("some", style.gap) : variant("none", null),
            align: alignValue ? variant("some", alignValue) : variant("none", null),
            justify: justifyValue ? variant("some", justifyValue) : variant("none", null),
            wrap: wrapValue ? variant("some", wrapValue) : variant("none", null),
            padding: paddingValue ? variant("some", paddingValue) : variant("none", null),
            margin: marginValue ? variant("some", marginValue) : variant("none", null),
            background: style.background ? variant("some", style.background) : variant("none", null),
            width: style.width ? variant("some", style.width) : variant("none", null),
            height: style.height ? variant("some", style.height) : variant("none", null),
        }, StackStyleType)) : variant("none", null),
    }), UIComponentType);
}

/**
 * Creates a horizontal Stack (row direction).
 *
 * @param children - Array of child UI components
 * @param style - Optional styling configuration (direction is overridden to row)
 * @returns An East expression representing the horizontal stack component
 *
 * @example
 * ```ts
 * const hstack = HStack(East.value([...children], ArrayType(UIComponentType)), {
 *   gap: "4",
 *   align: Style.AlignItems("center"),
 * });
 * ```
 */
function createHStack(
    children: SubtypeExprOrValue<ArrayType<UIComponentType>>,
    style?: Omit<StackStyle, "direction">
): ExprType<UIComponentType> {
    return createStack(children, {
        ...style,
        direction: East.value(variant("row", null), FlexDirectionType),
    });
}

/**
 * Creates a vertical Stack (column direction).
 *
 * @param children - Array of child UI components
 * @param style - Optional styling configuration (direction is overridden to column)
 * @returns An East expression representing the vertical stack component
 *
 * @example
 * ```ts
 * const vstack = VStack(East.value([...children], ArrayType(UIComponentType)), {
 *   gap: "4",
 *   align: Style.AlignItems("stretch"),
 * });
 * ```
 */
function createVStack(
    children: SubtypeExprOrValue<ArrayType<UIComponentType>>,
    style?: Omit<StackStyle, "direction">
): ExprType<UIComponentType> {
    return createStack(children, {
        ...style,
        direction: East.value(variant("column", null), FlexDirectionType),
    });
}

/**
 * Stack container component for flex-based layouts.
 *
 * @remarks
 * Use `Stack.Root(children, style)` for general stack, `Stack.HStack()` for horizontal, `Stack.VStack()` for vertical.
 */
export const Stack = {
    Root: createStack,
    HStack: createHStack,
    VStack: createVStack,
    Padding,
    Margin,
    Types: {
        Stack: StackType,
        Style: StackStyleType,
        Padding: PaddingType,
        Margin: MarginType,
    },
} as const;
