/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
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

import { UIComponentType } from "../../component.js";
import { BoxStyleType, type BoxStyle } from "./types.js";
import {
    DisplayType,
    FlexDirectionType,
    JustifyContentType,
    AlignItemsType,
} from "../../style.js";
import { Padding, PaddingType, Margin, MarginType } from "../style.js";

// Re-export style types
export { BoxStyleType, type BoxStyle } from "./types.js";

/**
 * The concrete East type for Box component data.
 *
 * @remarks
 * This struct type represents the serializable data structure for a Box component.
 * Box is a container component that can hold child components.
 *
 * @property children - Array of child UI components
 * @property style - Optional styling configuration wrapped in OptionType
 */
export const BoxType = StructType({
    children: ArrayType(UIComponentType),
    style: OptionType(BoxStyleType),
});

/**
 * Type representing the Box component structure.
 */
export type BoxType = typeof BoxType;

/**
 * Creates a Box container component with children and optional styling.
 *
 * @param children - Array of child UI components
 * @param style - Optional styling configuration for the box
 * @returns An East expression representing the styled box component
 *
 * @remarks
 * Box is the fundamental building block for layouts. It maps to a div element
 * and supports all common CSS layout properties through style configuration.
 *
 * @example
 * ```ts
 * import { Box, Text, Style } from "@elaraai/east-ui";
 *
 * // Simple box with children (accepts plain arrays)
 * const box = Box.Root([
 *   Text.Root("Hello"),
 * ]);
 *
 * // Styled flex container
 * const flexBox = Box.Root([...children], {
 *   display: Style.Display("flex"),
 *   flexDirection: Style.FlexDirection("column"),
 *   gap: "4",
 *   padding: "4",
 *   background: "gray.100",
 * });
 * ```
 */
function createBox(
    children: SubtypeExprOrValue<ArrayType<UIComponentType>>,
    style?: BoxStyle
): ExprType<UIComponentType> {
    const displayValue = style?.display
        ? (typeof style.display === "string"
            ? East.value(variant(style.display, null), DisplayType)
            : style.display)
        : undefined;

    const flexDirectionValue = style?.flexDirection
        ? (typeof style.flexDirection === "string"
            ? East.value(variant(style.flexDirection, null), FlexDirectionType)
            : style.flexDirection)
        : undefined;

    const justifyContentValue = style?.justifyContent
        ? (typeof style.justifyContent === "string"
            ? East.value(variant(style.justifyContent, null), JustifyContentType)
            : style.justifyContent)
        : undefined;

    const alignItemsValue = style?.alignItems
        ? (typeof style.alignItems === "string"
            ? East.value(variant(style.alignItems, null), AlignItemsType)
            : style.alignItems)
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

    return East.value(variant("Box", {
        children: children,
        style: style ? variant("some", East.value({
            display: displayValue ? variant("some", displayValue) : variant("none", null),
            width: style.width ? variant("some", style.width) : variant("none", null),
            height: style.height ? variant("some", style.height) : variant("none", null),
            padding: paddingValue ? variant("some", paddingValue) : variant("none", null),
            margin: marginValue ? variant("some", marginValue) : variant("none", null),
            background: style.background ? variant("some", style.background) : variant("none", null),
            color: style.color ? variant("some", style.color) : variant("none", null),
            borderRadius: style.borderRadius ? variant("some", style.borderRadius) : variant("none", null),
            flexDirection: flexDirectionValue ? variant("some", flexDirectionValue) : variant("none", null),
            justifyContent: justifyContentValue ? variant("some", justifyContentValue) : variant("none", null),
            alignItems: alignItemsValue ? variant("some", alignItemsValue) : variant("none", null),
            gap: style.gap ? variant("some", style.gap) : variant("none", null),
        }, BoxStyleType)) : variant("none", null),
    }), UIComponentType);
}

/**
 * Box container component for flexible layouts.
 *
 * @remarks
 * Use `Box.Root(children, style)` to create a box, or access `Box.Types.Box` for the East type.
 */
export const Box = {
    Root: createBox,
    Padding,
    Margin,
    Types: {
        Box: BoxType,
        Style: BoxStyleType,
        Padding: PaddingType,
        Margin: MarginType,
    },
} as const;
