/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Button as ChakraButton, type ButtonProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Button } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define the equality function at module level
const buttonEqual = equalFor(Button.Types.Button);

/** East Button value type */
export type ButtonValue = ValueTypeOf<typeof Button.Types.Button>;

/**
 * Converts an East UI Button value to Chakra UI Button props.
 * Pure function - easy to test independently.
 *
 * @param value - The East Button value
 * @returns Chakra Button props
 */
export function toChakraButton(value: ButtonValue): ButtonProps {
    const style = getSomeorUndefined(value.style);

    return {
        variant: style ? getSomeorUndefined(style.variant)?.type : undefined,
        colorPalette: style ? getSomeorUndefined(style.colorPalette)?.type : undefined,
        size: style ? getSomeorUndefined(style.size)?.type : undefined,
        loading: style ? getSomeorUndefined(style.loading) : undefined,
        disabled: style ? getSomeorUndefined(style.disabled) : undefined,
    };
}

export interface EastChakraButtonProps {
    value: ButtonValue;
}

/**
 * Renders an East UI Button value using Chakra UI Button component.
 */
export const EastChakraButton = memo(function EastChakraButton({ value }: EastChakraButtonProps) {
    const props = useMemo(() => toChakraButton(value), [value]);

    return (
        <ChakraButton {...props}>
            {value.label}
        </ChakraButton>
    );
}, (prev, next) => buttonEqual(prev.value, next.value));
