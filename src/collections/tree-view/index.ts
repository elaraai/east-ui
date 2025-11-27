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
    StringType,
    BooleanType,
    RecursiveType,
    variant,
} from "@elaraai/east";

import {
    TreeViewVariantType,
    TreeViewSizeType,
    TreeViewSelectionModeType,
    TreeViewStyleType,
    type TreeViewStyle,
} from "./types.js";

// Re-export style types
export {
    TreeViewVariantType,
    TreeViewSizeType,
    TreeViewSelectionModeType,
    TreeViewStyleType,
    type TreeViewStyle,
} from "./types.js";

// ============================================================================
// TreeNode Type (Recursive)
// ============================================================================

/**
 * Recursive type for tree nodes.
 *
 * @remarks
 * Each node has a value (unique identifier), label (display text),
 * and optional children (array of more nodes).
 *
 * @property value - Unique identifier for the node
 * @property label - Display text for the node
 * @property children - Optional array of child nodes
 */
export const TreeNodeType = RecursiveType(self => StructType({
    value: StringType,
    label: StringType,
    children: OptionType(ArrayType(self)),
}));

/**
 * Type representing the tree node structure.
 */
export type TreeNodeType = typeof TreeNodeType;

// ============================================================================
// TreeView Root Type
// ============================================================================

/**
 * East type for the complete tree view structure.
 *
 * @remarks
 * Contains the tree nodes, optional label, and styling configuration.
 *
 * @property nodes - Array of root-level tree nodes
 * @property label - Optional label for the tree view
 * @property defaultExpandedValue - Initially expanded node values
 * @property defaultSelectedValue - Initially selected node values
 * @property style - Optional styling configuration
 */
export const TreeViewRootType = StructType({
    nodes: ArrayType(TreeNodeType),
    label: OptionType(StringType),
    defaultExpandedValue: OptionType(ArrayType(StringType)),
    defaultSelectedValue: OptionType(ArrayType(StringType)),
    style: OptionType(TreeViewStyleType),
});

/**
 * Type representing the tree view root structure.
 */
export type TreeViewRootType = typeof TreeViewRootType;

// ============================================================================
// TreeNode Input Interface
// ============================================================================

/**
 * TypeScript interface for creating tree nodes.
 *
 * @remarks
 * Provides a convenient way to create tree node structures.
 *
 * @property value - Unique identifier for the node
 * @property label - Display text for the node
 * @property children - Optional array of child nodes
 */
export interface TreeNodeInput {
    value: SubtypeExprOrValue<typeof StringType>;
    label: SubtypeExprOrValue<typeof StringType>;
    children?: TreeNodeInput[];
}

// ============================================================================
// TreeNode Factory
// ============================================================================

/**
 * Creates a tree node with optional children.
 *
 * @param value - Unique identifier for the node
 * @param label - Display text for the node
 * @param children - Optional array of child nodes
 * @returns An East expression representing the tree node
 *
 * @example
 * ```ts
 * import { TreeView } from "@elaraai/east-ui";
 *
 * // Leaf node (no children)
 * TreeView.Node("file1", "index.ts");
 *
 * // Branch node with children
 * TreeView.Node("src", "src", [
 *   TreeView.Node("file1", "index.ts"),
 *   TreeView.Node("file2", "utils.ts"),
 * ]);
 * ```
 */
function TreeNode(
    value: SubtypeExprOrValue<typeof StringType>,
    label: SubtypeExprOrValue<typeof StringType>,
    children?: ExprType<TreeNodeType>[]
): ExprType<TreeNodeType> {
    return East.value({
        value: value,
        label: label,
        children: children && children.length > 0
            ? variant("some", East.value(children, ArrayType(TreeNodeType)))
            : variant("none", null),
    }, TreeNodeType);
}

// ============================================================================
// TreeView Root Factory
// ============================================================================

