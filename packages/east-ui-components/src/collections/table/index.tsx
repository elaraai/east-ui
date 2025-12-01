/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import {
    Table as ChakraTable,
    type TableRootProps,
} from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Table } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define equality function at module level
const tableRootEqual = equalFor(Table.Types.Root);

/** East Table Root value type */
export type TableRootValue = ValueTypeOf<typeof Table.Types.Root>;

/** East Table Column value type */
export type TableColumnValue = ValueTypeOf<typeof Table.Types.Column>;

/**
 * Converts an East UI Table Root value to Chakra UI TableRoot props.
 * Pure function - easy to test independently.
 */
export function toChakraTableRoot(value: TableRootValue): TableRootProps {
    const style = getSomeorUndefined(value.style);

    return {
        variant: style ? getSomeorUndefined(style.variant)?.type : undefined,
        size: style ? getSomeorUndefined(style.size)?.type : undefined,
        striped: style ? getSomeorUndefined(style.striped) : undefined,
        interactive: style ? getSomeorUndefined(style.interactive) : undefined,
        stickyHeader: style ? getSomeorUndefined(style.stickyHeader) : undefined,
        showColumnBorder: style ? getSomeorUndefined(style.showColumnBorder) : undefined,
        colorPalette: style ? getSomeorUndefined(style.colorPalette)?.type : undefined,
    };
}

export interface EastChakraTableProps {
    value: TableRootValue;
}

/**
 * Renders an East UI Table value using Chakra UI Table components.
 */
export const EastChakraTable = memo(function EastChakraTable({ value }: EastChakraTableProps) {
    const props = useMemo(() => toChakraTableRoot(value), [value]);

    return (
        <ChakraTable.Root {...props}>
            <ChakraTable.Header>
                <ChakraTable.Row>
                    {value.columns.map((col, index) => (
                        <ChakraTable.ColumnHeader key={col.key || index}>
                            {getSomeorUndefined(col.header) ?? col.key}
                        </ChakraTable.ColumnHeader>
                    ))}
                </ChakraTable.Row>
            </ChakraTable.Header>
            <ChakraTable.Body>
                {value.rows.map((row, rowIndex) => (
                    <ChakraTable.Row key={rowIndex}>
                        {value.columns.map((col) => {
                            const cellValue = row.get(col.key);
                            return (
                                <ChakraTable.Cell key={col.key}>
                                    {cellValue ? <EastChakraComponent value={cellValue ?? null} /> : null}
                                </ChakraTable.Cell>
                            );
                        })}
                    </ChakraTable.Row>
                ))}
            </ChakraTable.Body>
        </ChakraTable.Root>
    );
}, (prev, next) => tableRootEqual(prev.value, next.value));
