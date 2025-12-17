/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";

export interface PlannerAxisProps {
    startSlot: bigint;
    endSlot: bigint;
    width: number;
    height: number;
    slotWidth: number;
    /** Optional function to format slot labels */
    getSlotLabel?: (slot: bigint) => string;
}

const defaultFormatSlot = (slot: bigint): string => {
    return String(slot);
};

export const getSlotPosition = (slot: bigint, startSlot: bigint, slotWidth: number): number => {
    const slotIndex = Number(slot - startSlot);
    return slotIndex * slotWidth + slotWidth / 2; // Center of the slot
};

// Label width estimate for edge detection
const LABEL_HALF_WIDTH = 30;

export const PlannerAxis = ({
    startSlot,
    endSlot,
    width,
    height,
    slotWidth,
    getSlotLabel,
}: PlannerAxisProps) => {
    const formatSlot = getSlotLabel ?? defaultFormatSlot;

    const ticks = useMemo(() => {
        const totalSlots = Number(endSlot - startSlot) + 1;
        const result: { slot: bigint; x: number; index: number }[] = [];

        // Calculate how many slots we can show labels for
        // Show fewer labels if slots are very narrow
        const minLabelSpacing = 60; // Minimum pixels between labels
        const labelInterval = Math.max(1, Math.ceil(minLabelSpacing / slotWidth));

        for (let i = 0; i < totalSlots; i += labelInterval) {
            const slot = startSlot + BigInt(i);
            const x = getSlotPosition(slot, startSlot, slotWidth);

            // Only include if the label won't be cut off at edges
            if (x >= LABEL_HALF_WIDTH && x <= width - LABEL_HALF_WIDTH) {
                result.push({ slot, x, index: i });
            }
        }

        return result;
    }, [startSlot, endSlot, width, slotWidth]);

    return (
        <HStack
            position="relative"
            width="100%"
            height={`${height}px`}
            px="3"
            alignItems="center"
            borderBottomWidth="1px"
            borderColor="border.muted"
            gap={0}
        >
            {ticks.map(({ slot, x, index }) => (
                <Box
                    key={`tick-${index}`}
                    position="absolute"
                    left={`${x}px`}
                    transform="translateX(-50%)"
                >
                    <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        color="fg.default"
                        whiteSpace="nowrap"
                    >
                        {formatSlot(slot)}
                    </Text>
                </Box>
            ))}
        </HStack>
    );
};
