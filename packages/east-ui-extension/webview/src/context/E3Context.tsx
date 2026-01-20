/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { createContext, useContext, useState, type ReactNode } from 'react';

// Discriminated union for selection state
export type Selection =
    | { type: 'none' }
    | { type: 'workspace'; workspace: string }
    | { type: 'task'; workspace: string; task: string }
    | { type: 'input'; workspace: string; path: string };

interface E3ContextValue {
    apiUrl: string;
    repoPath: string;
    selection: Selection;
    setSelection: (selection: Selection) => void;
    sidebarVisible: boolean;
    toggleSidebar: () => void;
}

const E3Context = createContext<E3ContextValue | null>(null);

interface E3ProviderProps {
    apiUrl: string;
    repoPath: string;
    children: ReactNode;
}

export function E3Provider({ apiUrl, repoPath, children }: E3ProviderProps) {
    const [selection, setSelection] = useState<Selection>({ type: 'none' });
    const [sidebarVisible, setSidebarVisible] = useState(true);

    return (
        <E3Context.Provider
            value={{
                apiUrl,
                repoPath,
                selection,
                setSelection,
                sidebarVisible,
                toggleSidebar: () => setSidebarVisible((prev) => !prev),
            }}
        >
            {children}
        </E3Context.Provider>
    );
}

export function useE3Context(): E3ContextValue {
    const context = useContext(E3Context);
    if (!context) {
        throw new Error('useE3Context must be used within an E3Provider');
    }
    return context;
}

// Helper to extract workspace from any selection that has one
export function getSelectedWorkspace(selection: Selection): string | null {
    return selection.type === 'none' ? null : selection.workspace;
}
