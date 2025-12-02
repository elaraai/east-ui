/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IntegerType, StringType } from '@elaraai/east';
import { RowSortManager, type ColumnSort } from './RowSortManager';

interface TestRow {
    id: number;
    name: string;
    age: number;
}

describe('RowSortManager', () => {
    let manager: RowSortManager<TestRow>;

    beforeEach(() => {
        manager = new RowSortManager<TestRow>();
    });

    describe('constructor', () => {
        it('creates with default options', () => {
            expect(manager.getSorts()).toEqual([]);
        });

        it('creates with initial sorts', () => {
            const initialSorts: ColumnSort[] = [
                { columnKey: 'name', direction: 'asc' }
            ];
            const managerWithSorts = new RowSortManager<TestRow>({ initialSorts });
            expect(managerWithSorts.getSorts()).toEqual(initialSorts);
        });
    });

    describe('getSorts', () => {
        it('returns empty array initially', () => {
            expect(manager.getSorts()).toEqual([]);
        });

        it('returns copy of sorts array', () => {
            manager.toggleSort('name');
            const sorts = manager.getSorts();
            sorts.push({ columnKey: 'age', direction: 'asc' });
            expect(manager.getSorts()).toHaveLength(1);
        });
    });

    describe('getColumnSort', () => {
        it('returns undefined for unsorted column', () => {
            expect(manager.getColumnSort('name')).toBeUndefined();
        });

        it('returns sort state for sorted column', () => {
            manager.toggleSort('name');
            expect(manager.getColumnSort('name')).toEqual({
                columnKey: 'name',
                direction: 'asc'
            });
        });
    });

    describe('getSortIndex', () => {
        it('returns undefined for unsorted column', () => {
            expect(manager.getSortIndex('name')).toBeUndefined();
        });

        it('returns 1-based index for sorted columns', () => {
            manager.toggleSort('name');
            manager.toggleSort('age');
            expect(manager.getSortIndex('name')).toBe(1);
            expect(manager.getSortIndex('age')).toBe(2);
        });
    });

    describe('isSorted', () => {
        it('returns false for unsorted column', () => {
            expect(manager.isSorted('name')).toBe(false);
        });

        it('returns true for sorted column', () => {
            manager.toggleSort('name');
            expect(manager.isSorted('name')).toBe(true);
        });
    });

    describe('getSortDirection', () => {
        it('returns null for unsorted column', () => {
            expect(manager.getSortDirection('name')).toBeNull();
        });

        it('returns direction for sorted column', () => {
            manager.toggleSort('name');
            expect(manager.getSortDirection('name')).toBe('asc');

            manager.toggleSort('name');
            expect(manager.getSortDirection('name')).toBe('desc');
        });
    });

    describe('toggleSort', () => {
        it('adds asc sort for unsorted column', () => {
            manager.toggleSort('name');
            expect(manager.getColumnSort('name')).toEqual({
                columnKey: 'name',
                direction: 'asc'
            });
        });

        it('changes asc to desc', () => {
            manager.toggleSort('name');
            manager.toggleSort('name');
            expect(manager.getSortDirection('name')).toBe('desc');
        });

        it('removes sort after desc', () => {
            manager.toggleSort('name');
            manager.toggleSort('name');
            manager.toggleSort('name');
            expect(manager.isSorted('name')).toBe(false);
        });

        it('notifies listeners', () => {
            const listener = vi.fn();
            manager.subscribe(listener);
            manager.toggleSort('name');
            expect(listener).toHaveBeenCalledWith([
                { columnKey: 'name', direction: 'asc' }
            ]);
        });
    });

    describe('multi-sort', () => {
        it('allows multiple sort columns when enabled', () => {
            manager.toggleSort('name');
            manager.toggleSort('age');
            expect(manager.getSorts()).toHaveLength(2);
        });

        it('replaces sort when multi-sort disabled', () => {
            const singleSort = new RowSortManager<TestRow>({ enableMultiSort: false });
            singleSort.toggleSort('name');
            singleSort.toggleSort('age');
            expect(singleSort.getSorts()).toHaveLength(1);
            expect(singleSort.isSorted('age')).toBe(true);
            expect(singleSort.isSorted('name')).toBe(false);
        });

        it('respects maxSortColumns', () => {
            const limitedManager = new RowSortManager<TestRow>({ maxSortColumns: 2 });
            limitedManager.toggleSort('name');
            limitedManager.toggleSort('age');
            limitedManager.toggleSort('id');
            expect(limitedManager.getSorts()).toHaveLength(2);
            expect(limitedManager.isSorted('id')).toBe(false);
        });
    });

    describe('setSort', () => {
        it('sets sort for new column', () => {
            manager.setSort('name', 'desc');
            expect(manager.getColumnSort('name')).toEqual({
                columnKey: 'name',
                direction: 'desc'
            });
        });

        it('updates existing sort', () => {
            manager.toggleSort('name');
            manager.setSort('name', 'desc');
            expect(manager.getSortDirection('name')).toBe('desc');
        });

        it('removes sort when direction is null', () => {
            manager.toggleSort('name');
            manager.setSort('name', null);
            expect(manager.isSorted('name')).toBe(false);
        });
    });

    describe('clear', () => {
        it('removes all sorts', () => {
            manager.toggleSort('name');
            manager.toggleSort('age');
            manager.clear();
            expect(manager.getSorts()).toEqual([]);
        });

        it('notifies listeners', () => {
            manager.toggleSort('name');
            const listener = vi.fn();
            manager.subscribe(listener);
            manager.clear();
            expect(listener).toHaveBeenCalledWith([]);
        });
    });

    describe('setSorts', () => {
        it('replaces all sorts', () => {
            manager.toggleSort('name');
            const newSorts: ColumnSort[] = [
                { columnKey: 'age', direction: 'desc' }
            ];
            manager.setSorts(newSorts);
            expect(manager.getSorts()).toEqual(newSorts);
            expect(manager.isSorted('name')).toBe(false);
        });
    });

    describe('subscribe', () => {
        it('returns unsubscribe function', () => {
            const listener = vi.fn();
            const unsubscribe = manager.subscribe(listener);

            manager.toggleSort('name');
            expect(listener).toHaveBeenCalledTimes(1);

            unsubscribe();
            manager.toggleSort('age');
            expect(listener).toHaveBeenCalledTimes(1);
        });
    });

    describe('registerCompare', () => {
        it('registers compare function for column', () => {
            manager.registerCompare('age', IntegerType);
            // No error means success - compare function will be used in sortRows
        });
    });

    describe('sortRows', () => {
        const rows: TestRow[] = [
            { id: 1, name: 'Charlie', age: 30 },
            { id: 2, name: 'Alice', age: 25 },
            { id: 3, name: 'Bob', age: 35 },
        ];

        it('returns original order when no sorts', () => {
            manager.registerCompare('name', StringType);
            const sorted = manager.sortRows(rows, (row, key) => row[key as keyof TestRow]);
            expect(sorted.map(r => r.name)).toEqual(['Charlie', 'Alice', 'Bob']);
        });

        it('sorts ascending', () => {
            manager.registerCompare('name', StringType);
            manager.toggleSort('name');
            const sorted = manager.sortRows(rows, (row, key) => row[key as keyof TestRow]);
            expect(sorted.map(r => r.name)).toEqual(['Alice', 'Bob', 'Charlie']);
        });

        it('sorts descending', () => {
            manager.registerCompare('name', StringType);
            manager.setSort('name', 'desc');
            const sorted = manager.sortRows(rows, (row, key) => row[key as keyof TestRow]);
            expect(sorted.map(r => r.name)).toEqual(['Charlie', 'Bob', 'Alice']);
        });

        it('handles multi-column sort', () => {
            const rowsWithDupes: TestRow[] = [
                { id: 1, name: 'Alice', age: 30 },
                { id: 2, name: 'Bob', age: 25 },
                { id: 3, name: 'Alice', age: 25 },
            ];

            manager.registerCompare('name', StringType);
            manager.registerCompare('age', IntegerType);
            manager.toggleSort('name');
            manager.toggleSort('age');

            const sorted = manager.sortRows(rowsWithDupes, (row, key) => row[key as keyof TestRow]);
            expect(sorted.map(r => r.id)).toEqual([3, 1, 2]); // Alice 25, Alice 30, Bob 25
        });

        it('handles undefined values', () => {
            const rowsWithUndefined = [
                { id: 1, name: 'Alice', age: 30 },
                { id: 2, name: undefined as unknown as string, age: 25 },
                { id: 3, name: 'Bob', age: 35 },
            ];

            manager.registerCompare('name', StringType);
            manager.toggleSort('name');

            const sorted = manager.sortRows(
                rowsWithUndefined,
                (row, key) => row[key as keyof typeof rowsWithUndefined[0]]
            );
            // undefined values should sort to end in asc order
            expect(sorted[2]!.id).toBe(2);
        });

        it('throws error when compare function not registered', () => {
            manager.toggleSort('name');
            expect(() => {
                manager.sortRows(rows, (row, key) => row[key as keyof TestRow]);
            }).toThrow('No compare function registered for column "name"');
        });

        it('does not mutate original array', () => {
            manager.registerCompare('name', StringType);
            manager.toggleSort('name');
            const original = [...rows];
            manager.sortRows(rows, (row, key) => row[key as keyof TestRow]);
            expect(rows).toEqual(original);
        });
    });
});
