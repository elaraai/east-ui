/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback, type ChangeEvent, type FocusEvent } from "react";
import { Input as ChakraInput, type InputProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Input } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality functions at module level
const stringInputEqual = equalFor(Input.Types.String);
const integerInputEqual = equalFor(Input.Types.Integer);
const floatInputEqual = equalFor(Input.Types.Float);
const dateTimeInputEqual = equalFor(Input.Types.DateTime);

/** East StringInput value type */
export type StringInputValue = ValueTypeOf<typeof Input.Types.String>;

/** East IntegerInput value type */
export type IntegerInputValue = ValueTypeOf<typeof Input.Types.Integer>;

/** East FloatInput value type */
export type FloatInputValue = ValueTypeOf<typeof Input.Types.Float>;

/** East DateTimeInput value type */
export type DateTimeInputValue = ValueTypeOf<typeof Input.Types.DateTime>;

/**
 * Converts an East UI StringInput value to Chakra UI Input props.
 */
export function toChakraStringInput(value: StringInputValue): InputProps {
    return {
        value: value.value,
        placeholder: getSomeorUndefined(value.placeholder),
        variant: getSomeorUndefined(value.variant)?.type,
        size: getSomeorUndefined(value.size)?.type,
        maxLength: getSomeorUndefined(value.maxLength) !== undefined
            ? Number(getSomeorUndefined(value.maxLength))
            : undefined,
        pattern: getSomeorUndefined(value.pattern),
        disabled: getSomeorUndefined(value.disabled),
    };
}

/**
 * Converts an East UI IntegerInput value to Chakra UI Input props.
 */
export function toChakraIntegerInput(value: IntegerInputValue): InputProps {
    return {
        type: "number",
        value: value.value.toString(),
        min: getSomeorUndefined(value.min) !== undefined
            ? Number(getSomeorUndefined(value.min))
            : undefined,
        max: getSomeorUndefined(value.max) !== undefined
            ? Number(getSomeorUndefined(value.max))
            : undefined,
        step: getSomeorUndefined(value.step) !== undefined
            ? Number(getSomeorUndefined(value.step))
            : 1,
        variant: getSomeorUndefined(value.variant)?.type,
        size: getSomeorUndefined(value.size)?.type,
        disabled: getSomeorUndefined(value.disabled),
    };
}

/**
 * Converts an East UI FloatInput value to Chakra UI Input props.
 */
export function toChakraFloatInput(value: FloatInputValue): InputProps {
    const precision = getSomeorUndefined(value.precision);
    const displayValue = precision !== undefined
        ? value.value.toFixed(Number(precision))
        : value.value.toString();

    return {
        type: "number",
        value: displayValue,
        min: getSomeorUndefined(value.min),
        max: getSomeorUndefined(value.max),
        step: getSomeorUndefined(value.step) ?? "any",
        variant: getSomeorUndefined(value.variant)?.type,
        size: getSomeorUndefined(value.size)?.type,
        disabled: getSomeorUndefined(value.disabled),
    };
}

/**
 * Formats a Date to local datetime-local or date input format.
 * Unlike toISOString(), this preserves the local timezone.
 */
function formatDateLocal(d: Date, includeTime: boolean): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    if (includeTime) {
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    return `${year}-${month}-${day}`;
}

/**
 * Converts an East UI DateTimeInput value to Chakra UI Input props.
 */
export function toChakraDateTimeInput(value: DateTimeInputValue): InputProps {
    const showTime = getSomeorUndefined(value.showTime);
    const dateValue = value.value instanceof Date ? value.value : new Date(value.value);

    return {
        type: showTime ? "datetime-local" : "date",
        value: formatDateLocal(dateValue, !!showTime),
        min: getSomeorUndefined(value.min)
            ? formatDateLocal(new Date(getSomeorUndefined(value.min)!), !!showTime)
            : undefined,
        max: getSomeorUndefined(value.max)
            ? formatDateLocal(new Date(getSomeorUndefined(value.max)!), !!showTime)
            : undefined,
        variant: getSomeorUndefined(value.variant)?.type,
        size: getSomeorUndefined(value.size)?.type,
        disabled: getSomeorUndefined(value.disabled),
    };
}

export interface EastChakraStringInputProps {
    value: StringInputValue;
}

export interface EastChakraIntegerInputProps {
    value: IntegerInputValue;
}

export interface EastChakraFloatInputProps {
    value: FloatInputValue;
}

export interface EastChakraDateTimeInputProps {
    value: DateTimeInputValue;
}

/**
 * Renders an East UI StringInput value using Chakra UI Input component.
 */
