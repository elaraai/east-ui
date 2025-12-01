/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    StringType,
    BooleanType,
    IntegerType,
    OptionType,
    StructType,
    ArrayType,
    variant,
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import {
    ActionBarItemType,
    ActionBarStyleType,
    type ActionBarStyle,
} from "./types.js";

// Re-export types
export {
    ActionBarItemType,
    ActionBarStyleType,
    type ActionBarStyle,
} from "./types.js";

// ============================================================================
// ActionBar Type
// ============================================================================

/**
 * East StructType for ActionBar component.
 *
 * @remarks
 * ActionBar is a floating bar that appears when items are selected.
 * It displays the selection count and provides batch action buttons.
 *
 * @property items - Array of action items (actions or separators)
 * @property selectionCount - Number of selected items
 * @property selectionLabel - Label for selection (e.g., "items selected")
 * @property style - Optional style configuration
 */
export const ActionBarType = StructType({
    items: ArrayType(ActionBarItemType),
    selectionCount: OptionType(IntegerType),
    selectionLabel: OptionType(StringType),
    style: OptionType(ActionBarStyleType),
});

/**
 * Type alias for ActionBarType.
 */
export type ActionBarType = typeof ActionBarType;

// ============================================================================
// ActionBar Item Factory
// ============================================================================

/**
 * Creates an Action item for the ActionBar.
 *
 * @param value - Unique identifier for the action
 * @param label - Display label for the action button
 * @param disabled - Whether the action is disabled
 * @returns An East expression representing the action item
 */
function createAction(
    value: SubtypeExprOrValue<StringType>,
    label: SubtypeExprOrValue<StringType>,
    disabled?: SubtypeExprOrValue<BooleanType>
): ExprType<ActionBarItemType> {
    return East.value(variant("Action", {
        value: value,
        label: label,
        disabled: disabled !== undefined ? variant("some", disabled) : variant("none", null),
    }), ActionBarItemType);
}

/**
 * Creates a Separator item for the ActionBar.
 *
 * @returns An East expression representing a separator
 */
function createSeparator(): ExprType<ActionBarItemType> {
    return East.value(variant("Separator", null), ActionBarItemType);
}

// ============================================================================
// ActionBar Function
// ============================================================================

/**
 * Creates an ActionBar component with action items.
 *
 * @param items - Array of action items (use ActionBar.Action and ActionBar.Separator)
 * @param style - Optional styling configuration
 * @returns An East expression representing the action bar component
 *
 * @remarks
 * ActionBar displays a floating bar with batch actions for selected items.
 * Typically used in data tables or lists with multi-select functionality.
 *
 * @example
 * ```ts
 * import { ActionBar } from "@elaraai/east-ui";
 *
 * // Action bar with common actions
 * const actionBar = ActionBar.Root(
 *   [
 *     ActionBar.Action("delete", "Delete"),
 *     ActionBar.Separator(),
 *     ActionBar.Action("archive", "Archive"),
 *     ActionBar.Action("export", "Export"),
 *   ],
 *   {
 *     selectionCount: 5,
 *     selectionLabel: "items selected",
 *   }
 * );
 *
 * // Action bar with disabled action
 * const conditionalBar = ActionBar.Root(
 *   [
 *     ActionBar.Action("edit", "Edit", false),
 *     ActionBar.Action("delete", "Delete", isReadOnly),
 *   ],
 *   { selectionCount: selectedItems.length() }
 * );
 * ```
 */
function createActionBar(
    items: SubtypeExprOrValue<ArrayType<ActionBarItemType>>,
    style?: ActionBarStyle
): ExprType<UIComponentType> {
    return East.value(variant("ActionBar", {
        items: items,
        selectionCount: style?.selectionCount !== undefined ? variant("some", style.selectionCount) : variant("none", null),
        selectionLabel: style?.selectionLabel !== undefined ? variant("some", style.selectionLabel) : variant("none", null),
        style: variant("some", East.value({}, ActionBarStyleType)),
    }), UIComponentType);
}

/**
 * ActionBar component for batch actions on selected items.
 *
 * @remarks
 * Use `ActionBar.Root(items, style)` to create an action bar, or use
 * `ActionBar.Action()` and `ActionBar.Separator()` to create items.
 *
 * @example
 * ```ts
 * import { ActionBar } from "@elaraai/east-ui";
 *
 * // Create an action bar
 * const actionBar = ActionBar.Root(
 *   [
 *     ActionBar.Action("delete", "Delete"),
 *     ActionBar.Action("export", "Export"),
 *   ],
 *   { selectionCount: 3 }
 * );
 *
 * // Access the type
 * const itemType = ActionBar.Types.Item;
 * ```
 */
export const ActionBar = {
    Root: createActionBar,
    Action: createAction,
    Separator: createSeparator,
    Types: {
        ActionBar: ActionBarType,
        Item: ActionBarItemType,
        Style: ActionBarStyleType,
    },
} as const;
