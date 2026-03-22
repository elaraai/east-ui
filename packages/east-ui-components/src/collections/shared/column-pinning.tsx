/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo, useCallback, type CSSProperties } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faAnglesDown, faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { flexRender } from "@tanstack/react-table";
import type { Column, Header, SortingState } from "@tanstack/react-table";

// ── Pinning styles (TanStack recommended approach) ──────────────────

export function getCommonPinningStyles<TData>(column: Column<TData, unknown>): CSSProperties {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');

    return {
        borderRight: isLastLeftPinnedColumn ? '2px solid var(--chakra-colors-border, #e2e8f0)' : undefined,
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        position: isPinned ? 'sticky' : 'relative',
        width: column.getSize(),
        zIndex: isPinned ? 1 : 0,
        backgroundColor: isPinned ? 'var(--chakra-colors-bg-panel, white)' : undefined,
    };
}

// ── Column pinning hook ─────────────────────────────────────────────

export interface UseColumnPinningOpts {
    frozenFromValue: string[];
    persistedPinnedColumns: string[] | undefined;
    setPersistedPinnedColumns: (updater: (prev: string[]) => string[]) => void;
}

export function useColumnPinning({ frozenFromValue, persistedPinnedColumns, setPersistedPinnedColumns }: UseColumnPinningOpts) {
    const pinnedColumns = useMemo(
        () => persistedPinnedColumns ?? [...frozenFromValue],
        [persistedPinnedColumns, frozenFromValue]
    );

    const columnPinning = useMemo(() => ({
        left: pinnedColumns,
        right: [] as string[],
    }), [pinnedColumns]);

    const hasFrozen = pinnedColumns.length > 0;

    const toggleColumnPin = useCallback((columnId: string) => {
        setPersistedPinnedColumns(current => {
            const isPinned = current.includes(columnId);
            return isPinned
                ? current.filter(id => id !== columnId)
                : [...current, columnId];
        });
    }, [setPersistedPinnedColumns]);

    return { pinnedColumns, columnPinning, hasFrozen, toggleColumnPin };
}

// ── Header cell controls (pin + sort) ───────────────────────────────

export interface HeaderControlsProps<TData> {
    header: Header<TData, unknown>;
    toggleColumnPin: (columnId: string) => void;
    getSortIndex: (columnId: string) => number | undefined;
    enableMultiSort: boolean;
    enableColumnResizing: boolean;
}

export function HeaderControls<TData>({
    header,
    toggleColumnPin,
    getSortIndex,
    enableMultiSort,
    enableColumnResizing,
}: HeaderControlsProps<TData>) {
    const sortIndex = getSortIndex(header.id);
    const isSorted = header.column.getIsSorted();
    const sortDirection = isSorted || null;
    const icon = !isSorted ? faAnglesDown : sortDirection === 'asc' ? faChevronUp : faChevronDown;
    const isPinned = header.column.getIsPinned();

    return (
        <>
            <HStack justify="space-between" width="100%" pr={enableColumnResizing ? "4px" : "0"}>
                <Text fontSize="sm" fontWeight="semibold" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" flex="1">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </Text>
                <HStack gap={0} flexShrink={0} alignItems="center">
                    {/* Pin toggle */}
                    <Box
                        as="button"
                        aria-label={isPinned ? `Unpin ${header.id}` : `Pin ${header.id}`}
                        onClick={(e: React.MouseEvent) => { e.stopPropagation(); toggleColumnPin(header.id); }}
                        color={isPinned ? "fg.default" : "fg.muted"}
                        _hover={{ color: "fg.default", bg: "bg.emphasized" }}
                        transition="color 0.15s"
                        cursor="pointer"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        w="24px" h="24px"
                        borderRadius="sm"
                    >
                        <FontAwesomeIcon icon={faThumbtack} style={{ width: '10px', height: '10px', transform: isPinned ? undefined : 'rotate(45deg)' }} />
                    </Box>
                    {/* Sort button */}
                    {header.column.getCanSort() && (
                        <Box
                            as="button"
                            aria-label={`Sort by ${header.id}`}
                            onClick={(e: React.MouseEvent) => { e.stopPropagation(); header.column.toggleSorting(undefined, enableMultiSort); }}
                            color={isSorted ? "fg.default" : "fg.muted"}
                            _hover={{ color: "fg.default", bg: "bg.emphasized" }}
                            cursor="pointer"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            w="24px" h="24px"
                            borderRadius="sm"
                            position="relative"
                        >
                            <FontAwesomeIcon icon={icon} style={{ width: '10px', height: '10px' }} />
                            {isSorted && sortIndex && enableMultiSort && (
                                <Text fontSize="7px" fontWeight="bold" color="fg.muted" lineHeight="1" position="absolute" top="4px" right="4px">
                                    {sortIndex}
                                </Text>
                            )}
                        </Box>
                    )}
                </HStack>
            </HStack>
            {enableColumnResizing && header.column.getCanResize() && (
                <Box
                    position="absolute" right="0" top="0" bottom="0" width="8px" cursor="col-resize" bg="transparent"
                    _hover={{ _before: { opacity: 1, bg: 'fg.muted' } }}
                    transition="all 0.2s" zIndex={10}
                    onMouseDown={header.getResizeHandler()} onTouchStart={header.getResizeHandler()}
                    _before={{ content: '""', position: 'absolute', right: '2px', top: '50%', transform: 'translateY(-50%)', width: '2px', height: '16px', bg: 'gray.300', borderRadius: '1px', opacity: 0.4, transition: 'opacity 0.2s' }}
                />
            )}
        </>
    );
}

// ── Header cell style helper ────────────────────────────────────────

export function getHeaderCellStyle<TData>(
    header: Header<TData, unknown>,
    hasFrozen: boolean,
    columnSizing: Record<string, number>,
    isLastUnpinned?: boolean,
): CSSProperties {
    const pinningStyles = hasFrozen ? getCommonPinningStyles(header.column) : {};
    const isPinned = header.column.getIsPinned();

    return {
        display: 'flex',
        alignItems: 'center',
        // Last unpinned column stretches to fill remaining space
        ...(isLastUnpinned
            ? { minWidth: `var(--header-${header.id}-size)`, flex: 1 }
            : { width: `var(--header-${header.id}-size)`, flex: hasFrozen ? 'none' : (columnSizing[header.id] || header.column.columnDef.meta?.width) ? 'none' : 1 }
        ),
        ...pinningStyles,
        zIndex: isPinned ? 3 : undefined,
        position: isPinned ? 'sticky' : 'relative',
    };
}

// ── Cell style helper ────────────────────────────────────────────────

export function getCellStyle<TData>(
    cell: { column: Column<TData, unknown> },
    hasFrozen: boolean,
    columnSizing: Record<string, number>,
    isLastUnpinned?: boolean,
): CSSProperties {
    const meta = cell.column.columnDef.meta;
    const pinningStyles = hasFrozen ? getCommonPinningStyles(cell.column) : {};

    return {
        ...(isLastUnpinned
            ? { minWidth: `var(--col-${cell.column.id}-size)`, flex: 1 }
            : { width: `var(--col-${cell.column.id}-size)`, flex: hasFrozen ? 'none' : (columnSizing[cell.column.id] || meta?.width) ? 'none' : 1 }
        ),
        ...pinningStyles,
    };
}

// ── Sort index helper ───────────────────────────────────────────────

export function createGetSortIndex(sorting: SortingState) {
    return (columnId: string) => {
        const idx = sorting.findIndex(s => s.id === columnId);
        return idx >= 0 ? idx + 1 : undefined;
    };
}
