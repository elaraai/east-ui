/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo, useState, useCallback } from "react";
import { Text, useToken } from "@chakra-ui/react";
import type { ValueTypeOf } from "@elaraai/east";
import type { Gantt } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

export type GanttMilestoneValue = ValueTypeOf<typeof Gantt.Types.Milestone>;

export interface GanttMilestoneProps {
    x: number;
    y: number;
    height: number;
    value: GanttMilestoneValue;
    onClick?: () => void;
}

const makeDiamondPoints = (x: number, y: number, size: number): string => {
    const centerX = x;
    const centerY = y + size / 2;
    return `${centerX},${y} ${centerX + size / 2},${centerY} ${centerX},${y + size} ${centerX - size / 2},${centerY}`;
};

export const GanttMilestone = ({
    x,
    y,
    height,
    value,
    onClick,
}: GanttMilestoneProps) => {
    const [isHovered, setIsHovered] = useState(false);

    // Get color palette from value or default to blue
    const { colorPalette, label } = useMemo(() => ({
        colorPalette: getSomeorUndefined(value.colorPalette)?.type ?? "blue",
        label: getSomeorUndefined(value.label),
    }), [value]);

    // Get Chakra color tokens based on color palette
    const [fillColor, strokeColor] = useToken("colors", [
        `${colorPalette}.500`,
        `${colorPalette}.600`,
    ]);

    const fontSize = useMemo(() => Math.min(height * 0.7, 14), [height]);
    const diamondSize = useMemo(() => height, [height]);
    const textX = useMemo(() => x + diamondSize / 2 + 4, [x, diamondSize]);
    const diamondPoints = useMemo(() => makeDiamondPoints(x, y, diamondSize), [x, y, diamondSize]);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    return (
        <g>
            {/* Diamond shape */}
            <polygon
                points={diamondPoints}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isHovered ? 3 : 2}
                opacity={isHovered ? 1 : 0.9}
                onClick={onClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: onClick ? "pointer" : "default" }}
            />

            {/* Label */}
            {label && (
                <foreignObject
                    x={textX}
                    y={y}
                    width={200}
                    height={height}
                    style={{ pointerEvents: "auto" }}
                >
                    <Text
                        fontSize={`${fontSize}px`}
                        color="fg.default"
                        opacity={isHovered ? 1 : 0.9}
                        whiteSpace="nowrap"
                        cursor={onClick ? "pointer" : "default"}
                        userSelect="none"
                        lineHeight="1"
                        display="flex"
                        alignItems="center"
                        height="100%"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={onClick}
                        m={0}
                        p={0}
                    >
                        {label}
                    </Text>
                </foreignObject>
            )}
        </g>
    );
};
