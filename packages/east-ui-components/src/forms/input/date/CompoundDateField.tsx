import React, { useRef, useMemo } from 'react';
import { Box, Text, useToken } from '@chakra-ui/react';
import { useDateField, useDateSegment } from '@react-aria/datepicker';
import { useDateFieldState } from '@react-stately/datepicker';
import { createCalendar } from '@internationalized/date';
import type { DateFieldState, DateSegment as DateSegmentType } from '@react-stately/datepicker';
import type { AriaDateFieldProps } from '@react-aria/datepicker';
import type { DateValue } from '@internationalized/date';

interface DateFieldContextValue {
  state: DateFieldState;
  fieldProps: React.HTMLAttributes<HTMLElement>;
  fieldRef: React.RefObject<HTMLDivElement | null>;
}

const DateFieldContext = React.createContext<DateFieldContextValue | null>(null);

interface DateFieldProps extends AriaDateFieldProps<DateValue> {
  children: React.ReactNode;
  value?: DateValue;
  onChange?: (value: DateValue | null) => void;
  isReadOnly?: boolean;
}

export function DateField({ children, value, onChange, isReadOnly, ...props }: DateFieldProps) {
  // Force en-GB locale for DD/MM/YYYY format
  const dateLocale = 'en-GB';
  
  const state = useDateFieldState({ 
    ...props,
    value: value ?? null,
    ...(onChange && { onChange }),
    locale: dateLocale,
    createCalendar,
    isReadOnly: isReadOnly ?? false
  });
  const fieldRef = useRef<HTMLDivElement>(null);
  const { fieldProps } = useDateField({ ...props, isReadOnly: isReadOnly ?? false }, state, fieldRef);

  const contextValue = useMemo(() => ({
    state,
    fieldProps,
    fieldRef
  }), [state, fieldProps]);

  return (
    <DateFieldContext.Provider value={contextValue}>
      <Box display="inline-block">{children}</Box>
    </DateFieldContext.Provider>
  );
}

interface LabelProps {
  children: React.ReactNode;
}

export function Label({ children }: LabelProps) {
  return (
    <Text fontSize="sm" fontWeight={500} color="text.primary" mb={2}>
      {children}
    </Text>
  );
}

interface DateInputProps {
  children: (props: { segment: DateSegmentType; key: number }) => React.ReactNode;
}

export function DateInput({ children }: DateInputProps) {
  const context = React.useContext(DateFieldContext);
  if (!context) {
    throw new Error('DateInput must be used within a DateField');
  }

  const { state, fieldProps, fieldRef } = context;

  return (
    <Box
      {...fieldProps}
      ref={fieldRef}
      display="inline-flex"
      border="none"
      borderRadius="4px"
      px={1}
      py={0.5}
      alignItems="center"
      gap={0}
      bg="transparent"
      opacity={state.isReadOnly ? 0.8 : 1}
      cursor={state.isReadOnly ? "not-allowed" : "text"}
      whiteSpace="nowrap"
      flexWrap="nowrap"
      _focus={{
        outline: 'none'
      }}
    >
      {state.segments.map((segment, i) => (
        <React.Fragment key={i}>
          {children({ segment, key: i })}
        </React.Fragment>
      ))}
    </Box>
  );
}

interface DateSegmentProps {
  segment: DateSegmentType;
}

export function DateSegment({ segment }: DateSegmentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const context = React.useContext(DateFieldContext);
  if (!context) {
    throw new Error('DateSegment must be used within a DateField');
  }
  
  const { state } = context;
  const { segmentProps } = useDateSegment(segment, state, ref);
  
  // Get theme tokens for dynamic styling
  const [bgSecondary, textTertiary, textPrimary, focusBg, focusText, focusBorder] = useToken(
    'colors',
    ['bg.secondary', 'text.tertiary', 'text.primary', 'gray.100', 'gray.800', 'gray.400']
  );

  return (
    <Box
      {...segmentProps}
      ref={ref}
      px={0.5}
      textAlign="center"
      bg={segment.isPlaceholder ? bgSecondary : 'transparent'}
      color={segment.isPlaceholder ? textTertiary : textPrimary}
      borderRadius="2px"
      outline="none"
      border="1px solid transparent"
      cursor={state.isReadOnly ? "default" : "text"}
      fontStyle={state.isReadOnly ? 'italic' : 'normal'}
      _focus={state.isReadOnly ? {} : {
        bg: focusBg,
        color: focusText,
        borderColor: focusBorder,
        outline: 'none'
      }}
      opacity={state.isReadOnly ? 0.8 : 1}
    >
      {segment.text}
    </Box>
  );
}