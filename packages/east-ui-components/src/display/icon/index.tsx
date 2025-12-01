/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { memo, useMemo } from "react";
import { FontAwesomeIcon, type FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { library, type IconName, type IconPrefix } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Icon } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Add all icon packs to the library
library.add(fas, far, fab);

// Pre-define equality function at module level
const iconEqual = equalFor(Icon.Types.Icon);

/** East Icon value type */
export type IconValue = ValueTypeOf<typeof Icon.Types.Icon>;

/** Map East size to Font Awesome size */
const sizeMap: Record<string, FontAwesomeIconProps["size"]> = {
    xs: "xs",
    sm: "sm",
    md: undefined, // default size
    lg: "lg",
    xl: "xl",
    "2xl": "2xl",
};

/**
 * Converts an East UI Icon value to FontAwesomeIcon props.
 * Pure function - easy to test independently.
 */
export function toFontAwesomeIcon(value: IconValue): FontAwesomeIconProps {
    const style = getSomeorUndefined(value.style);
    const sizeType = style ? getSomeorUndefined(style.size)?.type : undefined;
    const color = style ? getSomeorUndefined(style.color) : undefined;
    const colorPalette = style ? getSomeorUndefined(style.colorPalette)?.type : undefined;

    const size = sizeType ? sizeMap[sizeType] : undefined;

    return {
        icon: [value.prefix as IconPrefix, value.name as IconName],
        size,
        color: color ?? (colorPalette ? `var(--chakra-colors-${colorPalette}-500)` : undefined),
    };
}

export interface EastChakraIconProps {
    value: IconValue;
}

/**
 * Renders an East UI Icon value using Font Awesome.
 */
export const EastChakraIcon = memo(function EastChakraIcon({ value }: EastChakraIconProps) {
    const props = useMemo(() => toFontAwesomeIcon(value), [value]);

    return <FontAwesomeIcon {...props} />;
}, (prev, next) => iconEqual(prev.value, next.value));
