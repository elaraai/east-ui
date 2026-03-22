/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { datasetGetStatus, datasetGet } from '@elaraai/e3-api-client';
import type { RequestOptions } from '@elaraai/e3-api-client';
import {
    decodeBeast2For,
    isTypeValueEqual,
    toEastTypeValue,
    variant,
    type EastTypeValue,
    type ValueTypeOf,
} from '@elaraai/east';
import { UIComponentType } from '@elaraai/east-ui';
import {
    StateImpl,
    DatasetImpl,
    OverlayImpl,
} from '@elaraai/east-ui-components';
import type { QueryOverrides } from './types.js';

const platformImplementations = [...StateImpl, ...DatasetImpl, ...OverlayImpl];

const VALUE_SIZE_LIMIT = 200 * 1024; // 200KB
const LOG_PREFIX = '[dataset-preview]';

// ── Status derived from the lightweight status endpoint ─────────────

export interface DatasetStatus {
    path: string;
    type: EastTypeValue;
    /** "unassigned" | "null" | "value" */
    refType: string;
    hash: string | null;
    sizeBytes: number | null;
}

// ── State machine ───────────────────────────────────────────────────

export type DatasetPreviewState =
    | { state: 'loading' }
    | { state: 'error'; error: Error; status: DatasetStatus | null }
    | { state: 'unassigned'; status: DatasetStatus }
    | { state: 'ui'; status: DatasetStatus; component: ValueTypeOf<typeof UIComponentType> }
    | { state: 'value'; status: DatasetStatus; decoded: unknown }
    | { state: 'oversized'; status: DatasetStatus };

// ── Hook ────────────────────────────────────────────────────────────

export interface UseDatasetPreviewOptions {
    requestOptions?: RequestOptions;
    pollInterval?: number;
    queryOverrides?: QueryOverrides;
}

