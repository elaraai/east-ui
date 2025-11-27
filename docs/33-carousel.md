### 33. [ ] Carousel (`src/disclosure/carousel/`)

**Source:** `@chakra-ui/react` - built on Ark UI Carousel

**Chakra UI Structure:**
```tsx
<Carousel.Root slidesPerView={2} loop>
  <Carousel.Control>
    <Carousel.PrevTrigger />
    <Carousel.NextTrigger />
  </Carousel.Control>
  <Carousel.Viewport>
    <Carousel.ItemGroup>
      {items.map((item, index) => (
        <Carousel.Item key={index} index={index}>
          <img src={item.src} alt={item.alt} />
        </Carousel.Item>
      ))}
    </Carousel.ItemGroup>
  </Carousel.Viewport>
  <Carousel.IndicatorGroup>
    {items.map((_, index) => (
      <Carousel.Indicator key={index} index={index} />
    ))}
  </Carousel.IndicatorGroup>
</Carousel.Root>
```

**Compound Components:**
- `Carousel.Root` - main container
- `Carousel.Viewport` - visible slide area
- `Carousel.ItemGroup` - container for slides
- `Carousel.Item` - individual slide
- `Carousel.Control` - navigation controls container
- `Carousel.PrevTrigger` - previous slide button
- `Carousel.NextTrigger` - next slide button
- `Carousel.IndicatorGroup` - dot indicators container
- `Carousel.Indicator` - individual dot indicator
- `Carousel.Autoplay` - autoplay control button

**Root Props:**
- `index`: number - controlled current slide
- `defaultIndex`: number - initial slide
- `orientation`: "horizontal" | "vertical" - slide direction
- `slidesPerView`: number | "auto" - visible slides
- `slidesPerMove`: number - slides to advance
- `loop`: boolean - infinite scrolling
- `autoplay`: boolean - automatic advancement
- `spacing`: string - gap between slides
- `padding`: string - viewport padding
- `allowMouseDrag`: boolean - mouse drag navigation

**East UI Types:**
```typescript
// Carousel item - can contain UIComponents
// Defined inline in component.ts

// types.ts - style types only
export const CarouselStyleType = StructType({
  orientation: OptionType(OrientationType),
  spacing: OptionType(StringType),
  padding: OptionType(StringType),
});

// component.ts - inline definition
Carousel: StructType({
  items: ArrayType(StructType({
    content: node,  // UI component children!
  })),
  index: OptionType(IntegerType),
  defaultIndex: OptionType(IntegerType),
  slidesPerView: OptionType(IntegerType),
  slidesPerMove: OptionType(IntegerType),
  loop: OptionType(BooleanType),
  autoplay: OptionType(BooleanType),
  allowMouseDrag: OptionType(BooleanType),
  showIndicators: OptionType(BooleanType),
  showControls: OptionType(BooleanType),
  style: OptionType(CarouselStyleType),
}),

// index.ts - namespace export
export const Carousel = {
  Root: createCarouselRoot,
  Item: createCarouselItem,
  Types: {
    Carousel: CarouselType,
    Style: CarouselStyleType,
  },
} as const;
```

**Usage:**
```typescript
// Image carousel with indicators
Carousel.Root([
  Carousel.Item([Image.Root({ src: "/slide1.jpg" })]),
  Carousel.Item([Image.Root({ src: "/slide2.jpg" })]),
  Carousel.Item([Image.Root({ src: "/slide3.jpg" })]),
], {
  loop: true,
  showIndicators: true,
  showControls: true,
});

// Multi-slide carousel
Carousel.Root(products.map(p =>
  Carousel.Item([ProductCard.Root(p)])
), {
  slidesPerView: 3n,
  slidesPerMove: 1n,
  spacing: "4",
});

// Autoplay carousel
Carousel.Root(banners.map(b =>
  Carousel.Item([Banner.Root(b)])
), {
  autoplay: true,
  loop: true,
  allowMouseDrag: true,
});

// Vertical carousel
Carousel.Root(testimonials.map(t =>
  Carousel.Item([TestimonialCard.Root(t)])
), {
  orientation: "vertical",
  slidesPerView: 1n,
});
```

---

