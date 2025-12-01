/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { memo, useMemo } from "react";
import { Alert as ChakraAlert, type AlertRootProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Alert } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality function at module level
const alertEqual = equalFor(Alert.Types.Alert);

/** East Alert value type */
export type AlertValue = ValueTypeOf<typeof Alert.Types.Alert>;

/**
 * Converts an East UI Alert value to Chakra UI Alert props.
 * Pure function - easy to test independently.
 */
export function toChakraAlert(value: AlertValue): AlertRootProps {
    return {
        status: value.status.type,
        variant: getSomeorUndefined(value.variant)?.type,
    };
}

export interface EastChakraAlertProps {
    value: AlertValue;
}

/**
 * Renders an East UI Alert value using Chakra UI Alert component.
 */
export const EastChakraAlert = memo(function EastChakraAlert({ value }: EastChakraAlertProps) {
    const props = useMemo(() => toChakraAlert(value), [value]);
    const title = useMemo(() => getSomeorUndefined(value.title), [value.title]);
    const description = useMemo(() => getSomeorUndefined(value.description), [value.description]);

    return (
        <ChakraAlert.Root {...props}>
            <ChakraAlert.Indicator />
            <ChakraAlert.Content>
                {title && <ChakraAlert.Title>{title}</ChakraAlert.Title>}
                {description && <ChakraAlert.Description>{description}</ChakraAlert.Description>}
            </ChakraAlert.Content>
        </ChakraAlert.Root>
    );
}, (prev, next) => alertEqual(prev.value, next.value));
