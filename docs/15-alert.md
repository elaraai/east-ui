### 15. [x] Alert (`src/feedback/alert.ts`)

**Chakra UI Structure:**
```tsx
<Alert.Root status="success">
  <Alert.Indicator />
  <Alert.Content>
    <Alert.Title>Success!</Alert.Title>
    <Alert.Description>Completed.</Alert.Description>
  </Alert.Content>
</Alert.Root>
```

**East UI Types:**
```typescript
export const AlertStatusType = VariantType({
  info: NullType,
  warning: NullType,
  success: NullType,
  error: NullType,
});

export const AlertType = StructType({
  status: AlertStatusType,
  title: OptionType(StringType),
  description: OptionType(StringType),
  variant: OptionType(AlertVariantType),
});
```

---

