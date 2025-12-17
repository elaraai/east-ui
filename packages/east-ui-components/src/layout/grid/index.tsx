/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Grid as ChakraGrid, GridItem as ChakraGridItem, type GridProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Grid } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

/**
 * Parses a grid position string to number | "auto" for Chakra GridItem.
 */
function parseGridPosition(value: string | undefined): number | "auto" | undefined {
    if (value === undefined) return undefined;
    if (value === "auto") return "auto";
    const num = parseInt(value, 10);
    return isNaN(num) ? undefined : num;
}

// Pre-define the equality function at module level
const gridEqual = equalFor(Grid.Types.Grid);

/** East Grid value type */
export type GridValue = ValueTypeOf<typeof Grid.Types.Grid>;


/**
 * Converts an East UI Grid value to Chakra UI Grid props.
 * Pure function - easy to test independently.
 *
 * @param value - The East Grid value
 * @returns Chakra Grid props
 */
export function toChakraGrid(value: GridValue): GridProps {
    const style = getSomeorUndefined(value.style);

    // autoFlow values are now CSS-compatible (e.g., "row dense")
    const autoFlow = style ? getSomeorUndefined(style.autoFlow)?.type : undefined;

    // Parse padding struct to Chakra padding props
    const padding = style ? getSomeorUndefined(style.padding) : undefined;
    const paddingProps = padding ? {
        paddingTop: getSomeorUndefined(padding.top),
        paddingRight: getSomeorUndefined(padding.right),
        paddingBottom: getSomeorUndefined(padding.bottom),
        paddingLeft: getSomeorUndefined(padding.left),
    } : {};

    return {
        width: style ? getSomeorUndefined(style.width) : undefined,
        height: style ? getSomeorUndefined(style.height) : undefined,
        minHeight: style ? getSomeorUndefined(style.minHeight) : undefined,
        minWidth: style ? getSomeorUndefined(style.minWidth) : undefined,
        maxHeight: style ? getSomeorUndefined(style.maxHeight) : undefined,
        maxWidth: style ? getSomeorUndefined(style.maxWidth) : undefined,
        ...paddingProps,
        templateColumns: style ? getSomeorUndefined(style.templateColumns) : undefined,
        templateRows: style ? getSomeorUndefined(style.templateRows) : undefined,
        templateAreas: style ? getSomeorUndefined(style.templateAreas) : undefined,
        gap: style ? getSomeorUndefined(style.gap) : undefined,
        columnGap: style ? getSomeorUndefined(style.columnGap) : undefined,
        rowGap: style ? getSomeorUndefined(style.rowGap) : undefined,
        justifyItems: style ? getSomeorUndefined(style.justifyItems)?.type : undefined,
        alignItems: style ? getSomeorUndefined(style.alignItems)?.type : undefined,
        justifyContent: style ? getSomeorUndefined(style.justifyContent)?.type : undefined,
        alignContent: style ? getSomeorUndefined(style.alignContent)?.type : undefined,
        autoColumns: style ? getSomeorUndefined(style.autoColumns) : undefined,
        autoRows: style ? getSomeorUndefined(style.autoRows) : undefined,
        autoFlow,
    };
}

export interface EastChakraGridProps {
    value: GridValue;
}

/**
 * Renders an East UI Grid value using Chakra UI Grid component.
 */
export const EastChakraGrid = memo(function EastChakraGrid({ value }: EastChakraGridProps) {
    const props = useMemo(() => toChakraGrid(value), [value]);

    return (
        <ChakraGrid {...props}>
            {value.items.map((item, index) => (
                <ChakraGridItem
                    key={index}
                    colSpan={getSomeorUndefined(item.colSpan) ? parseInt(getSomeorUndefined(item.colSpan)!) : undefined}
                    rowSpan={getSomeorUndefined(item.rowSpan) ? parseInt(getSomeorUndefined(item.rowSpan)!) : undefined}
                    colStart={parseGridPosition(getSomeorUndefined(item.colStart))}
                    colEnd={parseGridPosition(getSomeorUndefined(item.colEnd))}
                    rowStart={parseGridPosition(getSomeorUndefined(item.rowStart))}
                    rowEnd={parseGridPosition(getSomeorUndefined(item.rowEnd))}
                >
                    <EastChakraComponent value={item.content} />
                </ChakraGridItem>
            ))}
        </ChakraGrid>
    );
}, (prev, next) => gridEqual(prev.value, next.value));
