/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    ArrayType,
    variant,
} from "@elaraai/east";

import { ColorSchemeType } from "../../style.js";
import { UIComponentType } from "../../component.js";
import { BreadcrumbVariantType, BreadcrumbSizeType, BreadcrumbItemType, BreadcrumbRootType, type BreadcrumbStyle } from "./types.js";

// Re-export types
export { BreadcrumbVariantType, BreadcrumbSizeType, BreadcrumbItemType, BreadcrumbRootType, type BreadcrumbStyle, type BreadcrumbSizeLiteral } from "./types.js";


// ============================================================================
// Breadcrumb Root Function
// ============================================================================

/**
 * Creates a Breadcrumb component with items and optional styling.
 *
 * @param items - Array of breadcrumb item configurations
 * @param style - Optional styling configuration
 * @returns An East expression representing the breadcrumb component
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { Breadcrumb, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return Breadcrumb.Root([
 *         { label: "Home", current: variant("none", null), onClick: variant("some", myClickFn) },
 *         { label: "Products", current: variant("none", null), onClick: variant("some", myClickFn) },
 *         { label: "Widget", current: variant("some", true), onClick: variant("none", null) },
 *     ], {
 *         variant: "plain",
 *         size: "md",
 *     });
 * });
 * ```
 */
function createBreadcrumb(
    items: SubtypeExprOrValue<ArrayType<BreadcrumbItemType>>,
    style?: BreadcrumbStyle
): ExprType<UIComponentType> {
    const variantValue = style?.variant
        ? (typeof style.variant === "string"
            ? East.value(variant(style.variant, null), BreadcrumbVariantType)
            : style.variant)
        : undefined;

    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), BreadcrumbSizeType)
            : style.size)
        : undefined;

    const colorPaletteValue = style?.colorPalette
        ? (typeof style.colorPalette === "string"
            ? East.value(variant(style.colorPalette, null), ColorSchemeType)
            : style.colorPalette)
        : undefined;

    return East.value(variant("Breadcrumb", {
        items: items,
        variant: variantValue ? variant("some", variantValue) : variant("none", null),
        size: sizeValue ? variant("some", sizeValue) : variant("none", null),
        colorPalette: colorPaletteValue ? variant("some", colorPaletteValue) : variant("none", null),
    }), UIComponentType);
}

// ============================================================================
// Breadcrumb Compound Component
// ============================================================================

/**
 * Breadcrumb component for navigation hierarchy display.
 *
 * @remarks
 * Use `Breadcrumb.Root(items, style)` to create a breadcrumb navigation.
 */
export const Breadcrumb = {
    /**
     * Creates a Breadcrumb component with items and optional styling.
     *
     * @param items - Array of breadcrumb item configurations
     * @param style - Optional styling configuration
     * @returns An East expression representing the breadcrumb component
     *
     * @example
     * ```ts
     * import { East, variant } from "@elaraai/east";
     * import { Breadcrumb, UIComponentType } from "@elaraai/east-ui";
     *
     * const example = East.function([], UIComponentType, $ => {
     *     return Breadcrumb.Root([
     *         { label: "Home", current: variant("none", null), onClick: variant("some", myClickFn) },
     *         { label: "Products", current: variant("none", null), onClick: variant("some", myClickFn) },
     *         { label: "Widget", current: variant("some", true), onClick: variant("none", null) },
     *     ], {
     *         variant: "plain",
     *         size: "md",
     *     });
     * });
     * ```
     */
    Root: createBreadcrumb,
    Types: {
        /**
         * Type for Breadcrumb component data.
         */
        Root: BreadcrumbRootType,
        /**
         * Type for a single breadcrumb item.
         */
        Item: BreadcrumbItemType,
        /**
         * Variant type for breadcrumb visual style.
         */
        Variant: BreadcrumbVariantType,
        Size: BreadcrumbSizeType,
    },
} as const;
