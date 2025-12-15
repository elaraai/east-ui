/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo } from 'react';
import {
    Box,
    Text,
    HStack,
    Spinner,
    Badge,
    TreeView,
    createTreeCollection,
} from '@chakra-ui/react';
import { useE3Context } from '../context/E3Context';
import { useWorkspaces, useWorkspaceStatus } from '../hooks/useE3Data';
import type { WorkspaceInfo, TaskStatusInfo } from '@elaraai/e3-api-client';

function getStatusColor(status: TaskStatusInfo['status']['type']): string {
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

interface TreeNode {
    value: string;
    label: string;
    type: 'workspace' | 'task';
    task?: TaskStatusInfo;
    children: TreeNode[];
}

interface WorkspaceTreeContentProps {
    workspaces: WorkspaceInfo[];
}

function WorkspaceTreeContent({ workspaces }: WorkspaceTreeContentProps) {
    const { apiUrl, selectedWorkspace, setSelectedWorkspace, setSelectedTask } = useE3Context();

    // Fetch status for selected workspace
    const { data: status, isLoading: statusLoading } = useWorkspaceStatus(apiUrl, selectedWorkspace);

    // Build tree nodes
    const nodes = useMemo(() => {
        return workspaces.map((ws): TreeNode => {
            const children: TreeNode[] = [];

            // Add tasks if this workspace is selected and has status
            if (selectedWorkspace === ws.name && status?.tasks) {
                for (const task of status.tasks) {
                    children.push({
                        value: `${ws.name}/${task.name}`,
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
    const handleSelectionChange = (details: { selectedValue: string[] }) => {
        const selected = details.selectedValue[0];
        if (!selected) return;

        if (selected.includes('/')) {
            // Task selected
            const [workspace, task] = selected.split('/');
            setSelectedWorkspace(workspace);
            setSelectedTask(task);
        } else {
            // Workspace selected - toggle expansion
            setSelectedWorkspace(selectedWorkspace === selected ? null : selected);
            setSelectedTask(null);
        }
    };

    // Handle expand/collapse
    const handleExpandedChange = (details: { expandedValue: string[] }) => {
        const expanded = details.expandedValue;
        // Set the first expanded workspace as selected (to load its tasks)
        if (expanded.length > 0) {
            const lastExpanded = expanded[expanded.length - 1];
            if (!lastExpanded.includes('/')) {
                setSelectedWorkspace(lastExpanded);
            }
        }
    };

    return (
        <TreeView.Root
            collection={collection}
            size="sm"
            animateContent
            onSelectionChange={handleSelectionChange}
            onExpandedChange={handleExpandedChange}
            expandedValue={selectedWorkspace ? [selectedWorkspace] : []}
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

function TreeNodeRenderer({ node, indexPath, isLoadingTasks }: TreeNodeRendererProps) {
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
                                No tasks
                            </Text>
                        ) : (
                            node.children.map((child, childIndex) => (
                                <TreeNodeRenderer
                                    key={`${child.value}-${child.task?.status.type}`}
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
    return (
        <TreeView.NodeProvider node={node} indexPath={indexPath}>
            <TreeView.Item>
                {node.task && (
                    <Badge colorPalette={getStatusColor(node.task.status.type)} size="sm">
                        {node.task.status.type}
                    </Badge>
                )}
                <TreeView.ItemText>{node.label}</TreeView.ItemText>
            </TreeView.Item>
        </TreeView.NodeProvider>
    );
}

export function WorkspaceTree() {
    const { apiUrl } = useE3Context();
    const { data: workspaces, isLoading, error } = useWorkspaces(apiUrl);

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
