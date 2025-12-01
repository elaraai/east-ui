/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useState, useEffect, useMemo } from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { EastIR, IR, IRType, ValueTypeOf, fromJSONFor } from '@elaraai/east';
import {
    EastStoreProvider,
    EastFunction,
    createEastStore
} from '@elaraai/east-ui-components';
import { Toolbar } from './components/Toolbar';
import { ErrorDisplay } from './components/ErrorDisplay';

// Use East's proper JSON deserializer for IR (handles BigInt, Date, Uint8Array, etc.)
const deserializeIR = fromJSONFor(IRType);

declare global {
    interface Window {
        __EAST_IR_JSON__: unknown;  // Serialized IR (East JSON format)
        __EAST_FILENAME__: string;
        __EAST_WATCHING__: boolean;
    }
}

export function App() {
    // Deserialize the initial IR from East JSON format
    const [irJson, setIRJson] = useState(window.__EAST_IR_JSON__);
    const [error, setError] = useState<string | null>(null);
    const filename = window.__EAST_FILENAME__;
    const isWatching = window.__EAST_WATCHING__;

    // Deserialize IR when it changes
    const ir = useMemo(() => {
        try {
            return deserializeIR(irJson) as ValueTypeOf<IR>;
        } catch (e) {
            setError(`Failed to deserialize IR: ${e instanceof Error ? e.message : String(e)}`);
            return null;
        }
    }, [irJson]);

    // Listen for updates from extension
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const message = event.data;
            if (message.type === 'update') {
                setIRJson(message.irJson);  // Receive serialized IR
                setError(null);
            } else if (message.type === 'error') {
                setError(message.message);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Create store (with empty initial state) - recreate on IR change to reset state
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const store = useMemo(() => createEastStore(), [ir]);

    if (error || !ir) {
        return (
            <ChakraProvider value={defaultSystem}>
                <Toolbar filename={filename} isWatching={isWatching} hasError={true} />
                <ErrorDisplay message={error ?? 'Failed to load IR'} />
            </ChakraProvider>
        );
    }

    // Create EastIR wrapper
    const eastIR = new EastIR(ir);

    return (
        <ChakraProvider value={defaultSystem}>
            <Toolbar
                filename={filename}
                isWatching={isWatching}
                hasError={false}
            />
            <EastStoreProvider store={store}>
                <EastFunction ir={eastIR} />
            </EastStoreProvider>
        </ChakraProvider>
    );
}
