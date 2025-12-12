/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback, type ChangeEvent, type FocusEvent, type KeyboardEvent } from "react";
import { Input as ChakraInput, type InputProps, Box } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Input } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { CalendarDate, Time, type DateValue } from "@internationalized/date";
import {
    CompoundDateField,
    CompoundDateInput,
    CompoundDateSegment,
    TimeField,
    TimeInput,
    TimeSegment,
} from "./date";


const stringInputEqual = equalFor(Input.Types.String);
/** East StringInput value type */
export type StringInputValue = ValueTypeOf<typeof Input.Types.String>;

/**
 * Converts an East UI StringInput value to Chakra UI Input props.
 */
export function toChakraStringInput(value: StringInputValue): InputProps {
    return {
        defaultValue: value.value,
        placeholder: getSomeorUndefined(value.placeholder),
        variant: getSomeorUndefined(value.variant)?.type,
        size: getSomeorUndefined(value.size)?.type,
        maxLength: getSomeorUndefined(value.maxLength) !== undefined ? Number(getSomeorUndefined(value.maxLength)) : undefined,
        pattern: getSomeorUndefined(value.pattern),
        disabled: getSomeorUndefined(value.disabled),
    };
}


export interface EastChakraStringInputProps {
    value: StringInputValue;
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


    return <ChakraInput
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
    />
}, (prev, next) => stringInputEqual(prev.value, next.value));

const integerInputEqual = equalFor(Input.Types.Integer);

/** East IntegerInput value type */
export type IntegerInputValue = ValueTypeOf<typeof Input.Types.Integer>;


/**
 * Converts an East UI IntegerInput value to Chakra UI Input props.
 */
export function toChakraIntegerInput(value: IntegerInputValue): InputProps {
    return {
        type: "number",
        defaultValue: value.value.toString(),
        min: getSomeorUndefined(value.min) !== undefined ? Number(getSomeorUndefined(value.min)) : undefined,
        max: getSomeorUndefined(value.max) !== undefined ? Number(getSomeorUndefined(value.max)) : undefined,
        step: getSomeorUndefined(value.step) !== undefined ? Number(getSomeorUndefined(value.step)) : 1,
        variant: getSomeorUndefined(value.variant)?.type,
        size: getSomeorUndefined(value.size)?.type,
        disabled: getSomeorUndefined(value.disabled),
    };
}

export interface EastChakraIntegerInputProps {
    value: IntegerInputValue;
}


/**
 * Renders an East UI IntegerInput value using Chakra UI Input component.
 */
export const EastChakraIntegerInput = memo(function EastChakraIntegerInput({ value }: EastChakraIntegerInputProps) {
    const props = useMemo(() => toChakraIntegerInput(value), [value]);
    const onChangeFn = useMemo(() => getSomeorUndefined(value.onChange), [value.onChange]);
    const onBlurFn = useMemo(() => getSomeorUndefined(value.onBlur), [value.onBlur]);
    const onFocusFn = useMemo(() => getSomeorUndefined(value.onFocus), [value.onFocus]);

    // Prevent invalid characters for integers (only digits, minus, and control keys)
    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        // Allow: backspace, delete, tab, escape, enter, arrows
        if (["Backspace", "Delete", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
            return;
        }
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) {
            return;
        }
        // Allow: minus at start only
        if (e.key === "-" && e.currentTarget.selectionStart === 0 && !e.currentTarget.value.includes("-")) {
            return;
        }
        // Allow: digits 0-9
        if (/^\d$/.test(e.key)) {
            return;
        }
        // Block everything else (including ".", "e", etc.)
        e.preventDefault();
    }, []);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (onChangeFn) {
            const raw = e.target.value;
            // Only call onChange for valid integers (handles "-" while typing)
            if (raw === "" || raw === "-") return;
            try {
                const parsed = BigInt(raw);
                queueMicrotask(() => onChangeFn(parsed));
            } catch {
                // Invalid integer, don't call onChange
            }
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
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
        />
    );
}, (prev, next) => integerInputEqual(prev.value, next.value));


const floatInputEqual = equalFor(Input.Types.Float);

/** East FloatInput value type */
export type FloatInputValue = ValueTypeOf<typeof Input.Types.Float>;


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
        defaultValue: displayValue,
        min: getSomeorUndefined(value.min),
        max: getSomeorUndefined(value.max),
        step: getSomeorUndefined(value.step) ?? "any",
        variant: getSomeorUndefined(value.variant)?.type,
        size: getSomeorUndefined(value.size)?.type,
        disabled: getSomeorUndefined(value.disabled),
    };
}

export interface EastChakraFloatInputProps {
    value: FloatInputValue;
}


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
            const raw = e.target.value;
            // Only call onChange for valid floats (handles "-" or "." while typing)
            if (raw === "" || raw === "-" || raw === "." || raw === "-.") return;
            const parsed = parseFloat(raw);
            if (!Number.isNaN(parsed)) {
                queueMicrotask(() => onChangeFn(parsed));
            }
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
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
        />
    );
}, (prev, next) => floatInputEqual(prev.value, next.value));


