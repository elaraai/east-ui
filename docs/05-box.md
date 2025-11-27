### 5. [x] Box (`src/layout/box/index.ts`, `src/layout/box/style.ts`)

**Chakra UI Structure:**
```tsx
<Box bg="gray.100" p={4} borderRadius="md">
  {children}
</Box>
```

**East UI Types:**
```typescript
export const BoxStyleType = StructType({
  display: OptionType(DisplayType),
  width: OptionType(StringType),
  height: OptionType(StringType),
  padding: OptionType(StringType),
  margin: OptionType(StringType),
  background: OptionType(StringType),
  color: OptionType(StringType),
  borderRadius: OptionType(StringType),
  flexDirection: OptionType(FlexDirectionType),
  justifyContent: OptionType(JustifyContentType),
  alignItems: OptionType(AlignItemsType),
  gap: OptionType(StringType),
});

export const BoxType = StructType({
  children: ArrayType(UIComponentType),  // recursive!
  style: OptionType(BoxStyleType),
});
```

---

