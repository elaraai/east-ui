/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { generateWebviewHtml } from './html.js';

export function createPreviewPanel(
    context: vscode.ExtensionContext,
    serverUrl: string,
    repoPath: string
): vscode.WebviewPanel {
    const repoName = path.basename(repoPath);

    const panel = vscode.window.createWebviewPanel(
        'eastUIPreview',
        `East UI: ${repoName}`,
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [
                vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview')
            ]
        }
    );

    // Get URIs for webview resources
    const webviewUri = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview')
    );

    // Generate HTML with the server config embedded
    panel.webview.html = generateWebviewHtml(webviewUri, serverUrl, repoPath);

    return panel;
}
