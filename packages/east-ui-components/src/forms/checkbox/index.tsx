/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { memo, useMemo } from "react";
import { Checkbox as ChakraCheckbox, type CheckboxRootProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Checkbox } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality function at module level
const checkboxEqual = equalFor(Checkbox.Types.Checkbox);

/** East Checkbox value type */
export type CheckboxValue = ValueTypeOf<typeof Checkbox.Types.Checkbox>;

/**
 * Converts an East UI Checkbox value to Chakra UI Checkbox props.
 * Pure function - easy to test independently.
 */
export function toChakraCheckbox(value: CheckboxValue): CheckboxRootProps {
    const indeterminate = getSomeorUndefined(value.indeterminate);

    return {
        checked: indeterminate ? "indeterminate" : value.checked,
        disabled: getSomeorUndefined(value.disabled),
        colorPalette: getSomeorUndefined(value.colorPalette)?.type,
        size: getSomeorUndefined(value.size)?.type,
    };
}

export interface EastChakraCheckboxProps {
    value: CheckboxValue;
}

/**
 * Renders an East UI Checkbox value using Chakra UI Checkbox component.
 */
export const EastChakraCheckbox = memo(function EastChakraCheckbox({ value }: EastChakraCheckboxProps) {
    const props = useMemo(() => toChakraCheckbox(value), [value]);
    const label = useMemo(() => getSomeorUndefined(value.label), [value.label]);

    return (
        <ChakraCheckbox.Root {...props}>
            <ChakraCheckbox.HiddenInput />
            <ChakraCheckbox.Control />
            {label && <ChakraCheckbox.Label>{label}</ChakraCheckbox.Label>}
        </ChakraCheckbox.Root>
    );
}, (prev, next) => checkboxEqual(prev.value, next.value));