/**
 * Creates a TreeView component with nodes and styling.
 *
 * @param nodes - Array of root-level tree nodes
 * @param style - Optional styling and configuration
 * @returns An East expression representing the tree view
 *
 * @example
 * ```ts
 * import { TreeView } from "@elaraai/east-ui";
 *
 * // File explorer tree
 * TreeView.Root([
 *   TreeView.Node("src", "src", [
 *     TreeView.Node("index", "index.ts"),
 *     TreeView.Node("utils", "utils.ts"),
 *   ]),
 *   TreeView.Node("package", "package.json"),
 *   TreeView.Node("readme", "README.md"),
 * ], {
 *   variant: "subtle",
 *   size: "sm",
 *   defaultExpandedValue: ["src"],
 * });
 *
 * // Category tree with selection
 * TreeView.Root([
 *   TreeView.Node("electronics", "Electronics", [
 *     TreeView.Node("phones", "Phones"),
 *     TreeView.Node("laptops", "Laptops"),
 *   ]),
 *   TreeView.Node("clothing", "Clothing", [
 *     TreeView.Node("mens", "Men's"),
 *     TreeView.Node("womens", "Women's"),
 *   ]),
 * ], {
 *   selectionMode: "multiple",
 *   animateContent: true,
 * });
 * ```
 */
function TreeViewRoot(
    nodes: SubtypeExprOrValue<ArrayType<TreeNodeType>>,
    style?: TreeViewStyle & { label?: SubtypeExprOrValue<typeof StringType> }
): ExprType<TreeViewRootType> {

    const sizeValue = style?.size
        ? (typeof style.size === "string"
            ? East.value(variant(style.size, null), TreeViewSizeType)
            : style.size)
        : undefined;

    const variantValue = style?.variant
        ? (typeof style.variant === "string"
            ? East.value(variant(style.variant, null), TreeViewVariantType)
            : style.variant)
        : undefined;

    const selectionModeValue = style?.selectionMode
        ? (typeof style.selectionMode === "string"
            ? East.value(variant(style.selectionMode, null), TreeViewSelectionModeType)
            : style.selectionMode)
        : undefined;

    const toBoolOption = (value: SubtypeExprOrValue<typeof BooleanType> | undefined) => {
        if (value === undefined) return variant("none", null);
        return variant("some", value);
    };

    const toArrayOption = (value: SubtypeExprOrValue<ArrayType<typeof StringType>> | undefined) => {
        if (value === undefined) return variant("none", null);
        return variant("some", value);
    };

    const hasStyle = style && (
        style.size !== undefined ||
        style.variant !== undefined ||
        style.selectionMode !== undefined ||
        style.animateContent !== undefined
    );

    return East.value({
        nodes: nodes,
        label: style?.label ? variant("some", style.label) : variant("none", null),
        defaultExpandedValue: toArrayOption(style?.defaultExpandedValue),
        defaultSelectedValue: toArrayOption(style?.defaultSelectedValue),
        style: hasStyle ? variant("some", East.value({
            size: sizeValue ? variant("some", sizeValue) : variant("none", null),
            variant: variantValue ? variant("some", variantValue) : variant("none", null),
            selectionMode: selectionModeValue ? variant("some", selectionModeValue) : variant("none", null),
            animateContent: toBoolOption(style?.animateContent),
        }, TreeViewStyleType)) : variant("none", null),
    }, TreeViewRootType);
}

// ============================================================================
// TreeView Namespace Export
// ============================================================================

/**
 * TreeView compound component for hierarchical data display.
 *
 * @remarks
 * TreeView displays hierarchical data structures in an expandable tree format.
 * Use TreeView.Node to create individual nodes and TreeView.Root to create
 * the complete tree.
 *
 * @example
 * ```ts
 * import { TreeView } from "@elaraai/east-ui";
 *
 * // Simple file tree
 * const fileTree = TreeView.Root([
 *   TreeView.Node("src", "src", [
 *     TreeView.Node("components", "components", [
 *       TreeView.Node("button", "Button.tsx"),
 *       TreeView.Node("input", "Input.tsx"),
 *     ]),
 *     TreeView.Node("utils", "utils", [
 *       TreeView.Node("helpers", "helpers.ts"),
 *     ]),
 *     TreeView.Node("index", "index.ts"),
 *   ]),
 *   TreeView.Node("package", "package.json"),
 *   TreeView.Node("tsconfig", "tsconfig.json"),
 * ], {
 *   label: "Project Files",
 *   variant: "subtle",
 *   size: "sm",
 *   defaultExpandedValue: ["src"],
 * });
 * ```
 */
export const TreeView = {
    Root: TreeViewRoot,
    Node: TreeNode,
    Types: {
        Root: TreeViewRootType,
        Node: TreeNodeType,
        Style: TreeViewStyleType,
        Variant: TreeViewVariantType,
        Size: TreeViewSizeType,
        SelectionMode: TreeViewSelectionModeType,
    },
} as const;
