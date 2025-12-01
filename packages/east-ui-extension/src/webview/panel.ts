/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import type { FunctionIR } from '../types.js';
import { generateWebviewHtml } from './html.js';

export function createPreviewPanel(
    context: vscode.ExtensionContext,
    filePath: string,
    ir: FunctionIR
): vscode.WebviewPanel {
    const fileName = path.basename(filePath);
    const isTypeScript = filePath.endsWith('.ts');

    const panel = vscode.window.createWebviewPanel(
        'eastUIPreview',
        `East UI: ${fileName}`,
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

    // Generate HTML with the IR embedded
    panel.webview.html = generateWebviewHtml(webviewUri, fileName, ir, isTypeScript);

    return panel;
}
