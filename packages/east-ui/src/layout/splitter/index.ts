/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
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
    FloatType,
    BooleanType,
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import { OrientationType } from "../../style.js";
import {
    SplitterStyleType,
    type SplitterStyle,
    type SplitterPanelStyle,
} from "./types.js";

// Re-export style types
export {
    SplitterStyleType,
    SplitterPanelStyleType,
    type SplitterStyle,
    type SplitterPanelStyle,
} from "./types.js";

// ============================================================================
// Splitter Panel Type
// ============================================================================

/**
 * The concrete East type for Splitter panel data.
 *
 * @remarks
 * This struct type represents a single panel within a Splitter.
 * Each panel has an identifier, content, and optional sizing constraints.
 *
 * @property id - Unique identifier for the panel
 * @property content - The UI component to render in this panel
 * @property minSize - Minimum size as a percentage (0-100)
 * @property maxSize - Maximum size as a percentage (0-100)
 * @property collapsible - Whether the panel can be collapsed
 * @property defaultCollapsed - Whether the panel starts collapsed
 */
export const SplitterPanelType = StructType({
    id: StringType,
    content: UIComponentType,
    minSize: OptionType(FloatType),
    maxSize: OptionType(FloatType),
    collapsible: OptionType(BooleanType),
    defaultCollapsed: OptionType(BooleanType),
});

/**
 * Type representing the Splitter panel structure.
 */
export type SplitterPanelType = typeof SplitterPanelType;

// ============================================================================
// Splitter Type
// ============================================================================

/**
 * The concrete East type for Splitter component data.
 *
 * @remarks
 * This struct type represents the serializable data structure for a Splitter component.
 * Splitter provides resizable panels with draggable dividers between them.
 *
 * @property panels - Array of panel configurations
 * @property defaultSize - Initial sizes for each panel as percentages
 * @property style - Optional styling configuration wrapped in OptionType
 */
export const SplitterType = StructType({
    panels: ArrayType(SplitterPanelType),
    defaultSize: ArrayType(FloatType),
    style: OptionType(SplitterStyleType),
});

/**
 * Type representing the Splitter component structure.
 */
export type SplitterType = typeof SplitterType;

// ============================================================================
// Splitter Panel Function
// ============================================================================

/**
 * Creates a Splitter panel with content and configuration.
 *
 * @param content - The UI component to render in this panel
 * @param config - Panel configuration including id and optional constraints
 * @returns An East expression representing the splitter panel
 *
 * @remarks
 * Splitter panels can have size constraints and collapsibility settings.
 * The id is used to identify the panel for resize triggers.
 *
 * @example
 * ```ts
 * import { Splitter, Box } from "@elaraai/east-ui";
 *
 * // Simple panel
 * const panel = Splitter.Panel(
 *   variant("Box", sidebarContent),
 *   { id: "sidebar" }
 * );
 *
 * // Panel with size constraints
 * const constrainedPanel = Splitter.Panel(
 *   variant("Box", mainContent),
 *   {
 *     id: "main",
 *     minSize: 50,
 *     maxSize: 80,
 *   }
 * );
 *
 * // Collapsible panel
 * const collapsiblePanel = Splitter.Panel(
 *   variant("Box", terminal),
 *   {
 *     id: "terminal",
 *     collapsible: true,
 *     defaultCollapsed: false,
 *   }
 * );
 * ```
 */
function SplitterPanel(
    content: SubtypeExprOrValue<UIComponentType>,
    config: SplitterPanelStyle
): ExprType<SplitterPanelType> {
    const toFloatOption = (value: SubtypeExprOrValue<FloatType> | undefined) => {
        if (value === undefined) return variant("none", null);
        return variant("some", value);
    };

    const toBoolOption = (value: SubtypeExprOrValue<BooleanType> | undefined) => {
        if (value === undefined) return variant("none", null);
        return variant("some", value);
    };

    return East.value({
        id: config.id,
        content: content,
        minSize: toFloatOption(config.minSize),
        maxSize: toFloatOption(config.maxSize),
        collapsible: toBoolOption(config.collapsible),
        defaultCollapsed: toBoolOption(config.defaultCollapsed),
    }, SplitterPanelType);
}

