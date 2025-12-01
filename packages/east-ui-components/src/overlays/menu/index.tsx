/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { memo, useMemo } from "react";
import { Menu as ChakraMenu, Portal } from "@chakra-ui/react";
import { equalFor, match, type ValueTypeOf } from "@elaraai/east";
import { Menu } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define equality function at module level
const menuEqual = equalFor(Menu.Types.Menu);

/** East Menu value type */
export type MenuValue = ValueTypeOf<typeof Menu.Types.Menu>;

/** East MenuItem value type */
export type MenuItemValue = ValueTypeOf<typeof Menu.Types.Item>;

export interface EastChakraMenuProps {
    value: MenuValue;
}

/**
 * Renders an East UI Menu value using Chakra UI Menu component.
 */
export const EastChakraMenu = memo(function EastChakraMenu({ value }: EastChakraMenuProps) {
    const placement = useMemo(() => getSomeorUndefined(value.placement)?.type, [value.placement]);

    return (
        <ChakraMenu.Root positioning={placement ? { placement } : undefined}>
            <ChakraMenu.Trigger asChild>
                <span>
                    <EastChakraComponent value={value.trigger} />
                </span>
            </ChakraMenu.Trigger>
            <Portal>
                <ChakraMenu.Positioner>
                    <ChakraMenu.Content>
                        {value.items.map((item, index) =>
                            match(item, {
                                Item: (v) => (
                                    <ChakraMenu.Item
                                        key={index}
                                        value={v.value}
                                        disabled={getSomeorUndefined(v.disabled)}
                                    >
                                        {v.label}
                                    </ChakraMenu.Item>
                                ),
                                Separator: () => <ChakraMenu.Separator key={index} />,
                            })
                        )}
                    </ChakraMenu.Content>
                </ChakraMenu.Positioner>
            </Portal>
        </ChakraMenu.Root>
    );
}, (prev, next) => menuEqual(prev.value, next.value));
