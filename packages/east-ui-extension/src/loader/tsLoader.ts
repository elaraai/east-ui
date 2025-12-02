/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';
import * as vm from 'vm';
import Module from 'module';
import type { FunctionIR } from '../types.js';

export async function loadTypeScriptFile(filePath: string): Promise<FunctionIR> {
    // Read the TypeScript file
    const tsCode = fs.readFileSync(filePath, 'utf-8');

    // Transpile TypeScript to JavaScript
    const result = ts.transpileModule(tsCode, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2022,
            esModuleInterop: true,
            sourceMap: true,
        },
        fileName: filePath,
    });

    const transpiledCode = result.outputText;

    // Create a require function that resolves from user's project directory
    const userRequire = Module.createRequire(filePath);

    // Execute the transpiled code to get the exported function
    const module = { exports: {} as Record<string, unknown> };
    const context = vm.createContext({
        module,
        exports: module.exports,
        require: userRequire,
        console,
        Buffer,
        process,
        __dirname: path.dirname(filePath),
        __filename: filePath,
    });

    try {
        vm.runInContext(transpiledCode, context, {
            filename: filePath,
        });
    } catch (error) {
        throw new Error(
            `Failed to execute transpiled code: ${error instanceof Error ? error.message : String(error)}`
        );
    }

    // Get the default export
    const defaultExport = (module.exports as Record<string, unknown>).default ?? module.exports;

    if (!defaultExport) {
        throw new Error(
            `No default export found in ${path.basename(filePath)}.\n\n` +
            `Expected:\n` +
            `  export default East.function([...], UIComponentType, ($, ...) => { ... })`
        );
    }

    // Check if it has a toIR method (it's an East function)
    if (typeof (defaultExport as Record<string, unknown>).toIR !== 'function') {
        throw new Error(
            `Default export is not an East function.\n\n` +
            `Expected:\n` +
            `  export default East.function([...], UIComponentType, ($, ...) => { ... })\n\n` +
            `Got: ${typeof defaultExport}`
        );
    }

    // Call toIR() to get the EastIR wrapper, then extract the raw FunctionIR
    const eastIR = ((defaultExport as Record<string, unknown>).toIR as () => { ir: FunctionIR })();

    // toIR() returns EastIR class which wraps the raw FunctionIR in .ir property
    const ir = eastIR.ir;

    return ir;
}
