/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";

export interface EventAxisProps {
    startDate: Date;
    endDate: Date;
    width: number;
    height: number;
}

const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

export const generateDateTicks = (startDate: Date, endDate: Date, maxTicks: number = 8): Date[] => {
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const tickInterval = Math.max(1, Math.ceil(totalDays / maxTicks));

    const ticks: Date[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
        ticks.push(new Date(current));
        current.setDate(current.getDate() + tickInterval);
    }

    return ticks;
};

export const getDatePosition = (date: Date, startDate: Date, endDate: Date, width: number): number => {
    const totalTimeDiff = endDate.getTime() - startDate.getTime();
    const currentTimeDiff = date.getTime() - startDate.getTime();
    const ratio = currentTimeDiff / totalTimeDiff;
    return ratio * width;
};

// Label width estimate for edge detection
const LABEL_HALF_WIDTH = 40;

export const EventAxis = ({
    startDate,
    endDate,
    width,
    height,
}: EventAxisProps) => {
    const ticks = useMemo(() => {
        const dates = generateDateTicks(startDate, endDate, Math.floor(width / 100));

        return dates
            .map((date, index) => {
                const x = getDatePosition(date, startDate, endDate, width);
                // Only include if the label won't be cut off at edges
                if (x >= LABEL_HALF_WIDTH && x <= width - LABEL_HALF_WIDTH) {
                    return { date, x, index };
                }
                return null;
            })
            .filter(Boolean) as { date: Date; x: number; index: number }[];
    }, [startDate, endDate, width]);

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
            {ticks.map(({ date, x, index }) => (
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
                        {formatDate(date)}
                    </Text>
                </Box>
            ))}
        </HStack>
    );
};
