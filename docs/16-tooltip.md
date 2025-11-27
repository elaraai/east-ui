### 16. [ ] Tooltip (`src/overlays/tooltip.ts`)

**East UI Types:**
```typescript
export const PlacementType = VariantType({
  top: NullType, top_start: NullType, top_end: NullType,
  bottom: NullType, bottom_start: NullType, bottom_end: NullType,
  left: NullType, left_start: NullType, left_end: NullType,
  right: NullType, right_start: NullType, right_end: NullType,
});

export const TooltipType = StructType({
  trigger: UIComponentType,
  content: StringType,
  placement: OptionType(PlacementType),
  hasArrow: OptionType(BooleanType),
});
```

---

