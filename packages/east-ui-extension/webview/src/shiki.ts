/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { createShikiAdapter } from '@chakra-ui/react';
import { createHighlighter, type HighlighterGeneric } from 'shiki';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

// Shiki highlighter singleton - persists across component remounts
let shikiHighlighter: HighlighterGeneric<any, any> | null = null;
let shikiPromise: Promise<HighlighterGeneric<any, any>> | null = null;

// Wrapper that prevents dispose from being called
function createUndisposableHighlighter(highlighter: HighlighterGeneric<any, any>): HighlighterGeneric<any, any> {
    return new Proxy(highlighter, {
        get(target, prop) {
            if (prop === 'dispose') {
                return () => {
                    console.log('[East] Shiki: dispose() called but ignored');
                };
            }
            return (target as any)[prop];
        }
    });
}

export function getShikiHighlighter(): Promise<HighlighterGeneric<any, any>> {
    // Return existing highlighter if still valid
    if (shikiHighlighter) {
        return Promise.resolve(shikiHighlighter);
    }

    if (!shikiPromise) {
        console.log('[East] Shiki: Creating highlighter with JS engine...');
        shikiPromise = createHighlighter({
            langs: ['bash'],
            themes: ['github-dark'],
            engine: createJavaScriptRegexEngine(),
        }).then(h => {
            console.log('[East] Shiki: SUCCESS - languages:', h.getLoadedLanguages(), 'themes:', h.getLoadedThemes());
            // Wrap to prevent disposal
            shikiHighlighter = createUndisposableHighlighter(h);
            return shikiHighlighter;
        }).catch(err => {
            console.error('[East] Shiki: FAILED:', err);
            shikiPromise = null; // Reset so we can retry
            throw err;
        });
    }
    return shikiPromise;
}

// Create adapter - lives at app level so it doesn't get disposed
export const shikiAdapter = createShikiAdapter<HighlighterGeneric<any, any>>({
    load: getShikiHighlighter,
    theme: 'github-dark',
});
