/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useRef, useState, useEffect, useCallback } from "react";
import {
    Table as ChakraTable,
    Box,
    HStack,
    Text,
    IconButton,
    Skeleton,
    type TableRootProps,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown, faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    createColumnHelper,
    flexRender,
    type SortingState,
    type ColumnResizeMode,
    type ColumnDef,
    type RowSelectionState,
} from "@tanstack/react-table";
import { ArrayType, compareFor, equalFor, printFor, StringType, variant, type ValueTypeOf } from "@elaraai/east";
import { Table } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";
import { RowStateManager, type RowKey, type RowState } from "../../utils/RowStateManager";

// Pre-define equality function at module level
const tableRootEqual = equalFor(Table.Types.Root);

// Parse CSS size values to pixels (simple numeric extraction)
const parseSize = (val: string | undefined, defaultVal: number): number => {
    if (!val) return defaultVal;
    const num = parseInt(val, 10);
    return isNaN(num) ? defaultVal : num;
};

/** East Table Root value type */
export type TableRootValue = ValueTypeOf<typeof Table.Types.Root>;

/** East Table Column value type */
export type TableColumnValue = ValueTypeOf<typeof Table.Types.Column>;

/** East Table Cell value type */
export type TableCellValue = ValueTypeOf<typeof Table.Types.Cell>;

/** East Table Row value type */
export type TableRowValue = Map<string, TableCellValue>;

// Column sort types for external API
export type SortDirection = 'asc' | 'desc';
export interface ColumnSort {
    columnKey: string;
    direction: SortDirection;
}

// Extend TanStack Table's ColumnMeta for our custom properties
declare module '@tanstack/react-table' {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    interface ColumnMeta<TData, TValue> {
        print?: (value: unknown) => string;
        columnKey?: string;
        width?: string | undefined;
        minWidth?: string | undefined;
        maxWidth?: string | undefined;
    }
    /* eslint-enable @typescript-eslint/no-unused-vars */
}

/**
 * Converts an East UI Table Root value to Chakra UI TableRoot props.
 */
export function toChakraTableRoot(value: TableRootValue): TableRootProps {
    const style = getSomeorUndefined(value.style);

    return {
        variant: style ? getSomeorUndefined(style.variant)?.type : undefined,
        size: style ? getSomeorUndefined(style.size)?.type : undefined,
        striped: style ? getSomeorUndefined(style.striped) : undefined,
        interactive: style ? getSomeorUndefined(style.interactive) : undefined,
        stickyHeader: style ? getSomeorUndefined(style.stickyHeader) : undefined,
        showColumnBorder: style ? getSomeorUndefined(style.showColumnBorder) : undefined,
        colorPalette: style ? getSomeorUndefined(style.colorPalette)?.type : undefined,
    };
}

export interface EastChakraTableProps {
    value: TableRootValue;
    /** Height of the table container (required for virtualization) */
    height?: string | number;
    /** Estimated row height for virtualization */
    rowHeight?: number;
    /** Number of rows to render outside visible area */
    overscan?: number;
    /** Callback when sort changes */
    onSortChange?: (sorts: ColumnSort[]) => void;
    /** Enable multi-column sorting */
    enableMultiSort?: boolean;
    /** Maximum number of sort columns */
    maxSortColumns?: number;
    /** Loading delay before showing row content (ms) */
    loadingDelay?: number;
    /** Enable column resizing */
    enableColumnResizing?: boolean;
}

/**
 * Renders an East UI Table value using Chakra UI Table components.
 * Features:
 * - Row virtualization for large datasets
 * - Column sorting with multi-sort support
 * - Column resizing
 * - Row loading state indicators
 */
