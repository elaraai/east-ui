/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { startE3Server } from '../server/e3Server.js';
import { createPreviewPanel } from '../webview/panel.js';

/**
 * Validate that a path is an e3 repository.
 */
function isE3Repository(repoPath: string): boolean {
    const e3Dir = path.join(repoPath, '.e3');
    return fs.existsSync(e3Dir) && fs.statSync(e3Dir).isDirectory();
}

export async function openPreviewCommand(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('east-ui.e3');
    const lastRepoPath = config.get<string>('lastRepositoryPath', '');
    const port = config.get<number>('port', 3001);

    // Show folder picker dialog
    const defaultUri = lastRepoPath ? vscode.Uri.file(lastRepoPath) : undefined;
    const folderUri = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        defaultUri,
        openLabel: 'Select Repository',
        title: 'Select E3 Repository',
    });

    if (!folderUri || folderUri.length === 0) {
        return;
    }

    const repoPath = folderUri[0].fsPath;

    // Validate it's an e3 repository
    if (!isE3Repository(repoPath)) {
        vscode.window.showErrorMessage(
            `"${repoPath}" is not a valid e3 repository (missing .e3 directory)`
        );
        return;
    }

    // Save the path for next time
    await config.update('lastRepositoryPath', repoPath, vscode.ConfigurationTarget.Global);

    try {
        // Start the e3 server (server expects the .e3 directory path)
        const e3Path = path.join(repoPath, '.e3');
        const serverUrl = await startE3Server({ repo: e3Path, port });

        // Open the preview panel (show user the repo root, not .e3)
        createPreviewPanel(context, serverUrl, repoPath);

    } catch (error) {
        vscode.window.showErrorMessage(
            `Failed to start e3 server: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}
