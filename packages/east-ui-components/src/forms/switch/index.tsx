/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Switch as ChakraSwitch, type SwitchRootProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Switch } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality function at module level
const switchEqual = equalFor(Switch.Types.Switch);

/** East Switch value type */
export type SwitchValue = ValueTypeOf<typeof Switch.Types.Switch>;

/**
 * Converts an East UI Switch value to Chakra UI Switch props.
 * Pure function - easy to test independently.
 */
export function toChakraSwitch(value: SwitchValue): SwitchRootProps {
    return {
        checked: value.checked,
        disabled: getSomeorUndefined(value.disabled),
        colorPalette: getSomeorUndefined(value.colorPalette)?.type,
        size: getSomeorUndefined(value.size)?.type,
    };
}

export interface EastChakraSwitchProps {
    value: SwitchValue;
}

/**
 * Renders an East UI Switch value using Chakra UI Switch component.
 */
export const EastChakraSwitch = memo(function EastChakraSwitch({ value }: EastChakraSwitchProps) {
    const props = useMemo(() => toChakraSwitch(value), [value]);
    const label = useMemo(() => getSomeorUndefined(value.label), [value.label]);

    return (
        <ChakraSwitch.Root {...props}>
            <ChakraSwitch.HiddenInput />
            <ChakraSwitch.Control />
            {label && <ChakraSwitch.Label>{label}</ChakraSwitch.Label>}
        </ChakraSwitch.Root>
    );
}, (prev, next) => switchEqual(prev.value, next.value));
