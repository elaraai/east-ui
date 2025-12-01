/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import * as vscode from 'vscode';
import * as path from 'path';

export function createFileWatcher(
    filePath: string,
    onChanged: () => Promise<void>
): vscode.Disposable {
    const watcher = vscode.workspace.createFileSystemWatcher(
        new vscode.RelativePattern(
            path.dirname(filePath),
            path.basename(filePath)
        )
    );

    // Debounce rapid changes
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const debouncedOnChanged = () => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(async () => {
            await onChanged();
        }, 300);
    };

    watcher.onDidChange(debouncedOnChanged);

    return watcher;
}
