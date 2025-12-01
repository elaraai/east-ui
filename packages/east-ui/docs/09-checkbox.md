### 9. [x] Checkbox (`src/forms/checkbox.ts`)

**Chakra UI Structure:**
```tsx
<Checkbox.Root>
  <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
  <Checkbox.Label>Accept terms</Checkbox.Label>
</Checkbox.Root>
```

**East UI Types:**
```typescript
export const CheckboxType = StructType({
  checked: BooleanType,
  label: OptionType(StringType),
  indeterminate: OptionType(BooleanType),
  disabled: OptionType(BooleanType),
  colorPalette: OptionType(ColorSchemeType),
  size: OptionType(SizeType),
  onChange: OptionType(FunctionType([BooleanType], BooleanType)),
});
```

---

