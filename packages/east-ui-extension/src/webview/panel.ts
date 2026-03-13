/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { generateWebviewHtml } from './html.js';

let _outputChannel: vscode.OutputChannel | null = null;

function getOutputChannel(): vscode.OutputChannel {
    if (!_outputChannel) {
        _outputChannel = vscode.window.createOutputChannel('East UI');
    }
    return _outputChannel;
}

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

    // Forward webview console logs to the output channel
    const output = getOutputChannel();
    panel.webview.onDidReceiveMessage((msg) => {
        if (msg.type === 'log') {
            const prefix = msg.level === 'info' ? '' : `[${msg.level}] `;
            output.appendLine(`${prefix}${msg.message}`);
        }
    });

    // Generate HTML with the server config embedded
    panel.webview.html = generateWebviewHtml(panel.webview, webviewUri, serverUrl, repoPath);

    return panel;
}
