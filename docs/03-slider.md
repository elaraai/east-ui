### 3. [x] Slider (`src/forms/slider.ts`)

**Chakra UI Structure:**
```tsx
<Slider.Root>
  <Slider.Label />
  <Slider.Control>
    <Slider.Track>
      <Slider.Range />
    </Slider.Track>
    <Slider.Thumbs />
  </Slider.Control>
  <Slider.ValueText />
  <Slider.MarkerGroup>
    <Slider.Marker value={50} />
  </Slider.MarkerGroup>
</Slider.Root>
```

**Props:**
- `value`: number | number[]
- `min`: number
- `max`: number
- `step`: number
- `orientation`: "horizontal" | "vertical"
- `colorPalette`: ColorScheme
- `size`: "xs" | "sm" | "md" | "lg"
- `variant`: "outline" | "subtle"

**East UI Types:**
```typescript
export const SliderVariantType = VariantType({
  outline: NullType,
  subtle: NullType,
});

export const SliderRootType = StructType({
  value: FloatType,
  min: OptionType(FloatType),
  max: OptionType(FloatType),
  step: OptionType(FloatType),
  orientation: OptionType(OrientationType),
  colorPalette: OptionType(ColorSchemeType),
  size: OptionType(SizeType),
  variant: OptionType(SliderVariantType),
  disabled: OptionType(BooleanType),
  onChange: OptionType(FunctionType([FloatType], FloatType)),
});

export const Slider = { Root, Label, ValueText, Marker } as const;
```

---

