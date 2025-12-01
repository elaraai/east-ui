### 13. [x] Tag (`src/display/tag.ts`)

**East UI Types:**
```typescript
export const TagType = StructType({
  label: StringType,
  variant: OptionType(StyleVariantType),
  colorPalette: OptionType(ColorSchemeType),
  size: OptionType(SizeType),
  closable: OptionType(BooleanType),
  onClose: OptionType(FunctionType([], NullType)),
});
```

---

