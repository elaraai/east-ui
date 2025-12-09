/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback } from "react";
import { Textarea as ChakraTextarea, type TextareaProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Textarea } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality function at module level
const textareaEqual = equalFor(Textarea.Types.Textarea);

/** East Textarea value type */
export type TextareaValue = ValueTypeOf<typeof Textarea.Types.Textarea>;

/**
 * Converts an East UI Textarea value to Chakra UI Textarea props.
 * Pure function - easy to test independently.
 */
export function toChakraTextarea(value: TextareaValue): TextareaProps {
    const rows = getSomeorUndefined(value.rows);
    const maxLength = getSomeorUndefined(value.maxLength);

    return {
        value: value.value,
        placeholder: getSomeorUndefined(value.placeholder),
        variant: getSomeorUndefined(value.variant)?.type,
        size: getSomeorUndefined(value.size)?.type,
        resize: getSomeorUndefined(value.resize)?.type,
        rows: rows !== undefined ? Number(rows) : undefined,
        disabled: getSomeorUndefined(value.disabled),
        readOnly: getSomeorUndefined(value.readOnly),
        required: getSomeorUndefined(value.required),
        maxLength: maxLength !== undefined ? Number(maxLength) : undefined,
        autoresize: getSomeorUndefined(value.autoresize),
    };
}

export interface EastChakraTextareaProps {
    value: TextareaValue;
}

/**
 * Renders an East UI Textarea value using Chakra UI Textarea component.
 */
export const EastChakraTextarea = memo(function EastChakraTextarea({ value }: EastChakraTextareaProps) {
    const props = useMemo(() => toChakraTextarea(value), [value]);

    // Extract callbacks
    const onChangeFn = useMemo(() => getSomeorUndefined(value.onChange), [value.onChange]);
    const onBlurFn = useMemo(() => getSomeorUndefined(value.onBlur), [value.onBlur]);
    const onFocusFn = useMemo(() => getSomeorUndefined(value.onFocus), [value.onFocus]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChangeFn) {
            queueMicrotask(() => onChangeFn(e.target.value));
        }
    }, [onChangeFn]);

    const handleBlur = useCallback(() => {
        if (onBlurFn) {
            queueMicrotask(() => onBlurFn());
        }
    }, [onBlurFn]);

    const handleFocus = useCallback(() => {
        if (onFocusFn) {
            queueMicrotask(() => onFocusFn());
        }
    }, [onFocusFn]);

    return (
        <ChakraTextarea
            {...props}
            onChange={onChangeFn ? handleChange : undefined}
            onBlur={onBlurFn ? handleBlur : undefined}
            onFocus={onFocusFn ? handleFocus : undefined}
        />
    );
}, (prev, next) => textareaEqual(prev.value, next.value));
