/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { Fragment, memo, useMemo, useCallback } from "react";
import { Breadcrumb as ChakraBreadcrumb } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Breadcrumb } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality functions at module level
const breadcrumbRootEqual = equalFor(Breadcrumb.Types.Root);
const breadcrumbItemEqual = equalFor(Breadcrumb.Types.Item);

/** East Breadcrumb root value type */
export type BreadcrumbRootValue = ValueTypeOf<typeof Breadcrumb.Types.Root>;

/** East Breadcrumb item value type */
export type BreadcrumbItemValue = ValueTypeOf<typeof Breadcrumb.Types.Item>;

export interface EastChakraBreadcrumbProps {
    value: BreadcrumbRootValue;
}

export interface EastChakraBreadcrumbItemProps {
    value: BreadcrumbItemValue;
}

/**
 * Renders a single breadcrumb item as either a link or current page indicator.
 */
const EastChakraBreadcrumbItem = memo(function EastChakraBreadcrumbItem({ value }: EastChakraBreadcrumbItemProps) {
    const isCurrent = useMemo(() => getSomeorUndefined(value.current) ?? false, [value]);
    const onClickFn = useMemo(() => getSomeorUndefined(value.onClick), [value]);

    const handleClick = useCallback(() => {
        if (onClickFn) {
            queueMicrotask(() => onClickFn());
        }
    }, [onClickFn]);

    if (isCurrent) {
        return (
            <ChakraBreadcrumb.Item>
                <ChakraBreadcrumb.CurrentLink>
                    {value.label}
                </ChakraBreadcrumb.CurrentLink>
            </ChakraBreadcrumb.Item>
        );
    }

    return (
        <ChakraBreadcrumb.Item>
            <ChakraBreadcrumb.Link
                onClick={onClickFn ? handleClick : undefined}
                cursor={onClickFn ? "pointer" : undefined}
            >
                {value.label}
            </ChakraBreadcrumb.Link>
        </ChakraBreadcrumb.Item>
    );
}, (prev, next) => breadcrumbItemEqual(prev.value, next.value));

/**
 * Renders an East UI Breadcrumb value using Chakra UI Breadcrumb component.
 */
export const EastChakraBreadcrumb = memo(function EastChakraBreadcrumb({ value }: EastChakraBreadcrumbProps) {
    const variant = useMemo(() => getSomeorUndefined(value.variant)?.type, [value]);
    const size = useMemo(() => getSomeorUndefined(value.size)?.type, [value]);
    const colorPalette = useMemo(() => getSomeorUndefined(value.colorPalette)?.type, [value]);
    return (
        <ChakraBreadcrumb.Root
            variant={variant}
            size={size}
            colorPalette={colorPalette}
        >
            <ChakraBreadcrumb.List>
                {value.items.map((item, index) => (
                    <Fragment key={index}>
                        {index > 0 && <ChakraBreadcrumb.Separator />}
                        <EastChakraBreadcrumbItem value={item} />
                    </Fragment>
                ))}
            </ChakraBreadcrumb.List>
        </ChakraBreadcrumb.Root>
    );
}, (prev, next) => breadcrumbRootEqual(prev.value, next.value));
