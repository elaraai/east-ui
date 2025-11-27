### 27. [x] Separator (`src/layout/separator/index.ts`, `src/layout/separator/style.ts`)

**Source:** `@chakra-ui/react@3.30.0` - `dist/types/components/separator/`

A simple visual divider between content sections.

**East UI Types:**
```typescript
export const SeparatorVariantType = VariantType({
  solid: NullType,
  dashed: NullType,
  dotted: NullType,
});

export const SeparatorType = StructType({
  orientation: OptionType(OrientationType),  // horizontal | vertical
  variant: OptionType(SeparatorVariantType),
  size: OptionType(SizeType),  // thickness
  color: OptionType(StringType),  // Chakra color token
  label: OptionType(StringType),  // optional text in the middle
});

export function Separator(config?: {
  orientation?: SubtypeExprOrValue<OrientationType>;
  variant?: SubtypeExprOrValue<SeparatorVariantType>;
  size?: SubtypeExprOrValue<SizeType>;
  color?: SubtypeExprOrValue<StringType>;
  label?: SubtypeExprOrValue<StringType>;
}): ExprType<SeparatorType>;
```

**Usage:**
```typescript
// Simple horizontal separator
Separator();

// Labeled separator
Separator({
  label: "OR",
});

// Vertical separator in a flex container
Stack.Root({
  direction: variant("row", null),
  children: [
    Panel({ ... }),
    Separator({ orientation: variant("vertical", null) }),
    Panel({ ... }),
  ],
});
```

---

