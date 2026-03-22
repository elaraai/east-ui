/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useRef, useState, useEffect, useCallback } from "react";
import { usePersistedState } from "../../hooks/usePersistedState";
import {
    Table as ChakraTable,
    Box,
    Text,
    Skeleton,
    Splitter,
    useToken,
    type TableRootProps,
} from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    createColumnHelper,
    type SortingState,
    type ColumnResizeMode,
    type ColumnDef,
} from "@tanstack/react-table";
import { compareFor, equalFor, printFor, variant, type ValueTypeOf } from "@elaraai/east";
import { Planner, Table, type UIComponentType } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";
import { RowStateManager, type RowKey, type RowState } from "../../utils/RowStateManager";
import { useColumnPinning, HeaderControls, getHeaderCellStyle, getCellStyle, createGetSortIndex } from "../shared/column-pinning";
import { PlannerEventRow, type PlannerEventValue } from "./PlannerEventRow";
import { PlannerAxis } from "./PlannerAxis";

// Pre-define equality function at module level
const plannerRootEqual = equalFor(Planner.Types.Root);

// Parse CSS size values to pixels (simple numeric extraction)
const parseSize = (val: string | undefined, defaultVal: number): number => {
    if (!val) return defaultVal;
    const num = parseInt(val, 10);
    return isNaN(num) ? defaultVal : num;
};

/** East Planner Root value type */
export type PlannerRootValue = ValueTypeOf<typeof Planner.Types.Root>;

/** East Planner Column value type */
export type PlannerColumnValue = ValueTypeOf<typeof Planner.Types.Column>;

/** East Planner Cell value type */
export type PlannerCellValue = ValueTypeOf<typeof Planner.Types.Cell>;

/** East Planner Row value type */
export type PlannerRowValue = ValueTypeOf<typeof Planner.Types.Row>;

/** Cell Render Context value type */
type TableCellRenderContextValue = ValueTypeOf<typeof Table.Types.CellRenderContext>;

/** Column render function type */
type ColumnRenderFn = (ctx: TableCellRenderContextValue) => ValueTypeOf<UIComponentType>;

// Re-export PlannerEventValue from PlannerEventRow
export type { PlannerEventValue } from "./PlannerEventRow";

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
        width?: string | undefined;
        minWidth?: string | undefined;
        maxWidth?: string | undefined;
        renderFn?: ColumnRenderFn | undefined;
    }
}

/**
 * Converts an East UI Planner Root value to Chakra UI TableRoot props.
 */
