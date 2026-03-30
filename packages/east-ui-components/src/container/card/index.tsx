/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback } from "react";
import { Card as ChakraCard, type CardRootProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Card } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define equality function at module level
const cardEqual = equalFor(Card.Types.Card);

/** East Card value type */
export type CardValue = ValueTypeOf<typeof Card.Types.Card>;

/**
 * Converts an East UI Card value to Chakra UI Card props.
 * Pure function - easy to test independently.
 */
export function toChakraCard(value: CardValue): CardRootProps {
    const style = getSomeorUndefined(value.style);

    return {
        variant: style ? getSomeorUndefined(style.variant)?.type : undefined,
        size: style ? getSomeorUndefined(style.size)?.type as CardRootProps["size"] : undefined,
        height: style ? getSomeorUndefined(style.height) : undefined,
        minHeight: style ? getSomeorUndefined(style.minHeight) : undefined,
        maxHeight: style ? getSomeorUndefined(style.maxHeight) : undefined,
        width: style ? getSomeorUndefined(style.width) : undefined,
        minWidth: style ? getSomeorUndefined(style.minWidth) : undefined,
        maxWidth: style ? getSomeorUndefined(style.maxWidth) : undefined,
        flex: style ? getSomeorUndefined(style.flex) : undefined,
        overflow: style ? getSomeorUndefined(style.overflow)?.type : undefined,
    };
}

export interface EastChakraCardProps {
    value: CardValue;
    storageKey: string;
}

/**
 * Renders an East UI Card value using Chakra UI Card component.
 */
export const EastChakraCard = memo(function EastChakraCard({ value, storageKey }: EastChakraCardProps) {
    const props = useMemo(() => toChakraCard(value), [value]);
    const header = useMemo(() => getSomeorUndefined(value.header), [value.header]);
    const footer = useMemo(() => getSomeorUndefined(value.footer), [value.footer]);

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
        <ChakraCard.Root {...props} onClick={onClickFn ? handleClick : undefined} cursor={onClickFn ? "pointer" : undefined}>
            {header && (
                <ChakraCard.Header>
                    <EastChakraComponent value={header} storageKey={`${storageKey}.header`} />
                </ChakraCard.Header>
            )}
            <ChakraCard.Body>
                {value.body.map((child, index) => (
                    <EastChakraComponent key={index} value={child} storageKey={`${storageKey}.${index}`} />
                ))}
            </ChakraCard.Body>
            {footer && (
                <ChakraCard.Footer>
                    <EastChakraComponent value={footer} storageKey={`${storageKey}.footer`} />
                </ChakraCard.Footer>
            )}
        </ChakraCard.Root>
    );
}, (prev, next) => cardEqual(prev.value, next.value) && prev.storageKey === next.storageKey);
