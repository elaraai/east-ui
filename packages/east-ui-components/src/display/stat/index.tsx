/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { memo, useMemo } from "react";
import { Stat as ChakraStat } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Stat } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality function at module level
const statEqual = equalFor(Stat.Types.Stat);

/** East Stat value type */
export type StatValue = ValueTypeOf<typeof Stat.Types.Stat>;

export interface EastChakraStatProps {
    value: StatValue;
}

/**
 * Renders an East UI Stat value using Chakra UI Stat component.
 */
export const EastChakraStat = memo(function EastChakraStat({ value }: EastChakraStatProps) {
    const helpText = useMemo(() => getSomeorUndefined(value.helpText), [value.helpText]);
    const indicator = useMemo(() => getSomeorUndefined(value.indicator)?.type, [value.indicator]);

    return (
        <ChakraStat.Root>
            <ChakraStat.Label>{value.label}</ChakraStat.Label>
            <ChakraStat.ValueText>{value.value}</ChakraStat.ValueText>
            {helpText && (
                <ChakraStat.HelpText>
                    {indicator && <ChakraStat.UpIndicator />}
                    {helpText}
                </ChakraStat.HelpText>
            )}
        </ChakraStat.Root>
    );
}, (prev, next) => statEqual(prev.value, next.value));
