/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { compareFor, type EastType } from "@elaraai/east";
/** Sort direction */
export type SortDirection = 'asc' | 'desc';

/** Sort state for a single column */
export interface ColumnSort {
    columnKey: string;
    direction: SortDirection;
}

/** Callback when sort state changes */
export type SortChangeCallback = (sorts: ColumnSort[]) => void;

/**
 * Manages column sorting state for tables.
 * Supports single and multi-column sorting with asc/desc/remove cycling.
 */
export class RowSortManager<TRow> {
    private sorts: ColumnSort[] = [];
    private listeners: Set<SortChangeCallback> = new Set();
    private enableMultiSort: boolean;
    private maxSortColumns: number;
    private compareCache: Map<string, (a: unknown, b: unknown) => number> = new Map();

    constructor(options: {
        enableMultiSort?: boolean;
        maxSortColumns?: number;
        initialSorts?: ColumnSort[];
    } = {}) {
        this.enableMultiSort = options.enableMultiSort ?? true;
        this.maxSortColumns = options.maxSortColumns ?? 5;
        this.sorts = options.initialSorts ?? [];
    }

    /** Subscribe to sort state changes */
    subscribe(listener: SortChangeCallback): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener([...this.sorts]));
    }

    /** Get current sort state */
    getSorts(): ColumnSort[] {
        return [...this.sorts];
    }

    /** Get sort state for a specific column */
    getColumnSort(columnKey: string): ColumnSort | undefined {
        return this.sorts.find(s => s.columnKey === columnKey);
    }

    /** Get sort index (1-based) for a column, or undefined if not sorted */
    getSortIndex(columnKey: string): number | undefined {
        const index = this.sorts.findIndex(s => s.columnKey === columnKey);
        return index >= 0 ? index + 1 : undefined;
    }

    /** Check if a column is currently sorted */
    isSorted(columnKey: string): boolean {
        return this.sorts.some(s => s.columnKey === columnKey);
    }

    /** Get sort direction for a column */
    getSortDirection(columnKey: string): SortDirection | null {
        return this.getColumnSort(columnKey)?.direction ?? null;
    }

    /**
     * Toggle sort for a column.
     * Cycles: unsorted → asc → desc → unsorted
     */
    toggleSort(columnKey: string): void {
        const existingIndex = this.sorts.findIndex(s => s.columnKey === columnKey);

        if (existingIndex >= 0) {
            const existing = this.sorts[existingIndex]!;
            if (existing.direction === 'asc') {
                // asc → desc
                this.sorts[existingIndex] = { ...existing, direction: 'desc' };
            } else {
                // desc → remove
                this.sorts.splice(existingIndex, 1);
            }
        } else {
            // Add new sort
            const newSort: ColumnSort = { columnKey, direction: 'asc' };
            if (this.enableMultiSort) {
                if (this.sorts.length < this.maxSortColumns) {
                    this.sorts.push(newSort);
                }
            } else {
                this.sorts = [newSort];
            }
        }

        this.notifyListeners();
    }

    /** Set sort for a column explicitly */
    setSort(columnKey: string, direction: SortDirection | null): void {
        const existingIndex = this.sorts.findIndex(s => s.columnKey === columnKey);

        if (direction === null) {
            // Remove sort
            if (existingIndex >= 0) {
                this.sorts.splice(existingIndex, 1);
            }
        } else if (existingIndex >= 0) {
            // Update existing
            this.sorts[existingIndex] = { columnKey, direction };
        } else {
            // Add new
            if (this.enableMultiSort) {
                if (this.sorts.length < this.maxSortColumns) {
                    this.sorts.push({ columnKey, direction });
                }
            } else {
                this.sorts = [{ columnKey, direction }];
            }
        }

        this.notifyListeners();
    }

    /** Clear all sorts */
    clear(): void {
        this.sorts = [];
        this.notifyListeners();
    }

    /** Replace all sorts */
    setSorts(sorts: ColumnSort[]): void {
        this.sorts = [...sorts];
        this.notifyListeners();
    }

    /**
     * Register a compare function for a column.
     * Uses East's compareFor for type-aware comparison.
     */
    registerCompare<T extends EastType>(columnKey: string, type: T): void {
        this.compareCache.set(columnKey, compareFor(type) as (a: unknown, b: unknown) => number);
    }

    /**
     * Sort rows based on provided or current sort state.
     * @param rows - Array of rows to sort
     * @param getCellValue - Function to get cell value for a column key
     * @param sorts - Optional sort state (uses internal state if not provided)
     * @returns Sorted array (new array, original unchanged)
     */
    sortRows(
        rows: TRow[],
        getCellValue: (row: TRow, columnKey: string) => unknown,
        sorts?: ColumnSort[]
    ): TRow[] {
        const activeSorts = sorts ?? this.sorts;
        if (activeSorts.length === 0) {
            return rows;
        }

        const sorted = [...rows];
        sorted.sort((a, b) => {
            for (const sort of activeSorts) {
                const aVal = getCellValue(a, sort.columnKey);
                const bVal = getCellValue(b, sort.columnKey);

                // Handle null/undefined
                if (aVal === undefined && bVal === undefined) continue;
                if (aVal === undefined) return sort.direction === 'asc' ? 1 : -1;
                if (bVal === undefined) return sort.direction === 'asc' ? -1 : 1;

                // Use registered compare function (must be registered)
                const compareFn = this.compareCache.get(sort.columnKey);
                if (!compareFn) {
                    throw new Error(`No compare function registered for column "${sort.columnKey}". Call registerCompare() first.`);
                }

                const cmp = compareFn(aVal, bVal);
                if (cmp !== 0) {
                    return sort.direction === 'asc' ? cmp : -cmp;
                }
            }
            return 0;
        });

        return sorted;
    }
}

