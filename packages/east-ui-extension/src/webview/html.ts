/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import * as vscode from 'vscode';
import { IRType, toJSONFor } from '@elaraai/east';
import type { FunctionIR } from '../types.js';

// Use East's proper JSON serializer for IR (handles BigInt, Date, Uint8Array, etc.)
const serializeIR = toJSONFor(IRType);

export function generateWebviewHtml(
    webviewUri: vscode.Uri,
    fileName: string,
    ir: FunctionIR,
    isWatching: boolean
): string {
    // Serialize IR using East's JSON serializer (handles special types correctly)
    const irJson = JSON.stringify(serializeIR(ir));
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webviewUri} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webviewUri} data:; font-src ${webviewUri};">
    <title>East UI: ${escapeHtml(fileName)}</title>
</head>
<body>
    <div id="root"></div>
    <script nonce="${nonce}">
        window.__EAST_IR_JSON__ = ${irJson};
        window.__EAST_FILENAME__ = ${JSON.stringify(fileName)};
        window.__EAST_WATCHING__ = ${isWatching};
    </script>
    <script nonce="${nonce}" src="${webviewUri}/index.js"></script>
</body>
</html>`;
}

function getNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
