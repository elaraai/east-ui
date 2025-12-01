/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { memo, useMemo } from "react";
import { Field as ChakraField, type FieldRootProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Field } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define equality function at module level
const fieldEqual = equalFor(Field.Types.Field);

/** East Field value type */
export type FieldValue = ValueTypeOf<typeof Field.Types.Field>;

/**
 * Converts an East UI Field value to Chakra UI Field props.
 * Pure function - easy to test independently.
 */
export function toChakraField(value: FieldValue): FieldRootProps {
    return {
        required: getSomeorUndefined(value.required),
        disabled: getSomeorUndefined(value.disabled),
        invalid: getSomeorUndefined(value.invalid),
        readOnly: getSomeorUndefined(value.readOnly),
    };
}

export interface EastChakraFieldProps {
    value: FieldValue;
}

/**
 * Renders an East UI Field value using Chakra UI Field component.
 */
export const EastChakraField = memo(function EastChakraField({ value }: EastChakraFieldProps) {
    const props = useMemo(() => toChakraField(value), [value]);
    const helperText = useMemo(() => getSomeorUndefined(value.helperText), [value.helperText]);
    const errorText = useMemo(() => getSomeorUndefined(value.errorText), [value.errorText]);

    return (
        <ChakraField.Root {...props}>
            <ChakraField.Label>{value.label}</ChakraField.Label>
            <EastChakraComponent value={value.control} />
            {helperText && <ChakraField.HelperText>{helperText}</ChakraField.HelperText>}
            {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
        </ChakraField.Root>
    );
}, (prev, next) => fieldEqual(prev.value, next.value));
