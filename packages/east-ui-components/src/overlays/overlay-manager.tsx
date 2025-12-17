/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type PlatformFunction } from "@elaraai/east/internal";
import { dialog_open, drawer_open } from "@elaraai/east-ui";
import { DialogContent, type DialogOpenInputValue } from "./dialog/index.js";
import { DrawerContent, type DrawerOpenInputValue } from "./drawer/index.js";

interface PendingDialog {
    id: string;
    value: DialogOpenInputValue;
}

interface PendingDrawer {
    id: string;
    value: DrawerOpenInputValue;
}

interface OverlayManagerContextValue {
    openDialog: (value: DialogOpenInputValue) => void;
    openDrawer: (value: DrawerOpenInputValue) => void;
}

// ============================================================================
// Context
// ============================================================================

const OverlayManagerContext = createContext<OverlayManagerContextValue | null>(null);

let globalOverlayManager: OverlayManagerContextValue | null = null;

export function useOverlayManager(): OverlayManagerContextValue {
    const context = useContext(OverlayManagerContext);
    if (!context) {
        throw new Error("useOverlayManager must be used within an OverlayManagerProvider");
    }
    return context;
}

// ============================================================================
// Provider Component
// ============================================================================

export interface OverlayManagerProviderProps {
    children: ReactNode;
}

let dialogIdCounter = 0;
let drawerIdCounter = 0;

/**
 * Provider component for programmatic dialog and drawer management.
 *
 * @remarks
 * Wrap your application with this provider to enable programmatic
 * opening of dialogs and drawers via `Dialog.open` and `Drawer.open`.
 *
 * @example
 * ```tsx
 * import { OverlayManagerProvider } from "@elaraai/east-ui-components";
 *
 * function App() {
 *     return (
 *         <OverlayManagerProvider>
 *             <YourApp />
 *         </OverlayManagerProvider>
 *     );
 * }
 * ```
 */
export function OverlayManagerProvider({ children }: OverlayManagerProviderProps) {
    const [dialogs, setDialogs] = useState<PendingDialog[]>([]);
    const [drawers, setDrawers] = useState<PendingDrawer[]>([]);

    const openDialog = useCallback((value: DialogOpenInputValue) => {
        const id = `dialog-${++dialogIdCounter}`;
        setDialogs(prev => [...prev, { id, value }]);
    }, []);

    const closeDialog = useCallback((id: string) => {
        setDialogs(prev => prev.filter(d => d.id !== id));
    }, []);

    const openDrawer = useCallback((value: DrawerOpenInputValue) => {
        const id = `drawer-${++drawerIdCounter}`;
        setDrawers(prev => [...prev, { id, value }]);
    }, []);

    const closeDrawer = useCallback((id: string) => {
        setDrawers(prev => prev.filter(d => d.id !== id));
    }, []);

    const contextValue: OverlayManagerContextValue = {
        openDialog,
        openDrawer,
    };

    // Set global reference for platform function implementations
    globalOverlayManager = contextValue;

    return (
        <OverlayManagerContext.Provider value={contextValue}>
            {children}

            {/* Render programmatic dialogs */}
            {dialogs.map(({ id, value }) => (
                <ProgrammaticDialog
                    key={id}
                    value={value}
                    onClose={() => closeDialog(id)}
                />
            ))}

            {/* Render programmatic drawers */}
            {drawers.map(({ id, value }) => (
                <ProgrammaticDrawer
                    key={id}
                    value={value}
                    onClose={() => closeDrawer(id)}
                />
            ))}
        </OverlayManagerContext.Provider>
    );
}

// ============================================================================
// Programmatic Dialog Component
// ============================================================================

interface ProgrammaticDialogProps {
    value: DialogOpenInputValue;
    onClose: () => void;
}

function ProgrammaticDialog({ value, onClose }: ProgrammaticDialogProps) {
    return (
        <DialogContent
            value={value}
            open={true}
            onClose={onClose}
        />
    );
}

// ============================================================================
// Programmatic Drawer Component
// ============================================================================

interface ProgrammaticDrawerProps {
    value: DrawerOpenInputValue;
    onClose: () => void;
}

function ProgrammaticDrawer({ value, onClose }: ProgrammaticDrawerProps) {
    return (
        <DrawerContent
            value={value}
            open={true}
            onClose={onClose}
        />
    );
}

// ============================================================================
// Platform Function Implementations
// ============================================================================

/**
 * Platform implementation for dialog_open.
 *
 * @remarks
 * Requires the application to be wrapped in {@link OverlayManagerProvider}.
 */
export const DialogOpenImpl: PlatformFunction = dialog_open.implement((input) => {
    if (!globalOverlayManager) {
        console.warn("Dialog.open called but OverlayManagerProvider is not mounted. Wrap your app in <OverlayManagerProvider>.");
        return;
    }
    globalOverlayManager.openDialog(input);
});

/**
 * Platform implementation for drawer_open.
 *
 * @remarks
 * Requires the application to be wrapped in {@link OverlayManagerProvider}.
 */
export const DrawerOpenImpl: PlatformFunction = drawer_open.implement((input) => {
    if (!globalOverlayManager) {
        console.warn("Drawer.open called but OverlayManagerProvider is not mounted. Wrap your app in <OverlayManagerProvider>.");
        return;
    }
    globalOverlayManager.openDrawer(input);
});

/**
 * Combined platform implementations for overlay management.
 *
 * @remarks
 * Pass this to `ir.compile()` along with other implementations to enable
 * programmatic dialog and drawer opening.
 *
 * @example
 * ```ts
 * import { State } from "@elaraai/east-ui";
 * import { OverlayImpl } from "@elaraai/east-ui-components";
 *
 * const compiled = myFunction.toIR().compile([...State.Implementation, ...OverlayImpl]);
 * ```
 */
export const OverlayImpl: PlatformFunction[] = [DialogOpenImpl, DrawerOpenImpl];
