### 11. [x] Card (`src/container/card/`)

**Chakra UI Structure:**
```tsx
<Card.Root>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Body>{content}</Card.Body>
  <Card.Footer><Button>Action</Button></Card.Footer>
</Card.Root>
```

**East UI Types:**

Card is a **container component** - its body supports UI component children.
The main type is defined inline in `component.ts`, only style types go in `types.ts`.

```typescript
// types.ts - style types only
export const CardVariantType = VariantType({
  elevated: NullType,
  outline: NullType,
  subtle: NullType,
});

export const CardStyleType = StructType({
  variant: OptionType(CardVariantType),
  size: OptionType(SizeType),
});

// component.ts - inline definition with node for children
Card: StructType({
  title: OptionType(StringType),
  description: OptionType(StringType),
  body: ArrayType(node),  // UI component children!
  style: OptionType(CardStyleType),
}),

// index.ts - namespace export
export const Card = {
  Root: createCard,
  Variant: CardVariant,
  Types: {
    Card: CardType,
    Style: CardStyleType,
    Variant: CardVariantType,
  },
} as const;
```

**Usage:**
```typescript
Card.Root([
  Text.Root("Card content here"),
  Button.Root("Action"),
], {
  title: "Card Title",
  description: "A brief description",
  variant: "elevated",
  size: "md",
});
```

---