// Pre-define equality functions at module level
const dateTimeInputEqual = equalFor(Input.Types.DateTime);

/** East DateTimeInput value type */
export type DateTimeInputValue = ValueTypeOf<typeof Input.Types.DateTime>;

/**
 * Converts a JS Date (UTC) to a CalendarDate for the date field components.
 * East dates are UTC, so we use UTC methods.
 */
function dateToCalendarDate(date: Date): CalendarDate {
    return new CalendarDate(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1, // CalendarDate months are 1-indexed
        date.getUTCDate()
    );
}

/**
 * Converts a JS Date (UTC) to a Time for the time field components.
 * East dates are UTC, so we use UTC methods.
 */
function dateToTime(date: Date): Time {
    return new Time(
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
    );
}

/**
 * Converts a DateValue and optional Time back to a JS Date (UTC).
 * East dates are UTC, so we create a UTC date.
 */
function dateValueToDate(dateValue: DateValue, time?: Time): Date {
    return new Date(Date.UTC(
        dateValue.year,
        dateValue.month - 1, // JS Date months are 0-indexed
        dateValue.day,
        time?.hour ?? 0,
        time?.minute ?? 0,
        time?.second ?? 0
    ));
}

/** Props returned by toChakraDateTimeInput for memoization */
export interface ChakraDateTimeInputProps {
    calendarDate: CalendarDate;
    timeValue: Time;
    precision: "date" | "time" | "datetime";
    disabled: boolean;
}

/**
 * Converts an East UI DateTimeInput value to props for the compound date field components.
 * Use with useMemo for performance optimization.
 */
export function toChakraDateTimeInput(value: DateTimeInputValue): ChakraDateTimeInputProps {
    const dateValue = value.value instanceof Date ? value.value : new Date(value.value);
    return {
        calendarDate: dateToCalendarDate(dateValue),
        timeValue: dateToTime(dateValue),
        precision: (getSomeorUndefined(value.precision)?.type as "date" | "time" | "datetime") ?? "datetime",
        disabled: getSomeorUndefined(value.disabled) ?? false,
    };
}

export interface EastChakraDateTimeInputProps {
    value: DateTimeInputValue;
}

/**
 * Renders an East UI DateTimeInput value using compound date field components.
 * Supports date-only, time-only, and datetime modes based on the precision property.
 */
export const EastChakraDateTimeInput = memo(function EastChakraDateTimeInput({ value }: EastChakraDateTimeInputProps) {
    const props = useMemo(() => toChakraDateTimeInput(value), [value]);
    const onChangeFn = useMemo(() => getSomeorUndefined(value.onChange), [value.onChange]);

    // Handle date change
    const handleDateChange = useCallback((newDate: DateValue | null) => {
        if (onChangeFn && newDate) {
            const currentTime = props.precision === "date" ? undefined : props.timeValue;
            queueMicrotask(() => onChangeFn(dateValueToDate(newDate, currentTime)));
        }
    }, [onChangeFn, props.timeValue, props.precision]);

    // Handle time change
    const handleTimeChange = useCallback((newTime: Time | null) => {
        if (onChangeFn && newTime) {
            queueMicrotask(() => onChangeFn(dateValueToDate(props.calendarDate, newTime)));
        }
    }, [onChangeFn, props.calendarDate]);

    // Render based on precision
    if (props.precision === "time") {
        return (
            <TimeField value={props.timeValue} onChange={handleTimeChange} isReadOnly={props.disabled}>
                <TimeInput>
                    {({ segment }) => <TimeSegment segment={segment} />}
                </TimeInput>
            </TimeField>
        );
    }

    if (props.precision === "date") {
        return (
            <CompoundDateField value={props.calendarDate} onChange={handleDateChange} isReadOnly={props.disabled}>
                <CompoundDateInput>
                    {({ segment }) => <CompoundDateSegment segment={segment} />}
                </CompoundDateInput>
            </CompoundDateField>
        );
    }

    // Default: datetime (both date and time)
    return (
        <Box display="flex" alignItems="center" gap={2}>
            <CompoundDateField value={props.calendarDate} onChange={handleDateChange} isReadOnly={props.disabled}>
                <CompoundDateInput>
                    {({ segment }) => <CompoundDateSegment segment={segment} />}
                </CompoundDateInput>
            </CompoundDateField>
            <TimeField value={props.timeValue} onChange={handleTimeChange} isReadOnly={props.disabled}>
                <TimeInput>
                    {({ segment }) => <TimeSegment segment={segment} />}
                </TimeInput>
            </TimeField>
        </Box>
    );
}, (prev, next) => dateTimeInputEqual(prev.value, next.value));
