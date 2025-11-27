### 4. [x] Badge (`src/display/badge.ts`)

**Chakra UI Structure:**
```tsx
<Badge variant="solid" colorPalette="green" size="sm">Active</Badge>
```

**Props:**
- `variant`: "solid" | "subtle" | "outline"
- `colorPalette`: ColorScheme
- `size`: "xs" | "sm" | "md" | "lg"

**East UI Types:**
```typescript
export const BadgeType = StructType({
  value: StringType,
  variant: OptionType(StyleVariantType),
  colorPalette: OptionType(ColorSchemeType),
  size: OptionType(SizeType),
});
```

---