export function toChakraTableRoot(value: PlannerRootValue): TableRootProps {
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

export interface EastChakraPlannerProps {
    value: PlannerRootValue;
    /** Height of the planner container (required for virtualization) */
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
    onEventClick?: (event: PlannerEventValue, rowIndex: number, eventIndex: number) => void;
    /** Initial size of the table panel (0-100) */
    tablePanelSize?: number;
    /** Storage key for persisting sort/column/splitter state in localStorage. Omit for ephemeral state. */
    storageKey: string;
}

interface PlannerPersistedState {
    sorting: SortingState;
    columnSizing: Record<string, number>;
    pinnedColumns: string[];
    tablePanelSize: number | null;
}

/**
 * Renders an East UI Planner value using Chakra UI components.
 * Features:
 * - Row virtualization for large datasets
 * - Column sorting with multi-sort support
 * - Column resizing
 * - Resizable splitter between table and slot grid
 * - Integer-based slot grid
 */
export const EastChakraPlanner = memo(function EastChakraPlanner({
    value,
    height = "100%",
    rowHeight = 48,
    overscan = 8,
    onSortChange,
    enableMultiSort = true,
    maxSortColumns = 5,
    loadingDelay = 200,
    enableColumnResizing = true,
    onEventClick,
    tablePanelSize: tablePanelSizeProp,
    storageKey,
}: EastChakraPlannerProps) {
    const props = useMemo(() => toChakraTableRoot(value), [value]);
    const styleHeight = useMemo(() => {
        const style = getSomeorUndefined(value.style);
        return style ? getSomeorUndefined(style.height) : undefined;
    }, [value]);
    const headerHeight = 56;

    // Track root container width for accurate splitter sizing
    const rootRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);
    useEffect(() => {
        const el = rootRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            if (entry) setContainerWidth(entry.contentRect.width);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // Extract style options
    const style = useMemo(() => getSomeorUndefined(value.style), [value.style]);
    const slotMinWidthValue = useMemo(() => style ? getSomeorUndefined(style.slotMinWidth) : undefined, [style]);
    const slotMinWidth = slotMinWidthValue ? parseInt(slotMinWidthValue, 10) || 60 : 60;
    const slotModeValue = useMemo(() => style ? getSomeorUndefined(style.slotMode) : undefined, [style]);
    const slotMode = slotModeValue?.type ?? "span";

    // Slot line styling
    const slotLineStroke = useMemo(() => style ? getSomeorUndefined(style.slotLineStroke) : undefined, [style]);
    const slotLineWidth = useMemo(() => style ? getSomeorUndefined(style.slotLineWidth) : undefined, [style]);
    const slotLineDash = useMemo(() => style ? getSomeorUndefined(style.slotLineDash) : undefined, [style]);
    const slotLineOpacity = useMemo(() => style ? getSomeorUndefined(style.slotLineOpacity) : undefined, [style]);

    // Boundaries (vertical lines at specific slot positions)
    const boundaries = useMemo(() => style ? getSomeorUndefined(style.boundaries) : undefined, [style]);

    // Extract East-side callbacks from style
    const onCellClickFn = useMemo(() => style ? getSomeorUndefined(style.onCellClick) : undefined, [style]);
    const onCellDoubleClickFn = useMemo(() => style ? getSomeorUndefined(style.onCellDoubleClick) : undefined, [style]);
    const onRowClickFn = useMemo(() => style ? getSomeorUndefined(style.onRowClick) : undefined, [style]);
    const onRowDoubleClickFn = useMemo(() => style ? getSomeorUndefined(style.onRowDoubleClick) : undefined, [style]);
    const onSortChangeFn = useMemo(() => style ? getSomeorUndefined(style.onSortChange) : undefined, [style]);
    const onEventClickFn = useMemo(() => style ? getSomeorUndefined(style.onEventClick) : undefined, [style]);
    const onEventDoubleClickFn = useMemo(() => style ? getSomeorUndefined(style.onEventDoubleClick) : undefined, [style]);
    const onEventDragFn = useMemo(() => style ? getSomeorUndefined(style.onEventDrag) : undefined, [style]);
    const onEventResizeFn = useMemo(() => style ? getSomeorUndefined(style.onEventResize) : undefined, [style]);
    const onEventAddFn = useMemo(() => style ? getSomeorUndefined(style.onEventAdd) : undefined, [style]);
    const onEventEditFn = useMemo(() => style ? getSomeorUndefined(style.onEventEdit) : undefined, [style]);
    const onEventDeleteFn = useMemo(() => style ? getSomeorUndefined(style.onEventDelete) : undefined, [style]);

    const [gridLineColor] = useToken("colors", ["gray.300"]);
    const slotContainerRef = useRef<HTMLDivElement>(null);

    // Row state management for loading indicators
    const [rowStateManager] = useState(() => new RowStateManager());
    const [rowStates, setRowStates] = useState<Map<RowKey, RowState>>(new Map());
    const visibleRowsRef = useRef<Set<RowKey>>(new Set());

    // Extract stepSize from style
    const stepSize = useMemo(() => style ? getSomeorUndefined(style.stepSize) ?? 1 : 1, [style]);

    // Extract readOnly from style (disables all event interactions)
    const readOnly = useMemo(() => style ? getSomeorUndefined(style.readOnly) ?? false : false, [style]);

    // Extract eventPopover function (returns UI component for popover content)
    const eventPopoverFn = useMemo(() => getSomeorUndefined(value.eventPopover), [value.eventPopover]);

    // Extract eventPopoverTrigger from style (click or hover)
    const eventPopoverTrigger = useMemo(
        () => style ? getSomeorUndefined(style.eventPopoverTrigger)?.type ?? "click" : "click",
        [style]
    ) as "click" | "hover";

    // Calculate slot range from events
    const slotRange = useMemo(() => {
        let minSlot: number | null = null;
        let maxSlot: number | null = null;

        value.rows.forEach((row) => {
            row.events.forEach((event) => {
                const start = event.start;
                const end = getSomeorUndefined(event.end) ?? start;
                if (minSlot === null || start < minSlot) minSlot = start;
                if (maxSlot === null || end > maxSlot) maxSlot = end;
            });
        });

        // Apply style overrides
        const styleMinSlot = style ? getSomeorUndefined(style.minSlot) : undefined;
        const styleMaxSlot = style ? getSomeorUndefined(style.maxSlot) : undefined;

        if (styleMinSlot !== undefined) {
            minSlot = minSlot === null ? styleMinSlot : (styleMinSlot < minSlot ? styleMinSlot : minSlot);
        }
        if (styleMaxSlot !== undefined) {
            maxSlot = maxSlot === null ? styleMaxSlot : (styleMaxSlot > maxSlot ? styleMaxSlot : maxSlot);
        }

        // Fallback to 0-10 if no events
        if (minSlot === null) minSlot = 0;
        if (maxSlot === null) maxSlot = 10;

        return {
            start: minSlot,
            end: maxSlot,
        };
    }, [value.rows, style]);

    // Generate slot positions
    const slots = useMemo(() => {
        const result: number[] = [];
        const count = Math.floor(slotRange.end - slotRange.start) + 1;
        for (let i = 0; i < count; i++) {
            result.push(slotRange.start + i);
        }
        return result;
    }, [slotRange]);

    const slotGridWidth = useMemo(() => slots.length * slotMinWidth, [slots, slotMinWidth]);

    // Get slot label function
    const slotLabelFn = useMemo(() => style ? getSomeorUndefined(style.slotLabel) : undefined, [style]);

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
    const columnHelper = createColumnHelper<PlannerRowValue>();

    // Create TanStack Table columns from East UI columns
    const columns = useMemo<ColumnDef<PlannerRowValue, PlannerCellValue | undefined>[]>(() => {
        return value.columns.map((col) => {
            const print = printFor(col.valueType);
            const compare = compareFor(col.valueType);

            // Extract width values from column config
            const width = getSomeorUndefined(col.width);
            const minWidth = getSomeorUndefined(col.minWidth);
            const maxWidth = getSomeorUndefined(col.maxWidth);
            const renderFn = getSomeorUndefined(col.render) as ColumnRenderFn | undefined;

            return columnHelper.accessor(
                (row) => row.cells.get(col.key),
                {
                    id: col.key,
                    header: getSomeorUndefined(col.header) ?? col.key,
                    enableSorting: true,
                    sortingFn: (rowA, rowB, columnId) => {
                        const cellA = rowA.original.cells.get(columnId);
                        const cellB = rowB.original.cells.get(columnId);
                        const valA = cellA?.value?.value;
                        const valB = cellB?.value?.value;
                        if (valA === undefined || valB === undefined) return 0;
                        return compare(valA, valB);
                    },
                    minSize: parseSize(minWidth, 80),
                    size: parseSize(width, 150),
                    maxSize: parseSize(maxWidth, 400),
                    meta: {
                        print: print as (value: unknown) => string,
                        columnKey: col.key,
                        width,
                        minWidth,
                        maxWidth,
                        renderFn,
                    },
                }
            );
        });
    }, [value.columns, columnHelper]);

    // Consolidated persisted state (sorting + column sizing + splitter)
    const { state: persistedState, setState: setPersistedState } = usePersistedState<PlannerPersistedState>(
        storageKey,
        { sorting: [], columnSizing: {}, pinnedColumns: [...value.frozen], tablePanelSize: null },
    );
    const sorting = useMemo(() => persistedState.sorting, [persistedState.sorting]);

    // Column pinning
    const { columnPinning, hasFrozen, toggleColumnPin } = useColumnPinning({
        frozenFromValue: value.frozen,
        persistedPinnedColumns: persistedState.pinnedColumns,
        setPersistedPinnedColumns: (updater) => setPersistedState(prev => ({
            ...prev,
            pinnedColumns: updater(prev.pinnedColumns ?? [...value.frozen]),
        })),
    });
    const getSortIndex = createGetSortIndex(sorting);
    const setSorting = useCallback((updater: SortingState | ((prev: SortingState) => SortingState)) => {
        setPersistedState(prev => ({
            ...prev,
            sorting: typeof updater === 'function' ? updater(prev.sorting) : updater,
        }));
    }, [setPersistedState]);

    // Column sizing (derived from persisted state)
    const columnSizing = useMemo(() => persistedState.columnSizing, [persistedState.columnSizing]);
    const setColumnSizing = useCallback((updater: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => {
        setPersistedState(prev => ({
            ...prev,
            columnSizing: typeof updater === 'function' ? updater(prev.columnSizing) : updater,
        }));
    }, [setPersistedState]);

    // Persist splitter resize
    // Splitter drag state: tracks live size during drag, persists on end
    const [dragSize, setDragSize] = useState<number | null>(null);
    const handleSplitterResize = useCallback((details: { size: number[] }) => {
        if (details.size[0] !== undefined) {
            setDragSize(details.size[0]!);
        }
    }, []);
    const handleSplitterResizeEnd = useCallback((details: { size: number[] }) => {
        if (details.size[0] !== undefined) {
            setPersistedState(prev => ({ ...prev, tablePanelSize: details.size[0]! }));
        }
        setDragSize(null);
    }, [setPersistedState]);

    // TanStack Table instance
    const table = useReactTable({
        data: value.rows,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableSorting: true,
        enableMultiSort,
        maxMultiSortColCount: maxSortColumns,
        isMultiSortEvent: () => enableMultiSort,
        state: { sorting, columnSizing, columnPinning },
        onSortingChange: setSorting,
        onColumnSizingChange: setColumnSizing,
        columnResizeMode: "onChange" as ColumnResizeMode,
        enableColumnResizing,
        enableColumnPinning: true,
    });

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

    // Compute table panel % from actual column widths and container width
    const columnTotalWidth = table.getCenterTotalSize();
    const computedTablePanelSize = useMemo(() => {
        if (tablePanelSizeProp != null) return tablePanelSizeProp;
        if (containerWidth <= 0) return 50; // fallback before measurement
        return Math.min(Math.max((columnTotalWidth / containerWidth) * 100, 15), 75);
    }, [tablePanelSizeProp, columnTotalWidth, containerWidth]);

    // Effective: dragging > persisted (user-dragged) > computed from column widths
    const effectiveTablePanelSize = dragSize ?? persistedState.tablePanelSize ?? computedTablePanelSize;

    // Last unpinned column stretches to fill remaining panel space
    const lastUnpinnedColumnId = useMemo(() => {
        const headers = table.getFlatHeaders();
        for (let i = headers.length - 1; i >= 0; i--) {
            if (!headers[i]!.column.getIsPinned()) return headers[i]!.id;
        }
        return null;
    }, [table]);

    // Handle sort change callback
    useEffect(() => {
        if (onSortChange && sorting.length > 0) {
            const sorts: ColumnSort[] = sorting.map((s) => ({
                columnKey: s.id,
                direction: s.desc ? "desc" : "asc",
            }));
            onSortChange(sorts);
        }

        // Call East-side callback - called once per sort column like Gantt
        if (onSortChangeFn) {
            sorting.forEach((s, index) => {
                queueMicrotask(() => onSortChangeFn({
                    columnKey: s.id,
                    sortIndex: BigInt(index),
                    sortDirection: s.desc ? variant('desc', null) : variant('asc', null),
                }));
            });
        }
    }, [sorting, onSortChange, onSortChangeFn]);

    // Virtualization setup
    const parentRef = useRef<HTMLDivElement>(null);
    const sortedRows = table.getRowModel().rows;

    const virtualizer = useVirtualizer({
        count: sortedRows.length,
        getScrollElement: () => parentRef.current,
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

    // Synchronized scrolling between table and slot grid
    const handleTableScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        if (slotContainerRef.current) {
            slotContainerRef.current.scrollTop = scrollTop;
        }
    }, []);

    const handleSlotScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        if (parentRef.current) {
            parentRef.current.scrollTop = scrollTop;
        }
    }, []);

    // Handle cell click
    const handleCellClick = useCallback(
        (rowIndex: number, columnKey: string, cellValue: PlannerCellValue | undefined) => {
            if (onCellClickFn && cellValue?.value !== undefined) {
                queueMicrotask(() => onCellClickFn({
                    rowIndex: BigInt(rowIndex),
                    columnKey,
                    cellValue: cellValue.value,
                }));
            }
        },
        [onCellClickFn]
    );

    // Handle cell double click
    const handleCellDoubleClick = useCallback(
        (rowIndex: number, columnKey: string, cellValue: PlannerCellValue | undefined) => {
            if (onCellDoubleClickFn && cellValue?.value !== undefined) {
                queueMicrotask(() => onCellDoubleClickFn({
                    rowIndex: BigInt(rowIndex),
                    columnKey,
                    cellValue: cellValue.value,
                }));
            }
        },
        [onCellDoubleClickFn]
    );

    // Handle row click
    const handleRowClick = useCallback(
        (rowIndex: number) => {
            if (onRowClickFn) {
                queueMicrotask(() => onRowClickFn({ rowIndex: BigInt(rowIndex) }));
            }
        },
        [onRowClickFn]
    );

    // Handle row double click
    const handleRowDoubleClick = useCallback(
        (rowIndex: number) => {
            if (onRowDoubleClickFn) {
                queueMicrotask(() => onRowDoubleClickFn({ rowIndex: BigInt(rowIndex) }));
            }
        },
        [onRowDoubleClickFn]
    );

    // Handle event click
    const handleEventClick = useCallback(
        (event: PlannerEventValue, rowIndex: number, eventIndex: number) => {
            if (onEventClick) {
                onEventClick(event, rowIndex, eventIndex);
            }
            if (onEventClickFn) {
                const endSlot = getSomeorUndefined(event.end) ?? event.start;
                queueMicrotask(() => onEventClickFn({
                    rowIndex: BigInt(rowIndex),
                    eventIndex: BigInt(eventIndex),
                    start: event.start,
                    end: endSlot,
                }));
            }
        },
        [onEventClick, onEventClickFn]
    );

    // Get slot label
    const getSlotLabel = useCallback(
        (slot: number): string => {
            if (slotLabelFn) {
                try {
                    return slotLabelFn(slot);
                } catch {
                    return String(slot);
                }
            }
            return String(slot);
        },
        [slotLabelFn]
    );


    // Handle event drag
    const handleEventDrag = useCallback(
        (rowIndex: number, eventIndex: number, previousStart: number, previousEnd: number, newStart: number, newEnd: number) => {
            if (onEventDragFn) {
                queueMicrotask(() => onEventDragFn({
                    rowIndex: BigInt(rowIndex),
                    eventIndex: BigInt(eventIndex),
                    previousStart,
                    previousEnd,
                    newStart,
                    newEnd,
                }));
            }
        },
        [onEventDragFn]
    );

    // Handle event resize
    const handleEventResize = useCallback(
        (rowIndex: number, eventIndex: number, previousStart: number, previousEnd: number, newStart: number, newEnd: number, edge: "start" | "end") => {
            if (onEventResizeFn) {
                queueMicrotask(() => onEventResizeFn({
                    rowIndex: BigInt(rowIndex),
                    eventIndex: BigInt(eventIndex),
                    previousStart,
                    previousEnd,
                    newStart,
                    newEnd,
                    edge: variant(edge, null),
                }));
            }
        },
        [onEventResizeFn]
    );

    // Handle event add (click on empty slot)
    const handleEventAdd = useCallback(
        (rowIndex: number, slot: number) => {
            if (onEventAddFn) {
                queueMicrotask(() => onEventAddFn({
                    rowIndex: BigInt(rowIndex),
                    slot,
                }));
            }
        },
        [onEventAddFn]
    );

    // Handle event double click
    const handleEventDoubleClick = useCallback(
        (event: PlannerEventValue, rowIndex: number, eventIndex: number) => {
            if (onEventDoubleClickFn) {
                const endSlot = getSomeorUndefined(event.end) ?? event.start;
                queueMicrotask(() => onEventDoubleClickFn({
                    rowIndex: BigInt(rowIndex),
                    eventIndex: BigInt(eventIndex),
                    start: event.start,
                    end: endSlot,
                }));
            }
        },
        [onEventDoubleClickFn]
    );

    // Handle event edit (context menu)
    const handleEventEdit = useCallback(
        (event: PlannerEventValue, rowIndex: number, eventIndex: number) => {
            if (onEventEditFn) {
                const endSlot = getSomeorUndefined(event.end) ?? event.start;
                queueMicrotask(() => onEventEditFn({
                    rowIndex: BigInt(rowIndex),
                    eventIndex: BigInt(eventIndex),
                    start: event.start,
                    end: endSlot,
                }));
            }
        },
        [onEventEditFn]
    );

    // Handle event delete
    const handleEventDelete = useCallback(
        (event: PlannerEventValue, rowIndex: number, eventIndex: number) => {
            if (onEventDeleteFn) {
                const endSlot = getSomeorUndefined(event.end) ?? event.start;
                queueMicrotask(() => onEventDeleteFn({
                    rowIndex: BigInt(rowIndex),
                    eventIndex: BigInt(eventIndex),
                    start: event.start,
                    end: endSlot,
                }));
            }
        },
        [onEventDeleteFn]
    );

    // Panel configuration for Splitter
    const panels = useMemo(() => [
        { id: "table", minSize: 20 },
        { id: "slots", minSize: 20 },
    ], []);

    // Render slot grid lines and boundaries
    const renderSlotGridLines = () => (
        <svg
            width={slotGridWidth}
            height={virtualizer.getTotalSize()}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 1,
            }}
        >
            {/* Slot grid lines */}
            {slots.map((slot, index) => {
                const x = (index + 1) * slotMinWidth;
                return (
                    <line
                        key={String(slot)}
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={virtualizer.getTotalSize()}
                        stroke={slotLineStroke ?? gridLineColor}
                        strokeWidth={slotLineWidth ?? 1}
                        strokeDasharray={slotLineDash ?? "4 4"}
                        opacity={slotLineOpacity ?? 0.6}
                    />
                );
            })}
            {/* Boundary lines */}
            {boundaries?.map((boundary, index) => {
                // Calculate x position from slot value
                const slotOffset = boundary.x - slotRange.start;
                const x = (slotOffset + 1) * slotMinWidth; // Center in slot
                const stroke = getSomeorUndefined(boundary.stroke) ?? "red";
                const strokeWidth = getSomeorUndefined(boundary.strokeWidth) ?? 2;
                const strokeDash = getSomeorUndefined(boundary.strokeDash);
                const strokeOpacity = getSomeorUndefined(boundary.strokeOpacity) ?? 1;

                return (
                    <line
                        key={`boundary-${index}`}
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={virtualizer.getTotalSize()}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDash}
                        opacity={strokeOpacity}
                    />
                );
            })}
        </svg>
    );

    return (
        <Box
            ref={rootRef}
            width="100%"
            height={styleHeight ?? height}
            overflow="hidden"
            borderWidth="1px"
            borderColor="border.subtle"
            borderRadius="md"
        >
            <Splitter.Root
                size={[effectiveTablePanelSize, 100 - effectiveTablePanelSize]}
                panels={panels}
                width="100%"
                height="100%"
                onResize={handleSplitterResize}
                onResizeEnd={handleSplitterResizeEnd}
            >
                {/* Table Panel */}
                <Splitter.Panel id="table">
                    <Box
                        ref={parentRef}
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
                                            return (
                                                <ChakraTable.ColumnHeader
                                                    key={header.id}
                                                    _hover={{ bg: "bg.muted" }}
                                                    transition="background 0.2s"
                                                    style={getHeaderCellStyle(header, hasFrozen, columnSizing, header.id === lastUnpinnedColumnId)}
                                                >
                                                    <HeaderControls
                                                        header={header}
                                                        toggleColumnPin={toggleColumnPin}
                                                        getSortIndex={getSortIndex}
                                                        enableMultiSort={enableMultiSort}
                                                        enableColumnResizing={enableColumnResizing}
                                                    />
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
                                    const row = sortedRows[virtualRow.index];
                                    if (!row) return null;

                                    const rowKey = virtualRow.index;
                                    const rowState = rowStates.get(rowKey) || { status: "unloaded" };
                                    const isRowLoading =
                                        !rowStateManager.isRowLoaded(rowKey) ||
                                        rowState.status === "loading";

                                    const rowIndex = BigInt(virtualRow.index);

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
                                                cursor: (onRowClickFn || onRowDoubleClickFn) ? 'pointer' : undefined,
                                            }}
                                            onClick={onRowClickFn ? () => handleRowClick(Number(rowIndex)) : undefined}
                                            onDoubleClick={onRowDoubleClickFn ? () => handleRowDoubleClick(Number(rowIndex)) : undefined}
                                        >
                                            {row.getVisibleCells().map((cell) => {
                                                const cellValue = cell.getValue() as PlannerCellValue | undefined;
                                                const meta = cell.column.columnDef.meta;
                                                const columnKey = meta?.columnKey ?? cell.column.id;

                                                const cellStyle = getCellStyle(cell, hasFrozen, columnSizing, cell.column.id === lastUnpinnedColumnId);

                                                const cellClickHandler = onCellClickFn ? (e: React.MouseEvent) => {
                                                    e.stopPropagation();
                                                    handleCellClick(Number(rowIndex), columnKey, cellValue);
                                                } : undefined;

                                                const cellDoubleClickHandler = onCellDoubleClickFn ? (e: React.MouseEvent) => {
                                                    e.stopPropagation();
                                                    handleCellDoubleClick(Number(rowIndex), columnKey, cellValue);
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

                                                if (meta?.renderFn) {
                                                    const rendered = meta.renderFn({
                                                        rowIndex,
                                                        columnKey,
                                                        cellValue: cellValue.value,
                                                    });
                                                    return (
                                                        <ChakraTable.Cell
                                                            key={cell.id}
                                                            style={cellStyle}
                                                            onClick={cellClickHandler}
                                                            onDoubleClick={cellDoubleClickHandler}
                                                        >
                                                            <EastChakraComponent value={rendered} storageKey={`${storageKey}.render.${cell.column.id}`} />
                                                        </ChakraTable.Cell>
                                                    );
                                                }

                                                const cellContent = getSomeorUndefined(cellValue.content);
                                                if (cellContent != null) {
                                                    return (
                                                        <ChakraTable.Cell
                                                            key={cell.id}
                                                            style={cellStyle}
                                                            onClick={cellClickHandler}
                                                            onDoubleClick={cellDoubleClickHandler}
                                                        >
                                                            <EastChakraComponent value={cellContent} storageKey={`${storageKey}.cell.${cell.column.id}`} />
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

                <Splitter.ResizeTrigger id="table:slots" />

                {/* Slot Grid Panel */}
                <Splitter.Panel id="slots">
                    <Box
                        ref={slotContainerRef}
                        width="100%"
                        height="100%"
                        overflowY="auto"
                        overflowX="auto"
                        position="relative"
                        onScroll={handleSlotScroll}
                    >
                        {/* Slot Header - matches table header styling */}
                        <Box position="sticky" top={0} zIndex={1} bg="bg.panel" minWidth={slotGridWidth}>
                            <PlannerAxis
                                startSlot={slotRange.start}
                                endSlot={slotRange.end}
                                height={headerHeight}
                                slotWidth={slotMinWidth}
                                getSlotLabel={getSlotLabel}
                            />
                        </Box>

                        {/* Slot Grid Body - uses same table structure for matching row styles */}
                        <Box position="relative" minWidth={slotGridWidth} bg="bg.panel">
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
                                        const row = sortedRows[virtualRow.index];
                                        if (!row) return null;

                                        const rowIndex = virtualRow.index;

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
                                                    <svg width={"100%"} height={virtualRow.size}>
                                                        <PlannerEventRow
                                                            events={row.original.events}
                                                            storageKey={`${storageKey}.event`}
                                                            rowIndex={rowIndex}
                                                            y={0}
                                                            width={slotGridWidth}
                                                            height={virtualRow.size}
                                                            slotWidth={slotMinWidth}
                                                            slotRangeStart={slotRange.start}
                                                            slotMode={slotMode}
                                                            slotCount={slots.length}
                                                            minSlot={slotRange.start}
                                                            maxSlot={slotRange.end}
                                                            stepSize={stepSize}
                                                            readOnly={readOnly}
                                                            eventPopoverFn={eventPopoverFn}
                                                            eventPopoverTrigger={eventPopoverTrigger}
                                                            onEventClick={handleEventClick}
                                                            onEventDoubleClick={handleEventDoubleClick}
                                                            onEventDrag={handleEventDrag}
                                                            onEventResize={handleEventResize}
                                                            onEventEdit={onEventEditFn ? handleEventEdit : undefined}
                                                            onEventDelete={onEventDeleteFn ? handleEventDelete : undefined}
                                                            onSlotClick={(slot) => handleEventAdd(rowIndex, slot)}
                                                        />
                                                    </svg>
                                                </ChakraTable.Cell>
                                            </ChakraTable.Row>
                                        );
                                    })}
                                </ChakraTable.Body>
                            </ChakraTable.Root>

                            {/* Slot grid lines - rendered on top */}
                            {renderSlotGridLines()}
                        </Box>
                    </Box>
                </Splitter.Panel>
            </Splitter.Root>
        </Box>
    );
}, (prev, next) => plannerRootEqual(prev.value, next.value));
