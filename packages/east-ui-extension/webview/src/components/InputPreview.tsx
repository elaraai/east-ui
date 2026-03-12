/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useE3Context } from '../context/E3Context';
import { InputPreview as InputPreviewInner } from '@elaraai/e3-ui-components';

/**
 * Outer component that handles context and passes props to the reusable InputPreview.
 */
export function InputPreview() {
    const { apiUrl, selection } = useE3Context();

    // Extract workspace and path from selection (only valid for input type)
    const workspace = selection.type === 'input' ? selection.workspace : null;
    const path = selection.type === 'input' ? selection.path : null;

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
        />
    );
}
