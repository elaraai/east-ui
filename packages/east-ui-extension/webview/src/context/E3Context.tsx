/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { createContext, useContext, useState, type ReactNode } from 'react';

interface E3ContextValue {
    apiUrl: string;
    repoPath: string;
    selectedWorkspace: string | null;
    setSelectedWorkspace: (workspace: string | null) => void;
    selectedTask: string | null;
    setSelectedTask: (task: string | null) => void;
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
    const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<string | null>(null);
    const [sidebarVisible, setSidebarVisible] = useState(true);

    return (
        <E3Context.Provider
            value={{
                apiUrl,
                repoPath,
                selectedWorkspace,
                setSelectedWorkspace: (workspace) => {
                    setSelectedWorkspace(workspace);
                    setSelectedTask(null); // Clear task when workspace changes
                },
                selectedTask,
                setSelectedTask,
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
