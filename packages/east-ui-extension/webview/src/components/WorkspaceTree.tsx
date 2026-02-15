/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo, useCallback } from 'react';
import {
    Box,
    Text,
    HStack,
    Spinner,
    Badge,
    TreeView,
    createTreeCollection,
} from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faCog } from '@fortawesome/free-solid-svg-icons';
import { useE3Context, getSelectedWorkspace } from '../context/E3Context';
import { useWorkspaceList, useWorkspaceStatus } from '@elaraai/e3-ui-components';
import type { WorkspaceInfo, TaskStatusInfo, DatasetStatusInfo } from '@elaraai/e3-api-client';

function getTaskStatusColor(status: TaskStatusInfo['status']['type']): string {
    switch (status) {
        case 'up-to-date':
            return 'green';
        case 'ready':
            return 'blue';
        case 'waiting':
            return 'yellow';
        case 'in-progress':
            return 'purple';
        case 'failed':
        case 'error':
            return 'red';
        case 'stale-running':
            return 'orange';
        default:
            return 'gray';
    }
}

function getInputStatusColor(status: DatasetStatusInfo['status']['type']): string {
    switch (status) {
        case 'up-to-date':
            return 'green';
        case 'stale':
            return 'yellow';
        case 'unset':
            return 'gray';
        default:
            return 'gray';
    }
}

interface BaseNode {
    value: string;
    label: string;
    children: TreeNode[];
}

interface WorkspaceNode extends BaseNode {
    type: 'workspace';
}

interface TaskNode extends BaseNode {
    type: 'task';
    task: TaskStatusInfo;
}

interface InputNode extends BaseNode {
    type: 'input';
    dataset: DatasetStatusInfo;
}

type TreeNode = WorkspaceNode | TaskNode | InputNode;

interface WorkspaceTreeContentProps {
    workspaces: WorkspaceInfo[];
}

function WorkspaceTreeContent({ workspaces }: WorkspaceTreeContentProps) {
    const { apiUrl, selection, setSelection } = useE3Context();
    const selectedWorkspace = getSelectedWorkspace(selection);

    // Fetch status for selected workspace
    const { data: status, isLoading: statusLoading } = useWorkspaceStatus(apiUrl, 'default', selectedWorkspace, undefined, {
        refetchInterval: 1000,
        staleTime: 0,
        gcTime: 0,
        structuralSharing: false,
    });

    // Build tree nodes
    const nodes = useMemo(() => {
        return workspaces.map((ws): TreeNode => {
            const children: TreeNode[] = [];

            // Add inputs and tasks directly if this workspace is selected and has status
            if (selectedWorkspace === ws.name && status) {
                // Filter inputs from datasets (not task outputs, path starts with .inputs)
                const inputs = status.datasets.filter(d =>
                    !d.isTaskOutput && d.path.startsWith('.inputs')
                );

                // Add inputs directly (shown with database icon)
                for (const input of inputs) {
                    children.push({
                        value: `${ws.name}/input:${input.path}`,
                        label: input.path.replace(/^\.inputs\./, ''),
                        type: 'input',
                        dataset: input,
                        children: [],
                    });
                }

                // Add tasks directly (shown with cog icon)
                for (const task of status.tasks) {
                    children.push({
                        value: `${ws.name}/task:${task.name}`,
                        label: task.name,
                        type: 'task',
                        task,
                        children: [],
                    });
                }
            }

            return {
                value: ws.name,
                label: ws.name,
                type: 'workspace',
                children,
            };
        });
    }, [workspaces, selectedWorkspace, status]);

    // Create tree collection
    const collection = useMemo(() => createTreeCollection<TreeNode>({
        nodeToValue: (node) => node.value,
        nodeToString: (node) => node.label,
        rootNode: {
            value: 'ROOT',
            label: 'ROOT',
            type: 'workspace',
            children: nodes,
        },
    }), [nodes]);

    // Handle selection
    const handleSelectionChange = useCallback((details: { selectedValue: string[] }) => {
        const selected = details.selectedValue[0];
        if (!selected) return;

        if (selected.includes('/task:')) {
            // Task selected: "workspace/task:taskName"
            const [workspace, task] = selected.split('/task:');
            setSelection({ type: 'task', workspace, task });
        } else if (selected.includes('/input:')) {
            // Input selected: "workspace/input:.inputs.foo"
            const [workspace, path] = selected.split('/input:');
            setSelection({ type: 'input', workspace, path });
        } else if (selected.includes('/__')) {
            // Group selected - ignore (groups are just for organization)
        } else {
            // Workspace selected - toggle expansion
            if (selectedWorkspace === selected) {
                setSelection({ type: 'none' });
            } else {
                setSelection({ type: 'workspace', workspace: selected });
            }
        }
    }, [selectedWorkspace, setSelection]);

    // Handle expand/collapse
    const handleExpandedChange = useCallback((details: { expandedValue: string[] }) => {
        const expanded = details.expandedValue;
        // Set the first expanded workspace as selected (to load its tasks)
        if (expanded.length > 0) {
            const lastExpanded = expanded[expanded.length - 1];
            if (!lastExpanded.includes('/')) {
                setSelection({ type: 'workspace', workspace: lastExpanded });
            }
        }
    }, [setSelection]);

    const expandedValue = useMemo(() => selectedWorkspace ? [selectedWorkspace] : [], [selectedWorkspace]);

    return (
        <TreeView.Root
            collection={collection}
            size="sm"
            animateContent
            onSelectionChange={handleSelectionChange}
            onExpandedChange={handleExpandedChange}
            expandedValue={expandedValue}
        >
            <TreeView.Tree>
                {collection.rootNode.children.map((node, index) => (
                    <TreeNodeRenderer
                        key={node.value}
                        node={node}
                        indexPath={[index]}
                        isLoadingTasks={statusLoading && selectedWorkspace === node.value}
                    />
                ))}
            </TreeView.Tree>
        </TreeView.Root>
    );
}

