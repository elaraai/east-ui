/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import * as path from 'path';
import { loadIRFile } from './irLoader.js';
import { loadTypeScriptFile } from './tsLoader.js';
import { validateUIComponentFunction } from './validator.js';
import type { FunctionIR, LoadResult } from '../types.js';

export async function loadFile(filePath: string): Promise<LoadResult> {
    const ext = path.extname(filePath).toLowerCase();

    let ir: FunctionIR;
    let isTypeScript = false;

    if (ext === '.ts') {
        ir = await loadTypeScriptFile(filePath);
        isTypeScript = true;
    } else if (ext === '.beast' || ext === '.east' || ext === '.json') {
        ir = await loadIRFile(filePath);
    } else {
        throw new Error(`Unsupported file type: ${ext}`);
    }

    // Validate the function returns UIComponentType
    validateUIComponentFunction(ir);

    return { ir, isTypeScript };
}
