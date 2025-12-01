/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import {
    TreeView as ChakraTreeView,
    createTreeCollection,
} from "@chakra-ui/react";
import { equalFor, match, type OptionType, type VariantType, type ValueTypeOf } from "@elaraai/east";
import { TreeView, Icon } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraIcon } from "../../display/icon";

// Pre-define equality function at module level
const treeViewRootEqual = equalFor(TreeView.Types.Root);

/** East TreeView Root value type */
export type TreeViewRootValue = ValueTypeOf<typeof TreeView.Types.Root>;

/** East TreeNode value type */
export type TreeNodeValue = ValueTypeOf<typeof TreeView.Types.Node>;
export type TreeVariantNodeValue = ValueTypeOf<VariantType<{
    Item: typeof TreeView.Types.ItemNode,
    Branch: typeof TreeView.Types.BranchNode;
}>>



/** Icon option value type */
type IconOptionValue = ValueTypeOf<OptionType<typeof Icon.Types.Icon>>;

/** Tree node interface for Chakra collection */
interface TreeNode {
    value: string;
    label: string;
    indicator?: IconOptionValue;
    disabled?: boolean;
    children: TreeNode[];
}

/**
 * Converts East TreeNode values to TreeNode interface recursively.
 */
function convertNodes(nodes: TreeVariantNodeValue[]): TreeNode[] {
    return nodes.map(node => match(node, {
        Item: (item) => ({
            value: item.value,
            label: item.label,
            indicator: item.indicator,
            children: [],
        }),
        Branch: (branch) => ({
            value: branch.value,
            label: branch.label,
            indicator: branch.indicator,
            disabled: getSomeorUndefined(branch.disabled) ?? false,
            children: convertNodes(branch.children),
        }),
    }));
}

export interface EastChakraTreeViewProps {
    value: TreeViewRootValue;
}

/**
 * Renders an East UI TreeView value using Chakra UI TreeView components.
 */
export const EastChakraTreeView = memo(function EastChakraTreeView({ value }: EastChakraTreeViewProps) {
    const style = getSomeorUndefined(value.style);
    const label = getSomeorUndefined(value.label);
    const defaultExpandedValue = getSomeorUndefined(value.defaultExpandedValue);
    const defaultSelectedValue = getSomeorUndefined(value.defaultSelectedValue);

    // Convert East nodes to TreeNode interface
    const nodes = useMemo(() => convertNodes(value.nodes), [value.nodes]);

    // Create tree collection
    const collection = useMemo(() => createTreeCollection<TreeNode>({
        nodeToValue: (node) => node.value,
        nodeToString: (node) => node.label,
        rootNode: {
            value: "ROOT",
            label: "ROOT",
            children: nodes,
        },
    }), [nodes]);

    return (
        <ChakraTreeView.Root
            collection={collection}
            size={style ? getSomeorUndefined(style.size)?.type : undefined}
            variant={style ? getSomeorUndefined(style.variant)?.type : undefined}
            selectionMode={style ? getSomeorUndefined(style.selectionMode)?.type : undefined}
            defaultExpandedValue={defaultExpandedValue}
            defaultSelectedValue={defaultSelectedValue}
            aria-label={label}
        >
            <ChakraTreeView.Tree>
                {collection.rootNode.children.map((node, index) => (
                    <TreeNodeRenderer key={node.value} node={node} indexPath={[index]} />
                ))}
            </ChakraTreeView.Tree>
        </ChakraTreeView.Root>
    );
}, (prev, next) => treeViewRootEqual(prev.value, next.value));

interface TreeNodeRendererProps {
    node: TreeNode;
    indexPath: number[];
}

/**
 * Renders the indicator icon if present.
 */
function IndicatorIcon({ indicator }: { indicator: IconOptionValue }) {
    const iconValue = getSomeorUndefined(indicator);
    if (!iconValue) return null;
    return <EastChakraIcon value={iconValue} />;
}

/**
 * Recursively renders tree nodes as Branch or Item based on children.
 */
function TreeNodeRenderer({ node, indexPath }: TreeNodeRendererProps) {
    const hasChildren = node.children.length > 0;

    if (hasChildren) {
        return (
            <ChakraTreeView.NodeProvider node={node} indexPath={indexPath}>
                <ChakraTreeView.Branch>
                    <ChakraTreeView.BranchControl>
                        <ChakraTreeView.BranchIndicator />
                        {node.indicator && <IndicatorIcon indicator={node.indicator} />}
                        <ChakraTreeView.BranchText>{node.label}</ChakraTreeView.BranchText>
                    </ChakraTreeView.BranchControl>
                    <ChakraTreeView.BranchContent>
                        {node.children.map((child, childIndex) => (
                            <TreeNodeRenderer
                                key={child.value}
                                node={child}
                                indexPath={[...indexPath, childIndex]}
                            />
                        ))}
                    </ChakraTreeView.BranchContent>
                </ChakraTreeView.Branch>
            </ChakraTreeView.NodeProvider>
        );
    }

    return (
        <ChakraTreeView.NodeProvider node={node} indexPath={indexPath}>
            <ChakraTreeView.Item>
                {node.indicator && <IndicatorIcon indicator={node.indicator} />}
                <ChakraTreeView.ItemText>{node.label}</ChakraTreeView.ItemText>
            </ChakraTreeView.Item>
        </ChakraTreeView.NodeProvider>
    );
}

/**
 * Converts an East UI TreeView Root value to props object.
 * Note: TreeView requires a collection, so this just extracts style props.
 */
export function toChakraTreeViewRoot(value: TreeViewRootValue) {
    const style = getSomeorUndefined(value.style);
    return {
        size: style ? getSomeorUndefined(style.size)?.type : undefined,
        variant: style ? getSomeorUndefined(style.variant)?.type : undefined,
        selectionMode: style ? getSomeorUndefined(style.selectionMode)?.type : undefined,
    };
}
