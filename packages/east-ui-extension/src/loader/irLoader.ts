/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { IRType, decodeBeast2For, fromJSONFor } from '@elaraai/east';
import type { FunctionIR } from '../types.js';

const decodeIRBeast2 = decodeBeast2For(IRType);
const decodeIRJSON = fromJSONFor(IRType);

export async function loadIRFile(filePath: string): Promise<FunctionIR> {
    const ext = path.extname(filePath).toLowerCase();
    const content = await fs.readFile(filePath);

    let ir: unknown;

    try {
        if (ext === '.beast' || ext === '.east') {
            ir = decodeIRBeast2(content);
        } else if (ext === '.json') {
            const json = JSON.parse(content.toString('utf-8'));
            ir = decodeIRJSON(json);
        } else {
            throw new Error(`Unsupported IR file extension: ${ext}`);
        }
    } catch (error) {
        throw new Error(
            `Failed to parse IR from ${path.basename(filePath)}: ` +
            `${error instanceof Error ? error.message : String(error)}`
        );
    }

    // Verify it's a Function IR
    if (!ir || (ir as { type?: string }).type !== 'Function') {
        throw new Error(
            `IR file must contain a Function, got: ${(ir as { type?: string })?.type ?? 'undefined'}`
        );
    }

    return ir as FunctionIR;
}
