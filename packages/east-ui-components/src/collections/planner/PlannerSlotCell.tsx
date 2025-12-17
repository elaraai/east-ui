/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useState, useCallback, useMemo } from "react";

export interface PlannerSlotCellProps {
    x: number;
    y: number;
    width: number;
    height: number;
    slot: bigint;
    onClick?: ((slot: bigint) => void) | undefined;
}

export const PlannerSlotCell = ({
    x,
    y,
    width,
    height,
    slot,
    onClick,
}: PlannerSlotCellProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);
    const handleClick = useCallback(() => {
        if (onClick) onClick(slot);
    }, [onClick, slot]);

    // Plus icon dimensions - half the cell height
    const iconSize = useMemo(() => Math.min(height * 0.5, 24), [height]);
    const iconX = useMemo(() => x + (width - iconSize) / 2, [x, width, iconSize]);
    const iconY = useMemo(() => y + (height - iconSize) / 2, [y, height, iconSize]);

    return (
        <g>
            {/* Invisible hit area for the whole slot */}
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="transparent"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                style={{ cursor: isHovered ? "pointer" : "default" }}
            />

            {/* Plus icon - only visible on hover */}
            {isHovered && (
                <g
                    transform={`translate(${iconX}, ${iconY})`}
                    style={{ pointerEvents: "none" }}
                >
                    {/* Horizontal line of plus */}
                    <line
                        x1={iconSize * 0.25}
                        y1={iconSize / 2}
                        x2={iconSize * 0.75}
                        y2={iconSize / 2}
                        stroke="gray"
                        strokeWidth={2}
                        strokeLinecap="round"
                    />
                    {/* Vertical line of plus */}
                    <line
                        x1={iconSize / 2}
                        y1={iconSize * 0.25}
                        x2={iconSize / 2}
                        y2={iconSize * 0.75}
                        stroke="gray"
                        strokeWidth={2}
                        strokeLinecap="round"
                    />
                </g>
            )}
        </g>
    );
};
