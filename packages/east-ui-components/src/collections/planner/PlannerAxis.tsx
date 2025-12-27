/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";

export interface PlannerAxisProps {
    startSlot: number;
    endSlot: number;
    width: number;
    height: number;
    slotWidth: number;
    /** Optional function to format slot labels */
    getSlotLabel?: (slot: number) => string;
}

const defaultFormatSlot = (slot: number): string => {
    return String(slot);
};

export const getSlotPosition = (slot: number, startSlot: number, slotWidth: number): number => {
    const slotIndex = slot - startSlot;
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
        const totalSlots = Math.floor(endSlot - startSlot) + 1;
        const result: { slot: number; x: number; index: number }[] = [];

        // Calculate how many slots we can show labels for
        // Show fewer labels if slots are very narrow
        for (let i = 0; i < totalSlots; i += 1) {
            const slot = startSlot + i;
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
