### 8. [x] Input (`src/forms/input.ts`)

East UI provides typed input components for each literal value type:

**Chakra UI Structure:**
```tsx
<Input.Group>
  <Input.Addon>https://</Input.Addon>
  <Input placeholder="website" />
</Input.Group>
```

**East UI Types (per literal type):**

```typescript
export const InputVariantType = VariantType({
  outline: NullType,
  filled: NullType,
  flushed: NullType,
});

// String Input
export const StringInputType = StructType({
  value: StringType,
  placeholder: OptionType(StringType),
  variant: OptionType(InputVariantType),
  size: OptionType(SizeType),
  maxLength: OptionType(IntegerType),
  pattern: OptionType(StringType),
  onChange: OptionType(FunctionType([StringType], StringType)),
});

// Integer Input
export const IntegerInputType = StructType({
  value: IntegerType,
  min: OptionType(IntegerType),
  max: OptionType(IntegerType),
  step: OptionType(IntegerType),
  onChange: OptionType(FunctionType([IntegerType], IntegerType)),
});

// Float Input
export const FloatInputType = StructType({
  value: FloatType,
  min: OptionType(FloatType),
  max: OptionType(FloatType),
  step: OptionType(FloatType),
  precision: OptionType(IntegerType),
  onChange: OptionType(FunctionType([FloatType], FloatType)),
});

// DateTime Input
export const DateTimeInputType = StructType({
  value: DateTimeType,
  min: OptionType(DateTimeType),
  max: OptionType(DateTimeType),
  showTime: OptionType(BooleanType),
  format: OptionType(StringType),
  onChange: OptionType(FunctionType([DateTimeType], DateTimeType)),
});

// Unified Input Root Type
export const InputRootType = VariantType({
  String: StringInputType,
  Integer: IntegerInputType,
  Float: FloatInputType,
  DateTime: DateTimeInputType,
});

export const Input = {
  String,
  Integer,
  Float,
  DateTime,
  Group,
  Addon,
} as const;
```

**Usage:**
```typescript
// All inputs accept plain values - no East.value() wrapper needed
Input.String("John", { placeholder: "Enter name", maxLength: 100n });
Input.Integer(row.age, { min: 0n, max: 150n });
Input.Float(19.99, { precision: 2n });
Input.DateTime(row.createdAt, { showTime: true, format: "yyyy-MM-dd HH:mm" });
```

---

