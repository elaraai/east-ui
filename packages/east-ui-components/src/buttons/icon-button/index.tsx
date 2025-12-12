/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback } from "react";
import { IconButton as ChakraIconButton, type IconButtonProps } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { IconButton } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import type { IconName, IconPrefix } from "@fortawesome/fontawesome-common-types";

// Add icon libraries
library.add(fas, far, fab);

// Pre-define the equality function at module level
const iconButtonEqual = equalFor(IconButton.Types.IconButton);

/** East IconButton value type */
export type IconButtonValue = ValueTypeOf<typeof IconButton.Types.IconButton>;

/**
 * Converts an East UI IconButton value to Chakra UI IconButton props (excluding callbacks).
 * Pure function - easy to test independently.
 */
export function toChakraIconButton(value: IconButtonValue): Omit<IconButtonProps, "children" | "aria-label" | "onClick"> {
    const style = getSomeorUndefined(value.style);

    return {
        variant: style ? getSomeorUndefined(style.variant)?.type : undefined,
        colorPalette: style ? getSomeorUndefined(style.colorPalette)?.type : undefined,
        size: style ? getSomeorUndefined(style.size)?.type : undefined,
        loading: style ? getSomeorUndefined(style.loading) : undefined,
        disabled: style ? getSomeorUndefined(style.disabled) : undefined,
    };
}

export interface EastChakraIconButtonProps {
    value: IconButtonValue;
}

/**
 * Renders an East UI IconButton value using Chakra UI IconButton component.
 */
export const EastChakraIconButton = memo(function EastChakraIconButton({ value }: EastChakraIconButtonProps) {
    const props = useMemo(() => toChakraIconButton(value), [value]);
    const onClickFn = useMemo(() => {
        const style = getSomeorUndefined(value.style);
        return style ? getSomeorUndefined(style.onClick) : undefined;
    }, [value.style]);

    const handleClick = useCallback(() => {
        if (onClickFn) {
            queueMicrotask(() => onClickFn());
        }
    }, [onClickFn]);

    return (
        <ChakraIconButton {...props} aria-label={value.name} onClick={onClickFn ? handleClick : undefined}>
            <FontAwesomeIcon icon={[value.prefix as IconPrefix, value.name as IconName]} />
        </ChakraIconButton>
    );
}, (prev, next) => iconButtonEqual(prev.value, next.value));
