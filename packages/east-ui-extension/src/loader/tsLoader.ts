/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import * as esbuild from 'esbuild';
import * as path from 'path';
import * as vm from 'vm';
import type { FunctionIR } from '../types.js';

export async function loadTypeScriptFile(filePath: string): Promise<FunctionIR> {
    // Bundle the TypeScript file with all dependencies
    const result = await esbuild.build({
        entryPoints: [filePath],
        bundle: true,
        write: false,
        format: 'cjs',
        platform: 'node',
        target: 'node22',
        // Externalize node built-ins but bundle everything else
        external: [],
        // Resolve workspace packages
        nodePaths: [path.resolve(__dirname, '../../node_modules')],
        // Source maps for better error messages
        sourcemap: 'inline',
    });

    if (result.errors.length > 0) {
        const errorMessages = result.errors.map(e => e.text).join('\n');
        throw new Error(`Failed to bundle TypeScript file:\n${errorMessages}`);
    }

    const bundledCode = result.outputFiles[0].text;

    // Execute the bundled code to get the exported function
    const module = { exports: {} as Record<string, unknown> };
    const context = vm.createContext({
        module,
        exports: module.exports,
        require: require,
        console,
        Buffer,
        process,
        __dirname: path.dirname(filePath),
        __filename: filePath,
    });

    try {
        vm.runInContext(bundledCode, context, {
            filename: filePath,
        });
    } catch (error) {
        throw new Error(
            `Failed to execute bundled code: ${error instanceof Error ? error.message : String(error)}`
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
