/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { UIComponentType } from '@elaraai/east-ui';
import { isTypeValueEqual, toEastTypeValue } from '@elaraai/east';
import type { FunctionIR } from '../types.js';

// Convert UIComponentType to EastTypeValue for comparison
const uiComponentTypeValue = toEastTypeValue(UIComponentType);

export function validateUIComponentFunction(ir: FunctionIR): void {
    if (!ir) {
        throw new Error('IR is null or undefined');
    }

    // FunctionIR structure: { type: "Function", value: { type: EastTypeValue, ... } }
    // where EastTypeValue for function is: { type: "Function", value: { inputs, output } }
    if (ir.type !== 'Function') {
        throw new Error(
            `Expected a Function IR, got: ${ir.type}`
        );
    }

    const functionTypeValue = ir.value.type;
    if (functionTypeValue.type !== 'Function') {
        throw new Error(
            `Expected Function type signature, got: ${functionTypeValue.type}`
        );
    }

    const outputType = functionTypeValue.value.output;

    // Check if the output type equals UIComponentType
    if (!isTypeValueEqual(outputType, uiComponentTypeValue)) {
        throw new Error(
            `Function must return UIComponentType.\n\n` +
            `Your function's return type does not match UIComponentType.\n` +
            `Make sure your function is defined as:\n\n` +
            `  export default East.function(\n` +
            `      [...inputs],\n` +
            `      UIComponentType,  // <-- This must be UIComponentType\n` +
            `      ($, ...args) => { ... }\n` +
            `  )`
        );
    }
}
