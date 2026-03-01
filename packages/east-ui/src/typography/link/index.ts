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
    some,
} from "@elaraai/east";

import { OverflowType, TextDecorationType } from "../../style.js";
import { UIComponentType } from "../../component.js";
import { PaddingType, MarginType } from "../../layout/style.js";
import { LinkType, LinkVariantType, type LinkStyle } from "./types.js";

// Re-export types
export { LinkType, LinkVariantType, type LinkStyle } from "./types.js";

// ============================================================================
// Link Component
// ============================================================================

/**
 * Creates a Link component for navigation.
 *
 * @param value - The link text to display
 * @param href - URL the link points to
 * @param style - Optional styling configuration
 * @returns An East expression representing the link component
 */
function createLink(
    value: SubtypeExprOrValue<StringType>,
    href: SubtypeExprOrValue<StringType>,
    style?: LinkStyle
): ExprType<UIComponentType> {
    const variantValue = style?.variant
        ? (typeof style.variant === "string"
            ? East.value(variant(style.variant, null), LinkVariantType)
            : style.variant)
        : undefined;

    const externalValue = style?.external !== undefined
        ? (typeof style.external === "boolean"
            ? style.external
            : style.external)
        : undefined;

    const textDecorationValue = style?.textDecoration
        ? (typeof style.textDecoration === "string"
            ? East.value(variant(style.textDecoration, null), TextDecorationType)
            : style.textDecoration)
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

    return East.value(variant("Link", {
        value: value,
        href: href,
        external: externalValue !== undefined ? variant("some", externalValue) : variant("none", null),
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
        colorPalette: style?.colorPalette ? variant("some", style.colorPalette) : variant("none", null),
        textDecoration: textDecorationValue ? variant("some", textDecorationValue) : variant("none", null),
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
        lineHeight: style?.lineHeight ? variant("some", style.lineHeight) : variant("none", null),
        letterSpacing: style?.letterSpacing ? variant("some", style.letterSpacing) : variant("none", null),
        opacity: style?.opacity !== undefined ? variant("some", style.opacity) : variant("none", null),
    }), UIComponentType);
}

/**
 * Link component for accessible navigation.
 *
 * @remarks
 * Use `Link.Root(value, href, style)` to create navigation links.
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { Link, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Link.Root("Visit our site", "https://example.com", {
 *         external: true,
 *         colorPalette: "blue",
 *     });
 * });
 * ```
 */
export const Link = {
    Root: createLink,
    Types: {
        Link: LinkType,
        Variant: LinkVariantType,
    },
} as const;