export function useDatasetPreview(
    apiUrl: string,
    repo: string,
    workspace: string | null,
    datasetPath: string | null,
    options?: UseDatasetPreviewOptions,
): DatasetPreviewState {
    const { requestOptions, pollInterval = 5000, queryOverrides } = options ?? {};
    const reqOpts = requestOptions ?? { token: null };

    const pathParts = useMemo(() =>
        datasetPath?.split('.').filter(Boolean).map((v) => variant('field', v)) ?? [],
        [datasetPath]
    );

    const enabled = !!workspace && !!datasetPath;

    // ── Step 1: lightweight status poll ─────────────────────────────

    const statusQuery = useQuery({
        queryKey: ['datasetStatus', apiUrl, repo, workspace, datasetPath],
        queryFn: () => datasetGetStatus(apiUrl, repo, workspace!, pathParts, reqOpts),
        enabled,
        refetchInterval: pollInterval,
        ...queryOverrides,
    });

    // Derive clean status + UI type check from raw API response
    const derived = useMemo(() => {
        const raw = statusQuery.data;
        if (!raw) return null;

        const hash = raw.hash?.type === 'some' ? raw.hash.value : null;
        const sizeBytes = raw.size?.type === 'some' ? Number(raw.size.value) : null;

        let isUI = false;
        try {
            isUI = isTypeValueEqual(raw.type, toEastTypeValue(UIComponentType));
        } catch {
            // not a UI component
        }

        const status: DatasetStatus = {
            path: raw.path,
            type: raw.type,
            refType: raw.refType,
            hash,
            sizeBytes,
        };

        const hasValue = raw.refType === 'value' && hash !== null;
        const isOversized = hasValue && !isUI && sizeBytes !== null && sizeBytes > VALUE_SIZE_LIMIT;
        const shouldFetchValue = hasValue && !isOversized;

        console.log(`${LOG_PREFIX} status`, datasetPath, {
            refType: raw.refType,
            hash: hash ? hash.slice(0, 8) + '...' : null,
            sizeBytes,
            sizeHuman: sizeBytes != null ? `${(sizeBytes / 1024 / 1024).toFixed(2)} MB` : 'unknown',
            isUI,
            hasValue,
            isOversized,
            shouldFetchValue,
        });

        return { status, isUI, hasValue, isOversized, shouldFetchValue };
    }, [statusQuery.data, datasetPath]);

    const status = derived?.status ?? null;
    const isUI = derived?.isUI ?? false;
    const hasValue = derived?.hasValue ?? false;
    const isOversized = derived?.isOversized ?? false;
    const shouldFetchValue = derived?.shouldFetchValue ?? false;

    // ── Step 2: value fetch (keyed on hash for cache) ───────────────

    const valueQuery = useQuery({
        queryKey: ['datasetValue', apiUrl, repo, workspace, datasetPath, status?.hash],
        queryFn: async () => {
            console.log(`${LOG_PREFIX} fetching value...`, datasetPath);
            const result = await datasetGet(apiUrl, repo, workspace!, pathParts, reqOpts);
            console.log(`${LOG_PREFIX} fetched value`, datasetPath, {
                size: result.data.length,
                sizeHuman: `${(result.data.length / 1024 / 1024).toFixed(2)} MB`,
            });
            return result;
        },
        enabled: enabled && shouldFetchValue,
        ...queryOverrides,
    });

    // ── Step 3: decode ──────────────────────────────────────────────

    const decoded = useMemo(() => {
        if (!status || !valueQuery.data) return null;

        const raw = valueQuery.data.data;
        const decodeStart = performance.now();
        try {
            const decoder = decodeBeast2For(status.type, {
                platform: platformImplementations,
                skipTypeCheck: true,
            });
            const value = decoder(raw);
            const ms = performance.now() - decodeStart;
            console.log(`${LOG_PREFIX} decoded`, datasetPath, {
                payloadKB: (raw.length / 1024).toFixed(1),
                decodeMs: ms.toFixed(1),
                isUI,
            });
            return { ok: true as const, value };
        } catch (e) {
            const ms = performance.now() - decodeStart;
            console.warn(`${LOG_PREFIX} decode failed`, datasetPath, {
                decodeMs: ms.toFixed(1),
                error: e instanceof Error ? e.message : String(e),
            });
            return { ok: false as const, error: e instanceof Error ? e : new Error(String(e)) };
        }
    }, [status, valueQuery.data, datasetPath, isUI]);

    // ── Step 4: derive final state ──────────────────────────────────

    return useMemo((): DatasetPreviewState => {
        const queryError = statusQuery.error ?? valueQuery.error;
        if (queryError) {
            return { state: 'error', error: queryError instanceof Error ? queryError : new Error(String(queryError)), status };
        }

        if (statusQuery.isLoading || !status) {
            return { state: 'loading' };
        }

        if (!hasValue) {
            return { state: 'unassigned', status };
        }

        if (isOversized) {
            return { state: 'oversized', status };
        }

        if (valueQuery.isLoading || !decoded) {
            return { state: 'loading' };
        }

        if (!decoded.ok) {
            return { state: 'error', error: decoded.error, status };
        }

        if (isUI) {
            return { state: 'ui', status, component: decoded.value as ValueTypeOf<typeof UIComponentType> };
        }

        return { state: 'value', status, decoded: decoded.value };
    }, [statusQuery.error, statusQuery.isLoading, valueQuery.error, valueQuery.isLoading, status, hasValue, isOversized, decoded, isUI]);
}

// ── Download helper ─────────────────────────────────────────────────

export function useDatasetDownload(
    apiUrl: string,
    repo: string,
    workspace: string | null,
    datasetPath: string | null,
    requestOptions?: RequestOptions,
) {
    const reqOpts = requestOptions ?? { token: null };

    const pathParts = useMemo(() =>
        datasetPath?.split('.').filter(Boolean).map((v) => variant('field', v)) ?? [],
        [datasetPath]
    );

    return useCallback(async () => {
        if (!workspace || !datasetPath) return;

        console.log(`${LOG_PREFIX} downloading`, datasetPath);
        const result = await datasetGet(apiUrl, repo, workspace, pathParts, reqOpts);
        console.log(`${LOG_PREFIX} downloaded`, datasetPath, {
            size: result.data.length,
            sizeHuman: `${(result.data.length / 1024 / 1024).toFixed(2)} MB`,
        });
        const blob = new Blob([new Uint8Array(result.data)], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${datasetPath.replace(/\./g, '_')}.beast2`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [apiUrl, repo, workspace, datasetPath, pathParts, reqOpts]);
}
