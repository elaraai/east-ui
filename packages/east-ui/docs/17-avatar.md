### 17. [x] Avatar (`src/display/avatar/`)

**East UI Types:**
```typescript
// Uses shared SizeType from style.ts (xs, sm, md, lg)
export const AvatarType = StructType({
  src: OptionType(StringType),
  name: OptionType(StringType),
  size: OptionType(SizeType),  // Shared size type
  variant: OptionType(StyleVariantType),
  colorPalette: OptionType(ColorSchemeType),
});

export const Avatar = {
  Root: createAvatar,
  Types: {
    Avatar: AvatarType,
  },
} as const;
```

---

