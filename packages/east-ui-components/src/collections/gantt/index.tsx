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
    Splitter,
    useToken,
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
} from "@tanstack/react-table";
import { equalFor, printFor, type ValueTypeOf } from "@elaraai/east";
import { Gantt } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";
import { RowStateManager, type RowKey, type RowState } from "../../utils/RowStateManager";
import { EventAxis, generateDateTicks, getDatePosition } from "./EventAxis";
import { GanttEventRow, type GanttEventValue } from "./GanttEventRow";

// Pre-define equality function at module level
const ganttRootEqual = equalFor(Gantt.Types.Root);

/** East Gantt Root value type */
export type GanttRootValue = ValueTypeOf<typeof Gantt.Types.Root>;

/** East Gantt Column value type */
export type GanttColumnValue = ValueTypeOf<typeof Gantt.Types.Column>;

/** East Gantt Cell value type */
export type GanttCellValue = ValueTypeOf<typeof Gantt.Types.Cell>;

/** East Gantt Row value type */
export type GanttRowValue = ValueTypeOf<typeof Gantt.Types.Row>;

// Column sort types for external API
export type SortDirection = "asc" | "desc";
export interface ColumnSort {
    columnKey: string;
    direction: SortDirection;
}

// Extend TanStack Table's ColumnMeta for our custom properties
declare module "@tanstack/react-table" {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface ColumnMeta<TData, TValue> {
        print?: (value: unknown) => string;
        columnKey?: string;
    }
}

/**
 * Converts an East UI Gantt Root value to Chakra UI TableRoot props.
 */
