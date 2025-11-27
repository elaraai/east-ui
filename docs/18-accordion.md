### 18. [x] Accordion (`src/disclosure/accordion/`)

**Chakra UI Structure:**
```tsx
<Accordion.Root>
  <Accordion.Item value="a">
    <Accordion.ItemTrigger>Section 1</Accordion.ItemTrigger>
    <Accordion.ItemContent>Content 1</Accordion.ItemContent>
  </Accordion.Item>
</Accordion.Root>
```

**East UI Types:**

Accordion is a **container component** - its item content supports UI component children.
The main type is defined inline in `component.ts`, only style types go in `types.ts`.

```typescript
// types.ts - style types only
export const AccordionVariantType = VariantType({
  enclosed: NullType,
  plain: NullType,
  subtle: NullType,
});

export const AccordionStyleType = StructType({
  multiple: OptionType(BooleanType),
  collapsible: OptionType(BooleanType),
  variant: OptionType(AccordionVariantType),
});

// component.ts - inline definition with node for children
Accordion: StructType({
  items: ArrayType(StructType({
    value: StringType,
    trigger: StringType,
    content: ArrayType(node),  // UI component children!
    disabled: OptionType(BooleanType),
  })),
  style: OptionType(AccordionStyleType),
}),

// index.ts - namespace export
export const Accordion = {
  Root: createAccordionRoot,
  Item: createAccordionItem,
  Variant: AccordionVariant,
  Types: {
    Root: AccordionRootType,
    Item: AccordionItemType,
    Style: AccordionStyleType,
    Variant: AccordionVariantType,
  },
} as const;
```

**Usage:**
```typescript
Accordion.Root([
  Accordion.Item("q1", "What is East UI?", [
    Text.Root("East UI is a typed UI component library."),
  ]),
  Accordion.Item("q2", "How do I install it?", [
    Text.Root("Run npm install @elaraai/east-ui"),
  ]),
], {
  variant: "enclosed",
  collapsible: true,
});
```

---

