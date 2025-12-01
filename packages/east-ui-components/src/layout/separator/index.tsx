/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Separator as ChakraSeparator, type SeparatorProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Separator } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define the equality function at module level
const separatorEqual = equalFor(Separator.Types.Separator);

/** East Separator value type */
export type SeparatorValue = ValueTypeOf<typeof Separator.Types.Separator>;


/**
 * Converts an East UI Separator value to Chakra UI Separator props.
 * Pure function - easy to test independently.
 *
 * @param value - The East Separator value
 * @returns Chakra Separator props
 */
export function toChakraSeparator(value: SeparatorValue): SeparatorProps {
    return {
        orientation: getSomeorUndefined(value.orientation)?.type,
        variant: getSomeorUndefined(value.variant)?.type,
        size: getSomeorUndefined(value.size)?.type,
        borderColor: getSomeorUndefined(value.color),
    };
}

export interface EastChakraSeparatorProps {
    value: SeparatorValue;
}

/**
 * Renders an East UI Separator value using Chakra UI Separator component.
 */
export const EastChakraSeparator = memo(function EastChakraSeparator({ value }: EastChakraSeparatorProps) {
    const props = useMemo(() => toChakraSeparator(value), [value]);
    const label = getSomeorUndefined(value.label);

    return (
        <ChakraSeparator {...props}>
            {label}
        </ChakraSeparator>
    );
}, (prev, next) => separatorEqual(prev.value, next.value));