interface TreeNodeRendererProps {
    node: TreeNode;
    indexPath: number[];
    isLoadingTasks?: boolean;
}

// Helper to get a stable key for a node
function getNodeKey(node: TreeNode): string {
    switch (node.type) {
        case 'task':
            return `${node.value}-${node.task.status.type}`;
        case 'input':
            return `${node.value}-${node.dataset.status.type}`;
        default:
            return node.value;
    }
}

function TreeNodeRenderer({ node, indexPath, isLoadingTasks }: TreeNodeRendererProps) {
    // Workspace - top-level branch
    if (node.type === 'workspace') {
        return (
            <TreeView.NodeProvider node={node} indexPath={indexPath}>
                <TreeView.Branch>
                    <TreeView.BranchControl>
                        <TreeView.BranchIndicator />
                        <TreeView.BranchText fontWeight="semibold">
                            {node.label}
                        </TreeView.BranchText>
                        {isLoadingTasks && <Spinner size="xs" ml={2} />}
                    </TreeView.BranchControl>
                    <TreeView.BranchContent>
                        {node.children.length === 0 && !isLoadingTasks ? (
                            <Text fontSize="xs" color="gray.500" pl={6} py={1}>
                                No inputs or tasks
                            </Text>
                        ) : (
                            node.children.map((child, childIndex) => (
                                <TreeNodeRenderer
                                    key={getNodeKey(child)}
                                    node={child}
                                    indexPath={[...indexPath, childIndex]}
                                />
                            ))
                        )}
                    </TreeView.BranchContent>
                </TreeView.Branch>
            </TreeView.NodeProvider>
        );
    }

    // Task item
    if (node.type === 'task') {
        return (
            <TreeView.NodeProvider node={node} indexPath={indexPath}>
                <TreeView.Item>
                    <HStack gap={2} flex={1} minWidth={0}>
                        <Box color="gray.500" flexShrink={0}>
                            <FontAwesomeIcon icon={faCog} size="xs" />
                        </Box>
                        <Text
                            fontSize="sm"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            flex={1}
                            minWidth={0}
                            title={node.label}
                        >
                            {node.label}
                        </Text>
                        <Badge colorPalette={getTaskStatusColor(node.task.status.type)} size="sm" flexShrink={0}>
                            {node.task.status.type}
                        </Badge>
                    </HStack>
                </TreeView.Item>
            </TreeView.NodeProvider>
        );
    }

    // Input item
    return (
        <TreeView.NodeProvider node={node} indexPath={indexPath}>
            <TreeView.Item>
                <HStack gap={2} flex={1} minWidth={0}>
                    <Box color="blue.500" flexShrink={0}>
                        <FontAwesomeIcon icon={faDatabase} size="xs" />
                    </Box>
                    <Text
                        fontSize="sm"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        flex={1}
                        minWidth={0}
                        title={node.label}
                    >
                        {node.label}
                    </Text>
                    <Badge colorPalette={getInputStatusColor(node.dataset.status.type)} size="sm" flexShrink={0}>
                        {node.dataset.status.type}
                    </Badge>
                </HStack>
            </TreeView.Item>
        </TreeView.NodeProvider>
    );
}

export function WorkspaceTree() {
    const { apiUrl } = useE3Context();
    const { data: workspaces, isLoading, error } = useWorkspaceList(apiUrl, 'default', undefined, {
        refetchInterval: 5000,
    });

    if (isLoading) {
        return (
            <Box p={4}>
                <HStack>
                    <Spinner size="sm" />
                    <Text fontSize="sm">Loading workspaces...</Text>
                </HStack>
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={4}>
                <Text color="red.500" fontSize="sm">
                    Error: {error instanceof Error ? error.message : String(error)}
                </Text>
            </Box>
        );
    }

    if (!workspaces || workspaces.length === 0) {
        return (
            <Box p={4}>
                <Text fontSize="sm" color="gray.500">No workspaces found</Text>
            </Box>
        );
    }

    return (
        <Box p={2}>
            <Text fontSize="xs" fontWeight="bold" color="gray.500" px={2} pb={2}>
                WORKSPACES
            </Text>
            <WorkspaceTreeContent workspaces={workspaces} />
        </Box>
    );
}
