/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import * as vscode from 'vscode';
import { openPreviewCommand } from './commands/openPreview.js';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'east-ui.openPreview',
        () => openPreviewCommand(context)
    );
    context.subscriptions.push(disposable);
}

export function deactivate() {}
