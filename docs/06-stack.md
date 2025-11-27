### 6. [x] Stack (`src/layout/stack/index.ts`, `src/layout/stack/style.ts`)

**Chakra UI Structure:**
```tsx
<Stack direction="row" gap={4}>{children}</Stack>
<HStack gap={4}>{children}</HStack>
<VStack gap={4}>{children}</VStack>
```

**Props:**
- `direction`: "row" | "column" | "row-reverse" | "column-reverse"
- `gap`: string
- `align`: AlignItems
- `justify`: JustifyContent
- `wrap`: "wrap" | "nowrap" | "wrap-reverse"

**East UI Types:**
```typescript
export const StackDirectionType = VariantType({
  row: NullType,
  column: NullType,
  row_reverse: NullType,
  column_reverse: NullType,
});

export const StackType = StructType({
  children: ArrayType(UIComponentType),  // recursive!
  style: OptionType(StackStyleType),
});

export function Stack(children, props?): ExprType<StackType>;
export function HStack(children, props?): ExprType<StackType>;
export function VStack(children, props?): ExprType<StackType>;
```

---