// ============================================================================
// Splitter Root Function
// ============================================================================

/**
 * Creates a Splitter container with panels and optional styling.
 *
 * @param panels - Array of panels created with Splitter.Panel
 * @param defaultSize - Array of initial sizes (percentages) for each panel
 * @param style - Optional styling configuration for the splitter
 * @returns An East expression representing the styled splitter component
 *
 * @remarks
 * Splitter provides resizable panels with draggable dividers.
 * The defaultSize array must have the same length as the panels array,
 * with values representing percentages that should sum to 100.
 *
 * @example
 * ```ts
 * import { Splitter, Box, Style } from "@elaraai/east-ui";
 * import { East, variant, ArrayType } from "@elaraai/east";
 *
 * // Horizontal splitter (left/right)
 * const horizontalSplitter = Splitter.Root(
 *   East.value([
 *     Splitter.Panel(variant("Box", sidebar), { id: "sidebar", minSize: 20 }),
 *     Splitter.Panel(variant("Box", main), { id: "main", minSize: 50 }),
 *   ], ArrayType(SplitterPanelType)),
 *   East.value([30, 70], ArrayType(FloatType)),
 *   { orientation: Style.Orientation("horizontal") }
 * );
 *
 * // Vertical splitter (top/bottom)
 * const verticalSplitter = Splitter.Root(
 *   East.value([
 *     Splitter.Panel(variant("Box", editor), { id: "editor" }),
 *     Splitter.Panel(variant("Box", terminal), { id: "terminal", collapsible: true }),
 *   ], ArrayType(SplitterPanelType)),
 *   East.value([60, 40], ArrayType(FloatType)),
 *   { orientation: Style.Orientation("vertical") }
 * );
 * ```
 */
function SplitterRoot(
    panels: SubtypeExprOrValue<ArrayType<SplitterPanelType>>,
    defaultSize: SubtypeExprOrValue<ArrayType<FloatType>>,
    style?: SplitterStyle
): ExprType<UIComponentType> {
    const panels_expr = East.value(panels, ArrayType(SplitterPanelType));
    const orientationValue = style?.orientation
        ? (typeof style.orientation === "string"
            ? East.value(variant(style.orientation, null), OrientationType)
            : style.orientation)
        : undefined;

    return East.value(variant("Splitter", {
        panels: panels_expr,
        defaultSize: defaultSize,
        style: style ? variant("some", East.value({
            orientation: orientationValue ? variant("some", orientationValue) : variant("none", null),
        }, SplitterStyleType)) : variant("none", null),
    }), UIComponentType);
}

// ============================================================================
// Splitter Namespace Export
// ============================================================================

/**
 * Splitter compound component for resizable panel layouts.
 *
 * @remarks
 * Splitter provides resizable panels separated by draggable dividers.
 * Use Splitter.Root to create the container and Splitter.Panel for each section.
 *
 * @example
 * ```ts
 * import { Splitter, Box, Style } from "@elaraai/east-ui";
 * import { East, variant, ArrayType, FloatType } from "@elaraai/east";
 *
 * // Two-panel horizontal layout
 * const layout = Splitter.Root(
 *   East.value([
 *     Splitter.Panel(variant("Box", sidebar), {
 *       id: "sidebar",
 *       minSize: 15,
 *       collapsible: true,
 *     }),
 *     Splitter.Panel(variant("Box", mainContent), {
 *       id: "main",
 *       minSize: 50,
 *     }),
 *   ], ArrayType(SplitterPanelType)),
 *   East.value([25, 75], ArrayType(FloatType)),
 *   { orientation: Style.Orientation("horizontal") }
 * );
 * ```
 */
export const Splitter = {
    Root: SplitterRoot,
    Panel: SplitterPanel,
    Types: {
        Splitter: SplitterType,
        Panel: SplitterPanelType,
        Style: SplitterStyleType,
    }
} as const;
