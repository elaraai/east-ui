### 10. [x] Switch (`src/forms/switch.ts`)

**East UI Types:**
```typescript
export const SwitchType = StructType({
  checked: BooleanType,
  label: OptionType(StringType),
  disabled: OptionType(BooleanType),
  colorPalette: OptionType(ColorSchemeType),
  size: OptionType(SizeType),
  onChange: OptionType(FunctionType([BooleanType], BooleanType)),
});
```

---

