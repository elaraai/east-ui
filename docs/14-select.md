### 14. [x] Select (`src/forms/select.ts`)

**Chakra UI Structure:**
```tsx
<Select.Root>
  <Select.Label>Country</Select.Label>
  <Select.Control>
    <Select.Trigger><Select.ValueText placeholder="Select" /></Select.Trigger>
  </Select.Control>
  <Select.Content>
    <Select.Item value="us">United States</Select.Item>
  </Select.Content>
</Select.Root>
```

**East UI Types:**
```typescript
export const SelectItemType = StructType({
  value: StringType,
  label: StringType,
  disabled: OptionType(BooleanType),
});

export const SelectType = StructType({
  value: OptionType(StringType),
  items: ArrayType(SelectItemType),
  placeholder: OptionType(StringType),
  multiple: OptionType(BooleanType),
  onChange: OptionType(FunctionType([StringType], StringType)),
});

export const Select = { Root, Item } as const;
```

---

