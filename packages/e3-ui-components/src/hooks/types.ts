/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * Subset of UseQueryOptions that can be overridden by callers.
 * Excludes queryKey, queryFn, and generic data type fields to preserve type inference.
 */
export interface QueryOverrides {
    enabled?: boolean;
    refetchInterval?: number | false;
    staleTime?: number;
    gcTime?: number;
    structuralSharing?: boolean;
    refetchOnWindowFocus?: boolean | 'always';
    refetchOnMount?: boolean | 'always';
    retry?: boolean | number;
    retryDelay?: number | ((attempt: number) => number);
}
