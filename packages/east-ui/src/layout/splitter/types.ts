/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    StructType,
    OptionType,
    StringType,
    FloatType,
    BooleanType,
    type SubtypeExprOrValue,
} from "@elaraai/east";
import { OrientationType } from "../../style.js";
import type { OrientationLiteral } from "../../style.js";

// ============================================================================
// Splitter Panel Style Type
// ============================================================================

/**
 * Style type for Splitter panel configuration.
 *
 * @remarks
 * This struct type defines the configuration for a single panel in the Splitter.
 * Each panel has a unique identifier, content, and optional sizing/behavior constraints.
 *
 * @property id - Unique identifier for the panel (used for ResizeTrigger references)
 * @property minSize - Minimum size as a percentage (0-100)
 * @property maxSize - Maximum size as a percentage (0-100)
 * @property collapsible - Whether the panel can be collapsed
 * @property defaultCollapsed - Whether the panel starts collapsed
 */
export const SplitterPanelStyleType = StructType({
    id: StringType,
    minSize: OptionType(FloatType),
    maxSize: OptionType(FloatType),
    collapsible: OptionType(BooleanType),
    defaultCollapsed: OptionType(BooleanType),
});

/**
 * Type representing the Splitter panel style structure.
 */
export type SplitterPanelStyleType = typeof SplitterPanelStyleType;

/**
 * TypeScript interface for Splitter panel style options.
 *
 * @remarks
 * Use this interface when creating panel configurations with the
 * {@link SplitterPanel} function.
 *
 * @property id - Unique identifier for the panel
 * @property minSize - Minimum size as a percentage (0-100)
 * @property maxSize - Maximum size as a percentage (0-100)
 * @property collapsible - Whether the panel can be collapsed
 * @property defaultCollapsed - Whether the panel starts collapsed
 */
export interface SplitterPanelStyle {
    /** Unique identifier for the panel (used for ResizeTrigger references) */
    id: SubtypeExprOrValue<StringType>;
    /** Minimum size as a percentage (0-100) */
    minSize?: SubtypeExprOrValue<FloatType>;
    /** Maximum size as a percentage (0-100) */
    maxSize?: SubtypeExprOrValue<FloatType>;
    /** Whether the panel can be collapsed */
    collapsible?: SubtypeExprOrValue<BooleanType>;
    /** Whether the panel starts collapsed */
    defaultCollapsed?: SubtypeExprOrValue<BooleanType>;
}

// ============================================================================
// Splitter Style Type
// ============================================================================

/**
 * Style type for Splitter container configuration.
 *
 * @remarks
 * This struct type defines the styling configuration for the Splitter container.
 * It controls the layout orientation of the panels.
 *
 * @property orientation - Layout orientation (horizontal or vertical)
 */
export const SplitterStyleType = StructType({
    orientation: OptionType(OrientationType),
});

/**
 * Type representing the Splitter style structure.
 */
export type SplitterStyleType = typeof SplitterStyleType;

/**
 * TypeScript interface for Splitter style options.
 *
 * @remarks
 * Use this interface when creating Splitter containers with the
 * {@link SplitterRoot} function.
 *
 * @property orientation - Layout orientation (horizontal or vertical)
 */
export interface SplitterStyle {
    /** Layout orientation (horizontal or vertical) */
    orientation?: SubtypeExprOrValue<OrientationType> | OrientationLiteral;
}
