/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

// Re-export FunctionIR from East internal
export type { FunctionIR } from '@elaraai/east/internal';

/**
 * Result of loading a file
 */
export interface LoadResult {
    ir: FunctionIR;
    isTypeScript: boolean;
}

/**
 * Message sent from extension to webview
 */
export type ExtensionMessage =
    | { type: 'update'; irJson: unknown }
    | { type: 'error'; message: string };