export function toChakraTableRoot(value: GanttRootValue): TableRootProps {
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

export interface EastChakraGanttProps {
    value: GanttRootValue;
    /** Height of the gantt container (required for virtualization) */
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
    /** Callback when an event is clicked */
    onEventClick?: (event: GanttEventValue, rowIndex: number, eventIndex: number) => void;
    /** Initial size of the table panel (0-100) */
    tablePanelSize?: number;
}

/**
 * Renders an East UI Gantt value using Chakra UI components.
 * Features:
 * - Row virtualization for large datasets
 * - Column sorting with multi-sort support
 * - Column resizing
 * - Resizable splitter between table and timeline
 * - SVG-based task and milestone rendering
 */
export const EastChakraGantt = memo(function EastChakraGantt({
    value,
    height = "400px",
    rowHeight = 48,
    overscan = 8,
    onSortChange,
    enableMultiSort = true,
    maxSortColumns = 5,
    loadingDelay = 200,
    enableColumnResizing = true,
    onEventClick,
    tablePanelSize = 40,
}: EastChakraGanttProps) {
    const props = useMemo(() => toChakraTableRoot(value), [value]);
    const headerHeight = 56;
    const [gridLineColor] = useToken("colors", ["gray.300"]);
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const timelineContainerRef = useRef<HTMLDivElement>(null);
    const [timelineWidth, setTimelineWidth] = useState(400);

    // Row state management for loading indicators
    const [rowStateManager] = useState(() => new RowStateManager());
    const [rowStates, setRowStates] = useState<Map<RowKey, RowState>>(new Map());
    const visibleRowsRef = useRef<Set<RowKey>>(new Set());

    // Calculate date range from events
    const dateRange = useMemo(() => {
        let minDate: Date | null = null;
        let maxDate: Date | null = null;

        value.rows.forEach((row) => {
            row.events.forEach((event) => {
                if (event.type === "Milestone") {
                    const date = event.value.date;
                    if (minDate === null || date < minDate) minDate = date;
                    if (maxDate === null || date > maxDate) maxDate = date;
                } else {
                    const start = event.value.start;
                    const end = event.value.end;
                    if (minDate === null || start < minDate) minDate = start;
                    if (maxDate === null || end > maxDate) maxDate = end;
                }
            });
        });

        // Fallback to current date if no events
        if (minDate === null) minDate = new Date();
        if (maxDate === null) maxDate = new Date();

        // Add 10% buffer on each side
        const totalDuration = maxDate.getTime() - minDate.getTime();
        const bufferDuration = Math.max(totalDuration * 0.1, 24 * 60 * 60 * 1000); // At least 1 day buffer

        return {
            start: new Date(minDate.getTime() - bufferDuration),
            end: new Date(maxDate.getTime() + bufferDuration),
        };
    }, [value.rows]);

    // Calculate grid line positions for dashed vertical lines
    const gridLinePositions = useMemo(() => {
        const dates = generateDateTicks(dateRange.start, dateRange.end, Math.floor(timelineWidth / 100));
        return dates
            .map((date) => getDatePosition(date, dateRange.start, dateRange.end, timelineWidth))
            .filter((x) => x >= 0 && x <= timelineWidth);
    }, [dateRange.start, dateRange.end, timelineWidth]);

    // Update timeline width when container resizes (including splitter changes)
    useEffect(() => {
        const container = timelineContainerRef.current;
        if (!container) return;

        const updateWidth = () => {
            const width = container.offsetWidth;
            setTimelineWidth(Math.max(200, width));
        };

        updateWidth();

        const resizeObserver = new ResizeObserver(updateWidth);
        resizeObserver.observe(container);

        return () => resizeObserver.disconnect();
    }, []);

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
    const columnHelper = createColumnHelper<GanttRowValue>();

    // Create TanStack Table columns from East UI columns
    const columns = useMemo<ColumnDef<GanttRowValue, GanttCellValue | undefined>[]>(() => {
        return value.columns.map((col) => {
            const print = printFor(col.type);
            return columnHelper.accessor(
                (row) => row.cells.get(col.key),
                {
                    id: col.key,
                    header: getSomeorUndefined(col.header) ?? col.key,
                    enableSorting: true,
                    minSize: 80,
                    size: 150,
                    maxSize: 400,
                    meta: {
                        print,
                        columnKey: col.key,
                    },
                }
            );
        });
    }, [value.columns, columnHelper]);

    // Sorting state
    const [sorting, setSorting] = useState<SortingState>([]);

    // Handle sorting changes and notify parent
    const handleSortingChange = useCallback(
        (updater: SortingState | ((prev: SortingState) => SortingState)) => {
            setSorting((prev) => {
                const newSorting = typeof updater === "function" ? updater(prev) : updater;

                // Convert to external ColumnSort format
                const sorts: ColumnSort[] = newSorting.map((s) => ({
                    columnKey: s.id,
                    direction: s.desc ? "desc" : "asc",
                }));
                onSortChange?.(sorts);

                return newSorting;
            });
        },
        [onSortChange]
    );

    // Column sizing state
    const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});

    // Create table instance
    const table = useReactTable({
        data: value.rows,
        columns,
        state: {
            sorting,
            columnSizing,
        },
        onSortingChange: handleSortingChange,
        onColumnSizingChange: setColumnSizing,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableMultiSort,
        isMultiSortEvent: () => enableMultiSort,
        maxMultiSortColCount: maxSortColumns,
        enableColumnResizing,
        columnResizeMode: "onChange" as ColumnResizeMode,
    });

    // Get sorted rows from table
    const { rows } = table.getRowModel();

    // Calculate column size CSS variables for performance
    const columnSizeVars = useMemo(() => {
        const headers = table.getFlatHeaders();
        const colSizes: Record<string, string> = {};

        headers.forEach((header) => {
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

        virtualItems.forEach((item) => {
            currentVisible.add(item.index);
        });

        const prevVisible = visibleRowsRef.current;

        // Find rows that need loading
        const load: RowKey[] = [];
        currentVisible.forEach((key) => {
            const rowState = rowStateManager.getRowState(key);
            if (rowState.status === "unloaded") {
                load.push(key);
            }
        });

        // Find rows that left viewport
        const unload: RowKey[] = [];
        prevVisible.forEach((key) => {
            if (!currentVisible.has(key)) {
                unload.push(key);
            }
        });

        // Process state changes
        if (load.length > 0) {
            rowStateManager.markRowsLoading(load);
            load.forEach((key) => rowStateManager.scheduleLoaded(key, loadingDelay));
        }

        if (unload.length > 0) {
            rowStateManager.markRowsUnloaded(unload);
        }

        visibleRowsRef.current = currentVisible;
    }, [virtualItems, rowStateManager, loadingDelay]);

    // Get sort index for a column (1-based)
    const getSortIndex = useCallback(
        (columnId: string) => {
            const idx = sorting.findIndex((s) => s.id === columnId);
            return idx >= 0 ? idx + 1 : undefined;
        },
        [sorting]
    );

    // Sync scroll between table and timeline
    const handleTableScroll = useCallback(() => {
        if (tableContainerRef.current && timelineContainerRef.current) {
            timelineContainerRef.current.scrollTop = tableContainerRef.current.scrollTop;
        }
    }, []);

    const handleTimelineScroll = useCallback(() => {
        if (tableContainerRef.current && timelineContainerRef.current) {
            tableContainerRef.current.scrollTop = timelineContainerRef.current.scrollTop;
        }
    }, []);

    const panels = useMemo(() => [
        { id: "table", minSize: 20 },
        { id: "timeline", minSize: 20 },
    ], []);

    return (
        <Splitter.Root
            defaultSize={[tablePanelSize, 100 - tablePanelSize]}
            panels={panels}
            width="100%"
            height={height}
        >
            {/* Table Panel */}
            <Splitter.Panel id="table">
                <Box
                    ref={tableContainerRef}
                    height="100%"
                    overflowY="auto"
                    position="relative"
                    onScroll={handleTableScroll}
                >
                    <ChakraTable.Root
                        {...props}
                        style={{
                            ...columnSizeVars,
                            width: "100%",
                            minWidth: table.getCenterTotalSize(),
                            tableLayout: "fixed",
                        }}
                    >
                        <ChakraTable.Header
                            style={{ display: "block" }}
                            position="sticky"
                            top={0}
                            zIndex={1}
                            bg="bg.panel"
                        >
                            {table.getHeaderGroups().map((headerGroup) => (
                                <ChakraTable.Row
                                    key={headerGroup.id}
                                    style={{ display: "flex", width: "100%", height: `${headerHeight}px` }}
                                >
                                    {headerGroup.headers.map((header) => {
                                        const sortIndex = getSortIndex(header.id);
                                        const isSorted = header.column.getIsSorted();
                                        const sortDirection = isSorted || null;

                                        const icon = !isSorted
                                            ? faAnglesDown
                                            : sortDirection === "asc"
                                              ? faChevronUp
                                              : faChevronDown;

                                        return (
                                            <ChakraTable.ColumnHeader
                                                key={header.id}
                                                cursor={
                                                    header.column.getCanSort() ? "pointer" : "default"
                                                }
                                                _hover={
                                                    header.column.getCanSort() ? { bg: "bg.muted" } : {}
                                                }
                                                onClick={header.column.getToggleSortingHandler()}
                                                transition="background 0.2s"
                                                style={{
                                                    width: `var(--header-${header.id}-size)`,
                                                    flex: columnSizing[header.id] ? "none" : 1,
                                                }}
                                                position="relative"
                                            >
                                                <HStack
                                                    justify="space-between"
                                                    width="100%"
                                                    pr={enableColumnResizing ? "8px" : "0"}
                                                >
                                                    <Text
                                                        fontSize="sm"
                                                        fontWeight="semibold"
                                                        overflow="hidden"
                                                        textOverflow="ellipsis"
                                                        whiteSpace="nowrap"
                                                        flex="1"
                                                    >
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
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
                                                                color={
                                                                    isSorted ? "fg.default" : "fg.muted"
                                                                }
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    header.column.toggleSorting(
                                                                        undefined,
                                                                        enableMultiSort
                                                                    );
                                                                }}
                                                                _hover={{
                                                                    bg: "bg.muted",
                                                                    color: "fg.default",
                                                                }}
                                                                position="relative"
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={icon}
                                                                    style={{
                                                                        width: "12px",
                                                                        height: "12px",
                                                                    }}
                                                                />
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
                                                {enableColumnResizing &&
                                                    header.column.getCanResize() && (
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
                                                                    bg: "fg.muted",
                                                                },
                                                            }}
                                                            transition="all 0.2s"
                                                            zIndex={10}
                                                            onMouseDown={header.getResizeHandler()}
                                                            onTouchStart={header.getResizeHandler()}
                                                            _before={{
                                                                content: '""',
                                                                position: "absolute",
                                                                right: "2px",
                                                                top: "50%",
                                                                transform: "translateY(-50%)",
                                                                width: "2px",
                                                                height: "16px",
                                                                bg: "gray.300",
                                                                borderRadius: "1px",
                                                                opacity: 0.4,
                                                                transition: "opacity 0.2s",
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
                                display: "block",
                                position: "relative",
                                height: `${virtualizer.getTotalSize()}px`,
                            }}
                        >
                            {virtualItems.map((virtualRow) => {
                                const row = rows[virtualRow.index];
                                if (!row) return null;

                                const rowKey = virtualRow.index;
                                const rowState = rowStates.get(rowKey) || { status: "unloaded" };
                                const isRowLoading =
                                    !rowStateManager.isRowLoaded(rowKey) ||
                                    rowState.status === "loading";

                                return (
                                    <ChakraTable.Row
                                        key={row.id}
                                        style={{
                                            display: "flex",
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: `${virtualRow.size}px`,
                                            transform: `translateY(${virtualRow.start}px)`,
                                        }}
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            const cellValue = cell.getValue() as
                                                | GanttCellValue
                                                | undefined;
                                            const meta = cell.column.columnDef.meta;

                                            const cellStyle = {
                                                width: `var(--col-${cell.column.id}-size)`,
                                                flex: columnSizing[cell.column.id] ? "none" : 1,
                                            };

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
                                                    />
                                                );
                                            }

                                            if (cellValue.content != null) {
                                                return (
                                                    <ChakraTable.Cell key={cell.id} style={cellStyle}>
                                                        <EastChakraComponent
                                                            value={cellValue.content}
                                                        />
                                                    </ChakraTable.Cell>
                                                );
                                            }

                                            return (
                                                <ChakraTable.Cell key={cell.id} style={cellStyle}>
                                                    <Text>
                                                        {meta?.print?.(cellValue.value.value) ?? null}
                                                    </Text>
                                                </ChakraTable.Cell>
                                            );
                                        })}
                                    </ChakraTable.Row>
                                );
                            })}
                        </ChakraTable.Body>
                    </ChakraTable.Root>
                </Box>
            </Splitter.Panel>

            <Splitter.ResizeTrigger id="table:timeline" />

            {/* Timeline Panel */}
            <Splitter.Panel id="timeline">
                <Box
                    ref={timelineContainerRef}
                    width="100%"
                    height="100%"
                    overflowY="auto"
                    overflowX="hidden"
                    position="relative"
                    onScroll={handleTimelineScroll}
                >
                    {/* Timeline Header - matches table header styling */}
                    <Box position="sticky" top={0} zIndex={1} bg="bg.panel">
                        <EventAxis
                            startDate={dateRange.start}
                            endDate={dateRange.end}
                            width={timelineWidth}
                            height={headerHeight}
                        />
                    </Box>

                    {/* Timeline Body - uses same table structure for matching row styles */}
                    <Box position="relative">
                        <ChakraTable.Root
                            {...props}
                            style={{
                                width: "100%",
                                tableLayout: "fixed",
                                position: "relative",
                            }}
                        >
                        <ChakraTable.Body
                            style={{
                                display: "block",
                                position: "relative",
                                height: `${virtualizer.getTotalSize()}px`,
                            }}
                        >
                            {virtualItems.map((virtualRow) => {
                                const row = rows[virtualRow.index];
                                if (!row) return null;

                                return (
                                    <ChakraTable.Row
                                        key={row.id}
                                        style={{
                                            display: "flex",
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: `${virtualRow.size}px`,
                                            transform: `translateY(${virtualRow.start}px)`,
                                        }}
                                    >
                                        <ChakraTable.Cell
                                            style={{ width: "100%", padding: 0 }}
                                        >
                                            <svg width="100%" height={virtualRow.size}>
                                                <GanttEventRow
                                                    events={row.original.events}
                                                    rowIndex={virtualRow.index}
                                                    y={0}
                                                    width={timelineWidth}
                                                    height={virtualRow.size}
                                                    startDate={dateRange.start}
                                                    endDate={dateRange.end}
                                                    onEventClick={onEventClick}
                                                />
                                            </svg>
                                        </ChakraTable.Cell>
                                    </ChakraTable.Row>
                                );
                            })}
                        </ChakraTable.Body>
                        </ChakraTable.Root>
                        {/* Dashed vertical grid lines - rendered on top */}
                        <svg
                            width={timelineWidth}
                            height={virtualizer.getTotalSize()}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                pointerEvents: "none",
                                zIndex: 1,
                            }}
                        >
                            {gridLinePositions.map((x, index) => (
                                <line
                                    key={`grid-${index}`}
                                    x1={x}
                                    y1={0}
                                    x2={x}
                                    y2={virtualizer.getTotalSize()}
                                    stroke={gridLineColor}
                                    strokeWidth={1}
                                    strokeDasharray="4 4"
                                    opacity={0.6}
                                />
                            ))}
                        </svg>
                    </Box>
                </Box>
            </Splitter.Panel>
        </Splitter.Root>
    );
}, (prev, next) => ganttRootEqual(prev.value, next.value));
