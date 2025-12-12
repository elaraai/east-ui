import { useRef } from 'react';
import { useDateField, useDateSegment } from '@react-aria/datepicker';
import { useDateFieldState } from '@react-stately/datepicker';
import { createCalendar } from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';
import type { DateFieldState, DateSegment as DateSegmentType } from '@react-stately/datepicker';
import type { AriaDateFieldProps } from '@react-aria/datepicker';
import type { DateValue } from '@internationalized/date';

interface DateSegmentProps {
    segment: DateSegmentType;
    state: DateFieldState;
}

interface DateFieldProps extends AriaDateFieldProps<DateValue> {
    label?: string;
    description?: string;
}

// Individual segment component
function DateSegment({ segment, state }: DateSegmentProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { segmentProps } = useDateSegment(segment, state, ref);

    return (
        <div
            {...segmentProps}
            ref={ref}
            style={{
                ...segmentProps.style,
                minWidth: segment.maxValue != null ? String(segment.maxValue).length + 'ch' : undefined,
                textAlign: 'end',
                padding: '0 2px',
                borderRadius: '3px',
                backgroundColor: segment.isPlaceholder ? '#f0f0f0' : 'transparent',
                outline: 'none',
                color: segment.isPlaceholder ? '#666' : 'black'
            }}
        >
            {segment.text}
        </div>
    );
}

// Main DateField component
export function DateField(props: DateFieldProps) {
    const { locale } = useLocale();
    const state = useDateFieldState({
        ...props,
        locale,
        createCalendar
    });

    const ref = useRef<HTMLDivElement>(null);
    const { labelProps, fieldProps, descriptionProps } = useDateField(props, state, ref);

    return (
        <div>
            <span {...labelProps}>{props.label}</span>
            <div
                {...fieldProps}
                ref={ref}
                style={{
                    display: 'flex',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    // padding: '4px',
                    minWidth: '150px'
                }}
            >
                {state.segments.map((segment, i) => (
                    <DateSegment key={i} segment={segment} state={state} />
                ))}
                {state.isInvalid && <span style={{ color: 'red' }}>🚫</span>}
            </div>
            {props.description && <div {...descriptionProps}>{props.description}</div>}
        </div>
    );
}