export const EastChakraTable = memo(function EastChakraTable({
    value,
    height = "400px",
    rowHeight = 48,
    overscan = 8,
    onSortChange,
    enableMultiSort = true,
    maxSortColumns = 5,
    loadingDelay = 200,
    enableColumnResizing = true,
}: EastChakraTableProps) {
    const props = useMemo(() => toChakraTableRoot(value), [value]);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    // Extract East-side callbacks from style
    const style = useMemo(() => getSomeorUndefined(value.style), [value.style]);
    const onCellClickFn = useMemo(() => style ? getSomeorUndefined(style.onCellClick) : undefined, [style]);
    const onCellDoubleClickFn = useMemo(() => style ? getSomeorUndefined(style.onCellDoubleClick) : undefined, [style]);
    const onRowClickFn = useMemo(() => style ? getSomeorUndefined(style.onRowClick) : undefined, [style]);
    const onRowDoubleClickFn = useMemo(() => style ? getSomeorUndefined(style.onRowDoubleClick) : undefined, [style]);
    const onSortChangeFn = useMemo(() => style ? getSomeorUndefined(style.onSortChange) : undefined, [style]);
    const onRowSelectionChangeFn = useMemo(() => style ? getSomeorUndefined(style.onRowSelectionChange) : undefined, [style]);

    // Row state management for loading indicators
    const [rowStateManager] = useState(() => new RowStateManager());
    const [rowStates, setRowStates] = useState<Map<RowKey, RowState>>(new Map());
    const visibleRowsRef = useRef<Set<RowKey>>(new Set());

    // Subscribe to row state changes
    useEffect(() => {
        return rowStateManager.subscribe(() => {
            setRowStates(new Map(rowStateManager.getStates()));
        });
    }, [rowStateManager]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            rowStateManager.clear();
        };
    }, [rowStateManager]);

    // Column helper for type-safe column definitions
    const columnHelper = createColumnHelper<TableRowValue>();

    // Create TanStack Table columns from East UI columns
    const columns = useMemo<ColumnDef<TableRowValue, TableCellValue | undefined>[]>(() => {
        return value.columns.map((col) => {
            const print = col.type.type === 'Array' ? printFor(ArrayType(StringType)) : printFor(col.type);
            const compare = col.type.type === 'Array' ? compareFor(ArrayType(StringType)) : compareFor(col.type);

            // Extract width values from column config
            const width = getSomeorUndefined(col.width);
            const minWidth = getSomeorUndefined(col.minWidth);
            const maxWidth = getSomeorUndefined(col.maxWidth);

            return columnHelper.accessor(
                (row) => row.get(col.key),
                {
                    id: col.key,
                    header: getSomeorUndefined(col.header) ?? col.key,
                    enableSorting: true,
                    sortingFn: (rowA, rowB, columnId) => {
                        const cellA = rowA.original.get(columnId);
                        const cellB = rowB.original.get(columnId);
                         const valA = cellA?.value?.value;
                        const valB = cellB?.value?.value;
                        if (valA === undefined || valB === undefined) return 0;
                        return compare(valA as any, valB as any);
                    },
                    minSize: parseSize(minWidth, 80),
                    size: parseSize(width, 150),
                    maxSize: parseSize(maxWidth, 400),
                    meta: {
                        print: print as any,
                        columnKey: col.key,
                        width,
                        minWidth,
                        maxWidth,
                    },
                }
            );
        });
    }, [value.columns, columnHelper]);

    // Sorting state
    const [sorting, setSorting] = useState<SortingState>([]);

    // Row selection state
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // Handle row selection changes
    const handleRowSelectionChange = useCallback((updater: RowSelectionState | ((prev: RowSelectionState) => RowSelectionState)) => {
        setRowSelection(prev => {
            const newSelection = typeof updater === 'function' ? updater(prev) : updater;

            // Find what changed
            if (onRowSelectionChangeFn) {
                const selectedIndices = Object.keys(newSelection)
                    .filter(key => newSelection[key])
                    .map(key => BigInt(parseInt(key, 10)));

                // Find which row changed by comparing with previous state
                const prevSelected = new Set(Object.keys(prev).filter(key => prev[key]));
                const newSelected = new Set(Object.keys(newSelection).filter(key => newSelection[key]));

                // Find newly selected or deselected rows
                for (const key of newSelected) {
                    if (!prevSelected.has(key)) {
                        const rowIndex = BigInt(parseInt(key, 10));
                        queueMicrotask(() => onRowSelectionChangeFn({
                            rowIndex,
                            selected: true,
                            selectedRowsIndices: selectedIndices,
                        }));
                    }
                }
                for (const key of prevSelected) {
                    if (!newSelected.has(key)) {
                        const rowIndex = BigInt(parseInt(key, 10));
                        queueMicrotask(() => onRowSelectionChangeFn({
                            rowIndex,
                            selected: false,
                            selectedRowsIndices: selectedIndices,
                        }));
                    }
                }
            }

            return newSelection;
        });
    }, [onRowSelectionChangeFn]);

    // Handle sorting changes and notify parent
    const handleSortingChange = useCallback((updater: SortingState | ((prev: SortingState) => SortingState)) => {
        setSorting(prev => {
            const newSorting = typeof updater === 'function' ? updater(prev) : updater;

            // Convert to external ColumnSort format
            const sorts: ColumnSort[] = newSorting.map(s => ({
                columnKey: s.id,
                direction: s.desc ? 'desc' : 'asc'
            }));
            onSortChange?.(sorts);

            // Also call East-side callback if present - called once per sort column
            if (onSortChangeFn) {
                newSorting.forEach((s, index) => {
                    queueMicrotask(() => onSortChangeFn({
                        columnKey: s.id,
                        sortIndex: BigInt(index),
                        sortDirection: s.desc ? variant('desc', null) : variant('asc', null),
                    }));
                });
            }

            return newSorting;
        });
    }, [onSortChange, onSortChangeFn]);

    // Handle cell click
    const handleCellClick = useCallback((rowIndex: bigint, columnKey: string, cellValue: TableCellValue | undefined) => {
        if (onCellClickFn && cellValue?.value !== undefined) {
            queueMicrotask(() => onCellClickFn({ rowIndex, columnKey, cellValue: cellValue.value }));
        }
    }, [onCellClickFn]);

    // Handle cell double click
    const handleCellDoubleClick = useCallback((rowIndex: bigint, columnKey: string, cellValue: TableCellValue | undefined) => {
        if (onCellDoubleClickFn && cellValue?.value !== undefined) {
            queueMicrotask(() => onCellDoubleClickFn({ rowIndex, columnKey, cellValue: cellValue.value }));
        }
    }, [onCellDoubleClickFn]);

    // Handle row click
    const handleRowClick = useCallback((rowIndex: bigint) => {
        if (onRowClickFn) {
            queueMicrotask(() => onRowClickFn({ rowIndex }));
        }
    }, [onRowClickFn]);

    // Handle row double click
    const handleRowDoubleClick = useCallback((rowIndex: bigint) => {
        if (onRowDoubleClickFn) {
            queueMicrotask(() => onRowDoubleClickFn({ rowIndex }));
        }
    }, [onRowDoubleClickFn]);

    // Column sizing state
    const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});

    // Create table instance
    const table = useReactTable({
        data: value.rows,
        columns,
        state: {
            sorting,
            columnSizing,
            rowSelection,
        },
        onSortingChange: handleSortingChange,
        onColumnSizingChange: setColumnSizing,
        onRowSelectionChange: handleRowSelectionChange,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableMultiSort,
        isMultiSortEvent: () => enableMultiSort,
        maxMultiSortColCount: maxSortColumns,
        enableColumnResizing,
        columnResizeMode: 'onChange' as ColumnResizeMode,
        enableRowSelection: true,
    });

    // Get sorted rows from table
    const { rows } = table.getRowModel();

    // Calculate column size CSS variables for performance
    const columnSizeVars = useMemo(() => {
        const headers = table.getFlatHeaders();
        const colSizes: Record<string, string> = {};

        headers.forEach(header => {
            colSizes[`--header-${header.id}-size`] = `${header.getSize()}px`;
            colSizes[`--col-${header.column.id}-size`] = `${header.column.getSize()}px`;
        });

        return colSizes;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

    // Virtual row setup
    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => tableContainerRef.current,
        estimateSize: () => rowHeight,
        overscan,
    });

    const virtualItems = virtualizer.getVirtualItems();

    // Process visible rows for loading state
    useEffect(() => {
        const currentVisible = new Set<RowKey>();

        virtualItems.forEach(item => {
            currentVisible.add(item.index);
        });

        const prevVisible = visibleRowsRef.current;

        // Find rows that need loading
        const load: RowKey[] = [];
        currentVisible.forEach(key => {
            const rowState = rowStateManager.getRowState(key);
            if (rowState.status === 'unloaded') {
                load.push(key);
            }
        });

        // Find rows that left viewport
        const unload: RowKey[] = [];
        prevVisible.forEach(key => {
            if (!currentVisible.has(key)) {
                unload.push(key);
            }
        });

        // Process state changes
        if (load.length > 0) {
            rowStateManager.markRowsLoading(load);
            load.forEach(key => rowStateManager.scheduleLoaded(key, loadingDelay));
        }

        if (unload.length > 0) {
            rowStateManager.markRowsUnloaded(unload);
        }

        visibleRowsRef.current = currentVisible;
    }, [virtualItems, rowStateManager, loadingDelay]);

    // Get sort index for a column (1-based)
    const getSortIndex = useCallback((columnId: string) => {
        const idx = sorting.findIndex(s => s.id === columnId);
        return idx >= 0 ? idx + 1 : undefined;
    }, [sorting]);

    return (
        <Box
            ref={tableContainerRef}
            height={height}
            overflowY="auto"
            position="relative"
        >
            <ChakraTable.Root
                {...props}
                style={{
                    ...columnSizeVars,
                    width: '100%',
                    minWidth: table.getCenterTotalSize(),
                    tableLayout: 'fixed',
                }}
            >
                <ChakraTable.Header style={{ display: 'block' }} position="sticky" top={0} zIndex={1} bg="bg.panel">
                    {table.getHeaderGroups().map(headerGroup => (
                        <ChakraTable.Row key={headerGroup.id} style={{ display: 'flex', width: '100%' }}>
                            {headerGroup.headers.map((header) => {
                                const sortIndex = getSortIndex(header.id);
                                const isSorted = header.column.getIsSorted();
                                const sortDirection = isSorted || null;

                                const icon = !isSorted ? faAnglesDown
                                    : sortDirection === 'asc' ? faChevronUp
                                        : faChevronDown;

                                return (
                                    <ChakraTable.ColumnHeader
                                        key={header.id}
                                        cursor={header.column.getCanSort() ? "pointer" : "default"}
                                        _hover={header.column.getCanSort() ? { bg: 'bg.muted' } : {}}
                                        onClick={header.column.getToggleSortingHandler()}
                                        transition="background 0.2s"
                                        style={{
                                            width: `var(--header-${header.id}-size)`,
                                            flex: (columnSizing[header.id] || header.column.columnDef.meta?.width) ? 'none' : 1,
                                        }}
                                        position="relative"
                                    >
                                        <HStack justify="space-between" width="100%" pr={enableColumnResizing ? "8px" : "0"}>
                                            <Text
                                                fontSize="sm"
                                                fontWeight="semibold"
                                                overflow="hidden"
                                                textOverflow="ellipsis"
                                                whiteSpace="nowrap"
                                                flex="1"
                                            >
                                                {header.isPlaceholder ? null : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </Text>
                                            <HStack gap={1} flexShrink={0}>
                                                {header.column.getCanSort() && (
                                                    <IconButton
                                                        aria-label={`Sort by ${header.id}`}
                                                        size="xs"
                                                        variant="ghost"
                                                        color={isSorted ? "fg.default" : "fg.muted"}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            header.column.toggleSorting(undefined, enableMultiSort);
                                                        }}
                                                        _hover={{
                                                            bg: 'bg.muted',
                                                            color: "fg.default"
                                                        }}
                                                        position="relative"
                                                    >
                                                        <FontAwesomeIcon icon={icon} style={{ width: '12px', height: '12px' }} />
                                                        {isSorted && sortIndex && (
                                                            <Box
                                                                position="absolute"
                                                                top="-2px"
                                                                right="-2px"
                                                                bg="fg.muted"
                                                                color="bg.panel"
                                                                borderRadius="full"
                                                                width="12px"
                                                                height="12px"
                                                                display="flex"
                                                                alignItems="center"
                                                                justifyContent="center"
                                                                fontSize="8px"
                                                                fontWeight="bold"
                                                            >
                                                                {sortIndex}
                                                            </Box>
                                                        )}
                                                    </IconButton>
                                                )}
                                            </HStack>
                                        </HStack>

                                        {/* Column Resize Handle */}
                                        {enableColumnResizing && header.column.getCanResize() && (
                                            <Box
                                                position="absolute"
                                                right="0"
                                                top="0"
                                                bottom="0"
                                                width="8px"
                                                cursor="col-resize"
                                                bg="transparent"
                                                _hover={{
                                                    _before: {
                                                        opacity: 1,
                                                        bg: 'fg.muted'
                                                    }
                                                }}
                                                transition="all 0.2s"
                                                zIndex={10}
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}
                                                _before={{
                                                    content: '""',
                                                    position: 'absolute',
                                                    right: '2px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    width: '2px',
                                                    height: '16px',
                                                    bg: 'gray.300',
                                                    borderRadius: '1px',
                                                    opacity: 0.4,
                                                    transition: 'opacity 0.2s'
                                                }}
                                            />
                                        )}
                                    </ChakraTable.ColumnHeader>
                                );
                            })}
                        </ChakraTable.Row>
                    ))}
                </ChakraTable.Header>

                <ChakraTable.Body
                    style={{
                        display: 'block',
                        position: 'relative',
                        height: `${virtualizer.getTotalSize()}px`,
                    }}
                >
                    {virtualItems.map(virtualRow => {
                        const row = rows[virtualRow.index];
                        if (!row) return null;

                        const rowKey = virtualRow.index;
                        const rowState = rowStates.get(rowKey) || { status: 'unloaded' };
                        const isRowLoading = !rowStateManager.isRowLoaded(rowKey) || rowState.status === 'loading';

                        const rowIndex = BigInt(virtualRow.index);

                        return (
                            <ChakraTable.Row
                                key={row.id}
                                style={{
                                    display: 'flex',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                    cursor: (onRowClickFn || onRowDoubleClickFn) ? 'pointer' : undefined,
                                }}
                                onClick={onRowClickFn ? () => handleRowClick(rowIndex) : undefined}
                                onDoubleClick={onRowDoubleClickFn ? () => handleRowDoubleClick(rowIndex) : undefined}
                            >
                                {row.getVisibleCells().map((cell) => {
                                    const cellValue = cell.getValue() as TableCellValue | undefined;
                                    const meta = cell.column.columnDef.meta;
                                    const columnKey = meta?.columnKey ?? cell.column.id;

                                    const cellStyle = {
                                        width: `var(--col-${cell.column.id}-size)`,
                                        flex: (columnSizing[cell.column.id] || meta?.width) ? 'none' : 1,
                                    };

                                    const cellClickHandler = onCellClickFn ? (e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        handleCellClick(rowIndex, columnKey, cellValue);
                                    } : undefined;

                                    const cellDoubleClickHandler = onCellDoubleClickFn ? (e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        handleCellDoubleClick(rowIndex, columnKey, cellValue);
                                    } : undefined;

                                    if (isRowLoading) {
                                        return (
                                            <ChakraTable.Cell key={cell.id} style={cellStyle}>
                                                <Skeleton height="20px" width="80%" />
                                            </ChakraTable.Cell>
                                        );
                                    }

                                    if (cellValue == null) {
                                        return (
                                            <ChakraTable.Cell
                                                key={cell.id}
                                                style={cellStyle}
                                                onClick={cellClickHandler}
                                                onDoubleClick={cellDoubleClickHandler}
                                            />
                                        );
                                    }

                                    if (cellValue.content != null) {
                                        return (
                                            <ChakraTable.Cell
                                                key={cell.id}
                                                style={cellStyle}
                                                onClick={cellClickHandler}
                                                onDoubleClick={cellDoubleClickHandler}
                                            >
                                                <EastChakraComponent value={cellValue.content} />
                                            </ChakraTable.Cell>
                                        );
                                    }

                                    return (
                                        <ChakraTable.Cell
                                            key={cell.id}
                                            style={cellStyle}
                                            onClick={cellClickHandler}
                                            onDoubleClick={cellDoubleClickHandler}
                                        >
                                            <Text>{meta?.print?.(cellValue.value.value) ?? null}</Text>
                                        </ChakraTable.Cell>
                                    );
                                })}
                            </ChakraTable.Row>
                        );
                    })}
                </ChakraTable.Body>
            </ChakraTable.Root>
        </Box>
    );
}, (prev, next) => tableRootEqual(prev.value, next.value));
