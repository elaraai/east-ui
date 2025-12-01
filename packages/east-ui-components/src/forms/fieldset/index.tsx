/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Fieldset as ChakraFieldset, type FieldsetRootProps } from "@chakra-ui/react";
import { type ValueTypeOf } from "@elaraai/east";
import { UIComponentType } from "@elaraai/east-ui";
import { EastChakraComponent } from "../../component";

/** East Fieldset value type - extracted from the component variant */
export type FieldsetValue = {
    legend: { type: "some"; value: string } | { type: "none"; value: null };
    helperText: { type: "some"; value: string } | { type: "none"; value: null };
    errorText: { type: "some"; value: string } | { type: "none"; value: null };
    content: Array<ValueTypeOf<UIComponentType>>;
    disabled: { type: "some"; value: boolean } | { type: "none"; value: null };
    invalid: { type: "some"; value: boolean } | { type: "none"; value: null };
    style: { type: "some"; value: { size: { type: "some"; value: { type: string } } | { type: "none"; value: null } } } | { type: "none"; value: null };
};

/**
 * Converts an East UI Fieldset value to Chakra UI Fieldset props.
 * Pure function - easy to test independently.
 */
export function toChakraFieldset(value: FieldsetValue): FieldsetRootProps {
    const disabled = value.disabled.type === "some" ? value.disabled.value : undefined;
    const invalid = value.invalid.type === "some" ? value.invalid.value : undefined;
    const size = value.style.type === "some" && value.style.value.size.type === "some"
        ? value.style.value.size.value.type as FieldsetRootProps["size"]
        : undefined;

    return {
        disabled,
        invalid,
        size,
    };
}

export interface EastChakraFieldsetProps {
    value: FieldsetValue;
}

/**
 * Renders an East UI Fieldset value using Chakra UI Fieldset component.
 */
export const EastChakraFieldset = memo(function EastChakraFieldset({ value }: EastChakraFieldsetProps) {
    const props = useMemo(() => toChakraFieldset(value), [value]);
    const legend = useMemo(() => value.legend.type === "some" ? value.legend.value : undefined, [value.legend]);
    const helperText = useMemo(() => value.helperText.type === "some" ? value.helperText.value : undefined, [value.helperText]);
    const errorText = useMemo(() => value.errorText.type === "some" ? value.errorText.value : undefined, [value.errorText]);

    return (
        <ChakraFieldset.Root {...props}>
            {legend && <ChakraFieldset.Legend>{legend}</ChakraFieldset.Legend>}
            {helperText && <ChakraFieldset.HelperText>{helperText}</ChakraFieldset.HelperText>}
            <ChakraFieldset.Content>
                {value.content.map((child, index) => (
                    <EastChakraComponent key={index} value={child} />
                ))}
            </ChakraFieldset.Content>
            {errorText && <ChakraFieldset.ErrorText>{errorText}</ChakraFieldset.ErrorText>}
        </ChakraFieldset.Root>
    );
});
