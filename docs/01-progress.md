### 1. [x] Progress (`src/feedback/progress.ts`)

**Chakra UI Structure:**
```tsx
<Progress.Root>
  <Progress.Label />
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
  <Progress.ValueText />
</Progress.Root>
```

**Props:**
- `value`: number (0-100)
- `min`: number (default: 0)
- `max`: number (default: 100)
- `colorPalette`: ColorScheme
- `size`: "xs" | "sm" | "md" | "lg"
- `variant`: "outline" | "subtle"
- `striped`: boolean
- `animated`: boolean

**East UI Types:**
```typescript
export const ProgressVariantType = VariantType({
  outline: NullType,
  subtle: NullType,
});

export const ProgressRootType = StructType({
  value: FloatType,
  min: OptionType(FloatType),
  max: OptionType(FloatType),
  colorPalette: OptionType(ColorSchemeType),
  size: OptionType(SizeType),
  variant: OptionType(ProgressVariantType),
  striped: OptionType(BooleanType),
  animated: OptionType(BooleanType),
  label: OptionType(ProgressLabelType),
  valueText: OptionType(ProgressValueTextType),
});

export const Progress = { Root, Label, ValueText } as const;
```

---

