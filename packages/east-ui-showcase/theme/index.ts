import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
        body: { value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
      },
      colors: {
        brand: {
          50: { value: '#f0fffe' },
          100: { value: '#c2fcfc' },
          200: { value: '#94f9f9' },
          300: { value: '#79f8f8' },
          400: { value: '#5ce5e5' },
          500: { value: '#488e97' },
          600: { value: '#3a7780' },
          700: { value: '#2b4b55' },
          800: { value: '#1f363d' },
          900: { value: '#111b22' },
        },
        gray: {
          50: { value: '#f8fafa' },
          100: { value: '#f1f5f5' },
          200: { value: '#e2e8e8' },
          300: { value: '#cbd5d5' },
          400: { value: '#9bb0b0' },
          500: { value: '#6b8080' },
          600: { value: '#4a5f5f' },
          700: { value: '#374848' },
          800: { value: '#253333' },
          900: { value: '#1a2626' },
        },
      },
    },
    semanticTokens: {
      colors: {
        'bg.primary': {
          value: { base: '{colors.white}', _dark: '{colors.gray.900}' },
        },
        'bg.secondary': {
          value: { base: '{colors.gray.50}', _dark: '{colors.gray.800}' },
        },
        'bg.tertiary': {
          value: { base: '{colors.gray.100}', _dark: '{colors.gray.700}' },
        },
        'text.primary': {
          value: { base: '{colors.gray.900}', _dark: '{colors.gray.100}' },
        },
        'text.secondary': {
          value: { base: '{colors.gray.600}', _dark: '{colors.gray.400}' },
        },
        'text.muted': {
          value: { base: '{colors.gray.500}', _dark: '{colors.gray.400}' },
        },
        'border.primary': {
          value: { base: '{colors.gray.200}', _dark: '{colors.gray.600}' },
        },
        'card.bg': {
          value: { base: '{colors.white}', _dark: '{colors.gray.800}' },
        },
      },
    }
  },
})
