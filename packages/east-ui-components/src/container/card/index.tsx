/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
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
    };
}

export interface EastChakraCardProps {
    value: CardValue;
}

/**
 * Renders an East UI Card value using Chakra UI Card component.
 */
export const EastChakraCard = memo(function EastChakraCard({ value }: EastChakraCardProps) {
    const props = useMemo(() => toChakraCard(value), [value]);
    const title = useMemo(() => getSomeorUndefined(value.title), [value.title]);
    const description = useMemo(() => getSomeorUndefined(value.description), [value.description]);

    return (
        <ChakraCard.Root {...props}>
            {(title || description) && (
                <ChakraCard.Header>
                    {title && <ChakraCard.Title>{title}</ChakraCard.Title>}
                    {description && <ChakraCard.Description>{description}</ChakraCard.Description>}
                </ChakraCard.Header>
            )}
            <ChakraCard.Body>
                {value.body.map((child, index) => (
                    <EastChakraComponent key={index} value={child} />
                ))}
            </ChakraCard.Body>
        </ChakraCard.Root>
    );
}, (prev, next) => cardEqual(prev.value, next.value));
