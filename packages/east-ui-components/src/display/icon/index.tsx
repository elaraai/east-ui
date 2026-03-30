/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback } from "react";
import { Box as ChakraBox, type BoxProps } from "@chakra-ui/react";
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

/**
 * Extracts wrapper style props from an East UI Icon value for the containing Box.
 * Pure function - easy to test independently.
 */
export function toIconWrapperProps(value: IconValue): BoxProps | undefined {
    const style = getSomeorUndefined(value.style);
    if (!style) return undefined;

    const padding = getSomeorUndefined(style.padding);
    const margin = getSomeorUndefined(style.margin);

    const opacity = getSomeorUndefined(style.opacity);
    const borderRadius = getSomeorUndefined(style.borderRadius);
    const overflow = getSomeorUndefined(style.overflow)?.type;
    const overflowX = getSomeorUndefined(style.overflowX)?.type;
    const overflowY = getSomeorUndefined(style.overflowY)?.type;
    const width = getSomeorUndefined(style.width);
    const height = getSomeorUndefined(style.height);
    const minWidth = getSomeorUndefined(style.minWidth);
    const minHeight = getSomeorUndefined(style.minHeight);
    const maxWidth = getSomeorUndefined(style.maxWidth);
    const maxHeight = getSomeorUndefined(style.maxHeight);

    // Only create wrapper props if at least one style property is set
    if (
        opacity === undefined &&
        borderRadius === undefined &&
        overflow === undefined &&
        overflowX === undefined &&
        overflowY === undefined &&
        width === undefined &&
        height === undefined &&
        minWidth === undefined &&
        minHeight === undefined &&
        maxWidth === undefined &&
        maxHeight === undefined &&
        !padding &&
        !margin
    ) {
        return undefined;
    }

    return {
        display: "inline-block",
        opacity,
        borderRadius,
        overflow,
        overflowX,
        overflowY,
        width,
        height,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        pt: padding ? getSomeorUndefined(padding.top) : undefined,
        pr: padding ? getSomeorUndefined(padding.right) : undefined,
        pb: padding ? getSomeorUndefined(padding.bottom) : undefined,
        pl: padding ? getSomeorUndefined(padding.left) : undefined,
        mt: margin ? getSomeorUndefined(margin.top) : undefined,
        mr: margin ? getSomeorUndefined(margin.right) : undefined,
        mb: margin ? getSomeorUndefined(margin.bottom) : undefined,
        ml: margin ? getSomeorUndefined(margin.left) : undefined,
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
    const wrapperProps = useMemo(() => toIconWrapperProps(value), [value]);

    const style = useMemo(() => getSomeorUndefined(value.style), [value.style]);
    const onClickFn = useMemo(() => style ? getSomeorUndefined(style.onClick) : undefined, [style]);

    const handleClick = useCallback(() => {
        if (onClickFn) {
            queueMicrotask(() => onClickFn());
        }
    }, [onClickFn]);

    if (wrapperProps) {
        return (
            <ChakraBox {...wrapperProps} onClick={onClickFn ? handleClick : undefined} cursor={onClickFn ? "pointer" : undefined}>
                <FontAwesomeIcon {...props} />
            </ChakraBox>
        );
    }

    if (onClickFn) {
        return (
            <span onClick={handleClick} style={{ cursor: "pointer" }}>
                <FontAwesomeIcon {...props} />
            </span>
        );
    }

    return <FontAwesomeIcon {...props} />;
}, (prev, next) => iconEqual(prev.value, next.value));
