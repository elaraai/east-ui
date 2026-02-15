/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo } from 'react';
import { useE3Context } from '../context/E3Context';
import { useWorkspaceStatus, InputPreview as InputPreviewInner } from '@elaraai/e3-ui-components';

/**
 * Outer component that handles context and passes props to the reusable InputPreview.
 */
export function InputPreview() {
    const { apiUrl, selection } = useE3Context();

    // Extract workspace and path from selection (only valid for input type)
    const workspace = selection.type === 'input' ? selection.workspace : null;
    const path = selection.type === 'input' ? selection.path : null;

    const { data: status } = useWorkspaceStatus(apiUrl, 'default', workspace, undefined, {
        refetchInterval: 1000,
        staleTime: 0,
        gcTime: 0,
        structuralSharing: false,
    });

    // Find the input info from datasets
    const inputInfo = useMemo(() => {
        if (!status || !path) return null;
        return status.datasets.find((d) => d.path === path) ?? null;
    }, [status, path]);

    // Only render for input selection
    if (selection.type !== 'input' || !workspace || !path) {
        return null;
    }

    return (
        <InputPreviewInner
            key={`${workspace}:${path}`}
            apiUrl={apiUrl}
            repo="default"
            workspace={workspace}
            path={path}
            inputInfo={inputInfo}
        />
    );
}
