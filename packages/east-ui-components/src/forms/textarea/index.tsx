/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { memo, useMemo } from "react";
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

    return <ChakraTextarea {...props} />;
}, (prev, next) => textareaEqual(prev.value, next.value));
