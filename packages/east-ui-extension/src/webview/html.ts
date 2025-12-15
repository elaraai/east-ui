/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import * as vscode from 'vscode';

export function generateWebviewHtml(
    webviewUri: vscode.Uri,
    serverUrl: string,
    repoPath: string
): string {
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webviewUri} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webviewUri} data:; font-src ${webviewUri}; connect-src ${serverUrl};">
    <title>East UI Preview</title>
</head>
<body>
    <div id="root"></div>
    <script nonce="${nonce}">
        window.__E3_API_URL__ = ${JSON.stringify(serverUrl)};
        window.__E3_REPO_PATH__ = ${JSON.stringify(repoPath)};
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
