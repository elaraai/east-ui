/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import * as vscode from 'vscode';
import { openPreviewCommand } from './commands/openPreview.js';
import { stopE3Server } from './server/e3Server.js';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'east-ui.openPreview',
        async () => {
            try {
                await openPreviewCommand(context);
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                vscode.window.showErrorMessage(`East UI Preview failed: ${message}`);
                console.error('East UI Preview error:', error);
            }
        }
    );
    context.subscriptions.push(disposable);
}

export async function deactivate() {
    await stopE3Server();
}
