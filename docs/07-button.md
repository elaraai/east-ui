### 7. [x] Button (`src/buttons/button.ts`)

**Chakra UI Structure:**
```tsx
<Button variant="solid" colorPalette="blue" size="md" loading>Submit</Button>
```

**Props:**
- `variant`: "solid" | "subtle" | "outline" | "ghost"
- `colorPalette`: ColorScheme
- `size`: "xs" | "sm" | "md" | "lg"
- `loading`: boolean
- `disabled`: boolean

**East UI Types:**
```typescript
export const ButtonVariantType = VariantType({
  solid: NullType,
  subtle: NullType,
  outline: NullType,
  ghost: NullType,
});

export const ButtonType = StructType({
  label: StringType,
  variant: OptionType(ButtonVariantType),
  colorPalette: OptionType(ColorSchemeType),
  size: OptionType(SizeType),
  loading: OptionType(BooleanType),
  disabled: OptionType(BooleanType),
  onClick: OptionType(FunctionType([], NullType)),
});
```

---

