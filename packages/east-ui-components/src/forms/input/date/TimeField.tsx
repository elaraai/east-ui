/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import React, { useRef, useMemo } from 'react';
import { Box, Text, useToken } from '@chakra-ui/react';
import { useTimeField, useDateSegment } from '@react-aria/datepicker';
import { useTimeFieldState } from '@react-stately/datepicker';
import { useLocale } from '@react-aria/i18n';
import type { DateFieldState, DateSegment as DateSegmentType } from '@react-stately/datepicker';
import type { AriaTimeFieldProps } from '@react-aria/datepicker';
import type { Time } from '@internationalized/date';

interface TimeFieldContextValue {
  state: DateFieldState;
  fieldProps: React.HTMLAttributes<HTMLElement>;
  fieldRef: React.RefObject<HTMLDivElement | null>;
}

const TimeFieldContext = React.createContext<TimeFieldContextValue | null>(null);

interface TimeFieldProps extends AriaTimeFieldProps<Time> {
  children: React.ReactNode;
  value?: Time;
  onChange?: (value: Time | null) => void;
  isReadOnly?: boolean;
}

export function TimeField({ children, value, onChange, isReadOnly, ...props }: TimeFieldProps) {
  const { locale } = useLocale();
  const state = useTimeFieldState({ 
    ...props, 
    value: value ?? null,
    ...(onChange && { onChange }),
    locale, 
    isReadOnly: isReadOnly ?? false
  });
  const fieldRef = useRef<HTMLDivElement>(null);
  const { fieldProps } = useTimeField({ ...props, isReadOnly: isReadOnly ?? false }, state, fieldRef);

  const contextValue = useMemo(() => ({
    state,
    fieldProps,
    fieldRef
  }), [state, fieldProps]);

  return (
    <TimeFieldContext.Provider value={contextValue}>
      <Box display="inline-block">{children}</Box>
    </TimeFieldContext.Provider>
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
  const context = React.useContext(TimeFieldContext);
  if (!context) {
    throw new Error('DateInput must be used within a TimeField');
  }

  const { state, fieldProps, fieldRef } = context;

  return (
    <Box
      {...fieldProps}
      ref={fieldRef}
      display="inline-flex"
      alignItems="center"
      gap={0}
      border="none"
      borderRadius="4px"
      px={1}
      py={0.5}
      bg="transparent"
      opacity={state.isReadOnly ? 0.8 : 1}
      cursor={state.isReadOnly ? "not-allowed" : "text"}
      whiteSpace="nowrap"
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
  const context = React.useContext(TimeFieldContext);
  if (!context) {
    throw new Error('DateSegment must be used within a TimeField');
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