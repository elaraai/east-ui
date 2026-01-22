/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { Clipboard, Button, IconButton } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { CopyButton } from "@elaraai/east-ui";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import { getSomeorUndefined } from "../../utils";

// Pre-define the equality function at module level
const copyButtonEqual = equalFor(CopyButton.Types.CopyButton);

/** East CopyButton value type */
export type CopyButtonValue = ValueTypeOf<typeof CopyButton.Types.CopyButton>;

export interface EastChakraCopyButtonProps {
    value: CopyButtonValue;
}

/**
 * Renders an East UI CopyButton value using Chakra UI Clipboard component.
 */
export const EastChakraCopyButton = memo(function EastChakraCopyButton({ value }: EastChakraCopyButtonProps) {
    const style = useMemo(() => getSomeorUndefined(value.style), [value.style]);
    const label = useMemo(() => getSomeorUndefined(value.label), [value.label]);

    const buttonProps = useMemo(() => ({
        variant: style ? getSomeorUndefined(style.variant)?.type : undefined,
        colorPalette: style ? getSomeorUndefined(style.colorPalette)?.type : undefined,
        size: style ? getSomeorUndefined(style.size)?.type : undefined,
        disabled: style ? getSomeorUndefined(style.disabled) : undefined,
    }), [style]);

    const timeout = useMemo(() => {
        const t = style ? getSomeorUndefined(style.timeout) : undefined;
        return t ? parseInt(t, 10) : 2000;
    }, [style]);

    return (
        <Clipboard.Root value={value.value} timeout={timeout}>
            <Clipboard.Trigger asChild>
                {label ? (
                    <Button {...buttonProps}>
                        <Clipboard.Indicator copied={<FontAwesomeIcon icon={faCheck} />}>
                            <FontAwesomeIcon icon={faCopy} />
                        </Clipboard.Indicator>
                        {label}
                    </Button>
                ) : (
                    <IconButton {...buttonProps} aria-label="Copy to clipboard">
                        <Clipboard.Indicator copied={<FontAwesomeIcon icon={faCheck} />}>
                            <FontAwesomeIcon icon={faCopy} />
                        </Clipboard.Indicator>
                    </IconButton>
                )}
            </Clipboard.Trigger>
        </Clipboard.Root>
    );
}, (prev, next) => copyButtonEqual(prev.value, next.value));
