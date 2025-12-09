/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useMemo, useState, useCallback } from "react";
import { Text, useToken } from "@chakra-ui/react";
import type { ValueTypeOf } from "@elaraai/east";
import type { Gantt } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

export type GanttTaskValue = ValueTypeOf<typeof Gantt.Types.Task>;

export interface GanttTaskProps {
    x: number;
    y: number;
    width: number;
    height: number;
    value: GanttTaskValue;
    onClick?: (() => void) | undefined;
    onDoubleClick?: (() => void) | undefined;
}

export const GanttTask = ({
    x,
    y,
    width,
    height,
    value,
    onClick,
    onDoubleClick,
}: GanttTaskProps) => {
    const [isHovered, setIsHovered] = useState(false);

    // Get color palette from value or default to blue
    const { colorPalette, label, progress } = useMemo(() => ({
        colorPalette: getSomeorUndefined(value.colorPalette)?.type ?? "blue",
        label: getSomeorUndefined(value.label),
        progress: getSomeorUndefined(value.progress),
    }), [value]);

    // Get Chakra color tokens based on color palette
    const [fillColor, strokeColor] = useToken("colors", [
        `${colorPalette}.500`,
        `${colorPalette}.600`,
    ]);

    const fontSize = useMemo(() => Math.min(height * 0.7, 14), [height]);
    const textX = useMemo(() => x + 8, [x]);
    const taskWidth = useMemo(() => Math.max(width, 4), [width]);
    const progressWidth = useMemo(() => taskWidth * ((progress ?? 0) / 100), [taskWidth, progress]);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    return (
        <g>
            {/* Task bar */}
            <rect
                x={x}
                y={y}
                width={taskWidth}
                height={height}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isHovered ? 3 : 2}
                opacity={isHovered ? 1 : 0.9}
                rx={4}
                ry={4}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: onClick || onDoubleClick ? "pointer" : "default" }}
            />

            {/* Progress indicator */}
            {progress !== undefined && (
                <rect
                    x={x}
                    y={y}
                    width={progressWidth}
                    height={height}
                    fill="rgba(255,255,255,0.3)"
                    rx={4}
                    ry={4}
                    style={{ pointerEvents: "none" }}
                />
            )}

            {/* Label */}
            {label && (
                <foreignObject
                    x={textX}
                    y={y}
                    width={180}
                    height={height}
                    style={{ pointerEvents: "auto" }}
                >
                    <Text
                        fontSize={`${fontSize}px`}
                        color="fg.default"
                        opacity={isHovered ? 1 : 0.9}
                        whiteSpace="nowrap"
                        cursor={onClick || onDoubleClick ? "pointer" : "default"}
                        userSelect="none"
                        lineHeight="1"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        display="flex"
                        alignItems="center"
                        height="100%"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={onClick}
                        onDoubleClick={onDoubleClick}
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
