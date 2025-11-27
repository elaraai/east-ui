/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType,
    NullType,
    VariantType,
    East,
    variant,
} from "@elaraai/east";

import { SizeType, OrientationType } from "../../style.js";
import type { SizeLiteral, OrientationLiteral } from "../../style.js";

// ============================================================================
// DataList Variant Type
// ============================================================================

/**
 * Variant types for DataList visual style.
 *
 * @remarks
 * - subtle: Light/subtle styling
 * - bold: Bold/emphasized styling
 */
export const DataListVariantType = VariantType({
    /** Light/subtle styling */
    subtle: NullType,
    /** Bold/emphasized styling */
    bold: NullType,
});

/**
 * Type representing the DataListVariant structure.
 */
export type DataListVariantType = typeof DataListVariantType;

/**
 * String literal type for data list variant values.
 */
export type DataListVariantLiteral = "subtle" | "bold";

/**
 * Helper function to create data list variant values.
 *
 * @param v - The variant string ("subtle" or "bold")
 * @returns An East expression representing the data list variant
 *
 * @example
 * ```ts
 * import { DataList, DataListVariant } from "@elaraai/east-ui";
 *
 * const list = DataList.Root([...], {
 *   variant: DataListVariant("bold"),
 * });
 * ```
 */
export function DataListVariant(v: "subtle" | "bold"): ExprType<DataListVariantType> {
    return East.value(variant(v, null), DataListVariantType);
}

/**
 * TypeScript interface for DataList style options.
 *
 * @property orientation - Layout direction (horizontal or vertical)
 * @property size - Size of the data list
 * @property variant - Visual variant (subtle or bold)
 */
export interface DataListStyle {
    /** Layout direction (horizontal or vertical) */
    orientation?: ExprType<OrientationType> | OrientationLiteral;
    /** Size of the data list */
    size?: ExprType<SizeType> | SizeLiteral;
    /** Visual variant (subtle or bold) */
    variant?: ExprType<DataListVariantType> | DataListVariantLiteral;
}
