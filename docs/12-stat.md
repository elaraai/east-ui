### 12. [x] Stat (`src/display/stat.ts`)

**Chakra UI Structure:**
```tsx
<Stat.Root>
  <Stat.Label>Revenue</Stat.Label>
  <Stat.ValueText>$0.00</Stat.ValueText>
  <Stat.HelpText><Stat.UpIndicator />23.36%</Stat.HelpText>
</Stat.Root>
```

**East UI Types:**
```typescript
export const StatIndicatorType = VariantType({ up: NullType, down: NullType });

export const StatRootType = StructType({
  label: StatLabelType,
  value: StatValueTextType,
  helpText: OptionType(StatHelpTextType),
});

export const Stat = { Root, Label, ValueText, HelpText } as const;
```

---

