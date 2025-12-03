/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import * as vscode from 'vscode';
import { IRType, toJSONFor } from '@elaraai/east';
import { loadFile } from '../loader/index.js';
import { createPreviewPanel } from '../webview/panel.js';
import { createFileWatcher } from '../watcher/fileWatcher.js';

// Use East's proper JSON serializer for IR (handles BigInt, Date, Uint8Array, etc.)
const serializeIR = toJSONFor(IRType);

export async function openPreviewCommand(context: vscode.ExtensionContext, uri?: vscode.Uri) {
    let filePath: string;

    if (uri) {
        // URI provided from context menu
        filePath = uri.fsPath;
    } else {
        // No URI - show file picker
        const fileUri = await vscode.window.showOpenDialog({
            canSelectMany: false,
            filters: {
                'East UI Files': ['ts', 'beast', 'east', 'json']
            },
            title: 'Select East UI Component File'
        });

        if (!fileUri || fileUri.length === 0) {
            return;
        }

        filePath = fileUri[0].fsPath;
    }

    try {
        // Step 2: Load the file (handles both .ts and IR files)
        const { ir, isTypeScript } = await loadFile(filePath);

        // Step 3: Open the preview panel
        const panel = createPreviewPanel(context, filePath, ir);

        // Step 4: Set up file watcher for .ts files
        if (isTypeScript) {
            const watcher = createFileWatcher(filePath, async () => {
                try {
                    const { ir: newIR } = await loadFile(filePath);
                    // Serialize IR before sending to webview
                    panel.webview.postMessage({ type: 'update', irJson: serializeIR(newIR) });
                } catch (error) {
                    panel.webview.postMessage({
                        type: 'error',
                        message: error instanceof Error ? error.message : String(error)
                    });
                }
            });

            // Clean up watcher when panel is closed
            panel.onDidDispose(() => watcher.dispose());
        }

    } catch (error) {
        vscode.window.showErrorMessage(
            `Failed to load East UI component: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}