export const EastChakraStringInput = memo(function EastChakraStringInput({ value }: EastChakraStringInputProps) {
    const props = useMemo(() => toChakraStringInput(value), [value]);
    const onChangeFn = useMemo(() => getSomeorUndefined(value.onChange), [value.onChange]);
    const onBlurFn = useMemo(() => getSomeorUndefined(value.onBlur), [value.onBlur]);
    const onFocusFn = useMemo(() => getSomeorUndefined(value.onFocus), [value.onFocus]);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (onChangeFn) {
            queueMicrotask(() => onChangeFn(e.target.value));
        }
    }, [onChangeFn]);

    const handleBlur = useCallback((_e: FocusEvent<HTMLInputElement>) => {
        if (onBlurFn) {
            queueMicrotask(() => onBlurFn());
        }
    }, [onBlurFn]);

    const handleFocus = useCallback((_e: FocusEvent<HTMLInputElement>) => {
        if (onFocusFn) {
            queueMicrotask(() => onFocusFn());
        }
    }, [onFocusFn]);

    return (
        <ChakraInput
            {...props}
            onChange={onChangeFn ? handleChange : undefined}
            onBlur={onBlurFn ? handleBlur : undefined}
            onFocus={onFocusFn ? handleFocus : undefined}
        />
    );
}, (prev, next) => stringInputEqual(prev.value, next.value));

/**
 * Renders an East UI IntegerInput value using Chakra UI Input component.
 */
export const EastChakraIntegerInput = memo(function EastChakraIntegerInput({ value }: EastChakraIntegerInputProps) {
    const props = useMemo(() => toChakraIntegerInput(value), [value]);
    const onChangeFn = useMemo(() => getSomeorUndefined(value.onChange), [value.onChange]);
    const onBlurFn = useMemo(() => getSomeorUndefined(value.onBlur), [value.onBlur]);
    const onFocusFn = useMemo(() => getSomeorUndefined(value.onFocus), [value.onFocus]);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (onChangeFn) {
            queueMicrotask(() => onChangeFn(BigInt(e.target.value || "0")));
        }
    }, [onChangeFn]);

    const handleBlur = useCallback((_e: FocusEvent<HTMLInputElement>) => {
        if (onBlurFn) {
            queueMicrotask(() => onBlurFn());
        }
    }, [onBlurFn]);

    const handleFocus = useCallback((_e: FocusEvent<HTMLInputElement>) => {
        if (onFocusFn) {
            queueMicrotask(() => onFocusFn());
        }
    }, [onFocusFn]);

    return (
        <ChakraInput
            {...props}
            onChange={onChangeFn ? handleChange : undefined}
            onBlur={onBlurFn ? handleBlur : undefined}
            onFocus={onFocusFn ? handleFocus : undefined}
        />
    );
}, (prev, next) => integerInputEqual(prev.value, next.value));

/**
 * Renders an East UI FloatInput value using Chakra UI Input component.
 */
export const EastChakraFloatInput = memo(function EastChakraFloatInput({ value }: EastChakraFloatInputProps) {
    const props = useMemo(() => toChakraFloatInput(value), [value]);
    const onChangeFn = useMemo(() => getSomeorUndefined(value.onChange), [value.onChange]);
    const onBlurFn = useMemo(() => getSomeorUndefined(value.onBlur), [value.onBlur]);
    const onFocusFn = useMemo(() => getSomeorUndefined(value.onFocus), [value.onFocus]);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (onChangeFn) {
            queueMicrotask(() => onChangeFn(parseFloat(e.target.value) || 0));
        }
    }, [onChangeFn]);

    const handleBlur = useCallback((_e: FocusEvent<HTMLInputElement>) => {
        if (onBlurFn) {
            queueMicrotask(() => onBlurFn());
        }
    }, [onBlurFn]);

    const handleFocus = useCallback((_e: FocusEvent<HTMLInputElement>) => {
        if (onFocusFn) {
            queueMicrotask(() => onFocusFn());
        }
    }, [onFocusFn]);

    return (
        <ChakraInput
            {...props}
            onChange={onChangeFn ? handleChange : undefined}
            onBlur={onBlurFn ? handleBlur : undefined}
            onFocus={onFocusFn ? handleFocus : undefined}
        />
    );
}, (prev, next) => floatInputEqual(prev.value, next.value));

/**
 * Renders an East UI DateTimeInput value using Chakra UI Input component.
 */
export const EastChakraDateTimeInput = memo(function EastChakraDateTimeInput({ value }: EastChakraDateTimeInputProps) {
    const props = useMemo(() => toChakraDateTimeInput(value), [value]);
    const onChangeFn = useMemo(() => getSomeorUndefined(value.onChange), [value.onChange]);
    const onBlurFn = useMemo(() => getSomeorUndefined(value.onBlur), [value.onBlur]);
    const onFocusFn = useMemo(() => getSomeorUndefined(value.onFocus), [value.onFocus]);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (onChangeFn) {
            queueMicrotask(() => onChangeFn(new Date(e.target.value)));
        }
    }, [onChangeFn]);

    const handleBlur = useCallback((_e: FocusEvent<HTMLInputElement>) => {
        if (onBlurFn) {
            queueMicrotask(() => onBlurFn());
        }
    }, [onBlurFn]);

    const handleFocus = useCallback((_e: FocusEvent<HTMLInputElement>) => {
        if (onFocusFn) {
            queueMicrotask(() => onFocusFn());
        }
    }, [onFocusFn]);

    return (
        <ChakraInput
            {...props}
            onChange={onChangeFn ? handleChange : undefined}
            onBlur={onBlurFn ? handleBlur : undefined}
            onFocus={onFocusFn ? handleFocus : undefined}
        />
    );
}, (prev, next) => dateTimeInputEqual(prev.value, next.value));
