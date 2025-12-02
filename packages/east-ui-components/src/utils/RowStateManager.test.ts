/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RowStateManager } from './RowStateManager';

describe('RowStateManager', () => {
    let manager: RowStateManager;

    beforeEach(() => {
        vi.useFakeTimers();
        manager = new RowStateManager();
    });

    afterEach(() => {
        manager.clear();
        vi.useRealTimers();
    });

    describe('getRowState', () => {
        it('returns unloaded for unknown rows', () => {
            expect(manager.getRowState('unknown')).toEqual({ status: 'unloaded' });
        });

        it('returns correct state for known rows', () => {
            manager.markRowsLoading(['row1']);
            expect(manager.getRowState('row1').status).toBe('loading');
        });
    });

    describe('isRowLoaded', () => {
        it('returns false for unloaded rows', () => {
            expect(manager.isRowLoaded('row1')).toBe(false);
        });

        it('returns false for loading rows', () => {
            manager.markRowsLoading(['row1']);
            expect(manager.isRowLoaded('row1')).toBe(false);
        });

        it('returns true for loaded rows', () => {
            manager.markRowsLoaded(['row1']);
            expect(manager.isRowLoaded('row1')).toBe(true);
        });
    });

    describe('markRowsLoading', () => {
        it('sets status to loading', () => {
            manager.markRowsLoading(['row1', 'row2']);
            expect(manager.getRowState('row1').status).toBe('loading');
            expect(manager.getRowState('row2').status).toBe('loading');
        });

        it('sets loadStartTime', () => {
            const now = Date.now();
            manager.markRowsLoading(['row1']);
            expect(manager.getRowState('row1').loadStartTime).toBe(now);
        });

        it('notifies listeners', () => {
            const listener = vi.fn();
            manager.subscribe(listener);
            manager.markRowsLoading(['row1']);
            expect(listener).toHaveBeenCalledTimes(1);
        });
    });

    describe('markRowsLoaded', () => {
        it('sets status to loaded', () => {
            manager.markRowsLoaded(['row1', 'row2']);
            expect(manager.getRowState('row1').status).toBe('loaded');
            expect(manager.getRowState('row2').status).toBe('loaded');
        });

        it('adds to loaded cache', () => {
            manager.markRowsLoaded(['row1']);
            expect(manager.isRowLoaded('row1')).toBe(true);
        });

        it('notifies listeners', () => {
            const listener = vi.fn();
            manager.subscribe(listener);
            manager.markRowsLoaded(['row1']);
            expect(listener).toHaveBeenCalledTimes(1);
        });
    });

    describe('markRowsError', () => {
        it('sets status to error with error object', () => {
            const error = new Error('Test error');
            manager.markRowsError(['row1'], error);
            const state = manager.getRowState('row1');
            expect(state.status).toBe('error');
            expect(state.error).toBe(error);
        });
    });

    describe('markRowsUnloaded', () => {
        it('removes row state', () => {
            manager.markRowsLoaded(['row1']);
            manager.markRowsUnloaded(['row1']);
            expect(manager.getRowState('row1').status).toBe('unloaded');
        });

        it('removes from loaded cache', () => {
            manager.markRowsLoaded(['row1']);
            manager.markRowsUnloaded(['row1']);
            expect(manager.isRowLoaded('row1')).toBe(false);
        });
    });

    describe('scheduleLoaded', () => {
        it('transitions to loaded after delay', () => {
            manager.markRowsLoading(['row1']);
            manager.scheduleLoaded('row1', 300);

            expect(manager.getRowState('row1').status).toBe('loading');

            vi.advanceTimersByTime(300);

            expect(manager.getRowState('row1').status).toBe('loaded');
        });

        it('uses default delay of 300ms', () => {
            manager.markRowsLoading(['row1']);
            manager.scheduleLoaded('row1');

            vi.advanceTimersByTime(299);
            expect(manager.getRowState('row1').status).toBe('loading');

            vi.advanceTimersByTime(1);
            expect(manager.getRowState('row1').status).toBe('loaded');
        });

        it('clears previous timeout when rescheduling', () => {
            manager.markRowsLoading(['row1']);
            manager.scheduleLoaded('row1', 300);

            vi.advanceTimersByTime(200);
            manager.scheduleLoaded('row1', 300);

            vi.advanceTimersByTime(200);
            expect(manager.getRowState('row1').status).toBe('loading');

            vi.advanceTimersByTime(100);
            expect(manager.getRowState('row1').status).toBe('loaded');
        });
    });

    describe('subscribe', () => {
        it('returns unsubscribe function', () => {
            const listener = vi.fn();
            const unsubscribe = manager.subscribe(listener);

            manager.markRowsLoading(['row1']);
            expect(listener).toHaveBeenCalledTimes(1);

            unsubscribe();
            manager.markRowsLoading(['row2']);
            expect(listener).toHaveBeenCalledTimes(1);
        });
    });

    describe('clear', () => {
        it('clears all states', () => {
            manager.markRowsLoaded(['row1', 'row2']);
            manager.clear();

            expect(manager.getRowState('row1').status).toBe('unloaded');
            expect(manager.getRowState('row2').status).toBe('unloaded');
        });

        it('clears loaded cache', () => {
            manager.markRowsLoaded(['row1']);
            manager.clear();
            expect(manager.isRowLoaded('row1')).toBe(false);
        });

        it('clears pending timeouts', () => {
            manager.markRowsLoading(['row1']);
            manager.scheduleLoaded('row1', 300);
            manager.clear();

            vi.advanceTimersByTime(300);
            expect(manager.getRowState('row1').status).toBe('unloaded');
        });

        it('notifies listeners', () => {
            const listener = vi.fn();
            manager.subscribe(listener);
            manager.clear();
            expect(listener).toHaveBeenCalled();
        });
    });

    describe('getStates', () => {
        it('returns copy of states map', () => {
            manager.markRowsLoaded(['row1']);
            const states = manager.getStates();

            expect(states.get('row1')?.status).toBe('loaded');

            // Modifying returned map doesn't affect manager
            states.set('row2', { status: 'loaded' });
            expect(manager.getRowState('row2').status).toBe('unloaded');
        });
    });

    describe('cleanup', () => {
        it('removes oldest entries when exceeding max cache size', () => {
            const smallManager = new RowStateManager(3);

            smallManager.markRowsLoading(['row1']);
            smallManager.markRowsLoading(['row2']);
            smallManager.markRowsLoading(['row3']);
            smallManager.markRowsLoading(['row4']);

            // row1 should have been cleaned up
            expect(smallManager.getRowState('row1').status).toBe('unloaded');
            expect(smallManager.getRowState('row4').status).toBe('loading');
        });
    });

    describe('key types', () => {
        it('supports string keys', () => {
            manager.markRowsLoaded(['string-key']);
            expect(manager.isRowLoaded('string-key')).toBe(true);
        });

        it('supports number keys', () => {
            manager.markRowsLoaded([123]);
            expect(manager.isRowLoaded(123)).toBe(true);
        });

        it('supports bigint keys', () => {
            manager.markRowsLoaded([BigInt(999)]);
            expect(manager.isRowLoaded(BigInt(999))).toBe(true);
        });
    });
});
