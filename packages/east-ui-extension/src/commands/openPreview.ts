/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import * as vscode from 'vscode';
import { startE3Server } from '../server/e3Server.js';
import { createPreviewPanel } from '../webview/panel.js';

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

    // Save the path for next time
    await config.update('lastRepositoryPath', repoPath, vscode.ConfigurationTarget.Global);

    try {
        // Start the e3 server
        const serverUrl = await startE3Server({ repoPath, port });

        // Convert localhost URL to externally accessible URL for remote scenarios.
        // In VS Code Remote, this enables port forwarding so the webview can reach the server.
        const externalUri = await vscode.env.asExternalUri(vscode.Uri.parse(serverUrl));
        const externalUrl = externalUri.toString().replace(/\/$/, ''); // Remove trailing slash

        // Open the preview panel (show user the repo root, not .e3)
        createPreviewPanel(context, externalUrl, repoPath);

    } catch (error) {
        vscode.window.showErrorMessage(
            `Failed to start e3 server: ${error instanceof Error ? error.message : String(error)}`
        );
    }
}
