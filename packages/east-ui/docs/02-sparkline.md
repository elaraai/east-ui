### 2. [ ] Sparkline (`src/charts/sparkline.ts`)

**Chakra UI Structure:**
```tsx
<Sparkline data={data} type="line" />
```

**Props:**
- `data`: number[]
- `type`: "line" | "area"
- `color`: string
- `height`: string
- `width`: string

**East UI Types:**
```typescript
export const SparklineChartType = VariantType({
  line: NullType,
  area: NullType,
});

export const SparklineType = StructType({
  data: ArrayType(FloatType),
  type: OptionType(SparklineChartType),
  color: OptionType(StringType),
  height: OptionType(StringType),
  width: OptionType(StringType),
});
```

---

