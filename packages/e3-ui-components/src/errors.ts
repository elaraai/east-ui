/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { ApiError } from '@elaraai/e3-api-client';
import { EastError } from '@elaraai/east';

/**
 * Extract a human-readable message and optional details from an error.
 * For ApiError, separates the error code from the actual error details.
 */
export function formatApiError(error: unknown): { message: string; details?: string } {
    if (error instanceof ApiError && error.details != null) {
        const details = error.details;
        if (typeof details === 'string') return { message: error.message, details };
        if (typeof details === 'object' && 'message' in details) return { message: error.message, details: String((details as Record<string, unknown>).message) };
        return { message: error.message, details: JSON.stringify(details) };
    }
    return { message: error instanceof Error ? error.message : String(error) };
}

/**
 * Format an error for display. For EastError, includes location stack trace.
 */
export function formatError(error: Error): string {
    if (error instanceof EastError) return error.formattedMessage;
    return error.message;
}
