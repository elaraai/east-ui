### 28. [x] Field (`src/forms/field.ts`)

**Source:** `@chakra-ui/react@3.30.0` - built on Ark UI Field

**Chakra UI Structure:**
```tsx
<Field.Root>
  <Field.Label>Email</Field.Label>
  <Input type="email" />
  <Field.HelperText>We'll never share your email.</Field.HelperText>
  <Field.ErrorText>Email is required.</Field.ErrorText>
</Field.Root>
```

**Compound Components:**
- `Field.Root` - main wrapper
- `Field.Label` - form label
- `Field.HelperText` - descriptive help text
- `Field.ErrorText` - validation error message
- `Field.RequiredIndicator` - visual indicator for required fields

**East UI Types:**
```typescript
// Field type wraps a form control with label and messages
export const FieldType = StructType({
  label: StringType,
  control: UIComponentType,  // Input, Select, Checkbox, etc.
  helperText: OptionType(StringType),
  errorText: OptionType(StringType),
  required: OptionType(BooleanType),
  disabled: OptionType(BooleanType),
  invalid: OptionType(BooleanType),
  readOnly: OptionType(BooleanType),
});

export function Field(config: {
  label: SubtypeExprOrValue<StringType>;
  control: ExprType<UIComponentType>;
  helperText?: SubtypeExprOrValue<StringType>;
  errorText?: SubtypeExprOrValue<StringType>;
  required?: SubtypeExprOrValue<BooleanType>;
  disabled?: SubtypeExprOrValue<BooleanType>;
  invalid?: SubtypeExprOrValue<BooleanType>;
  readOnly?: SubtypeExprOrValue<BooleanType>;
}): ExprType<FieldType>;
```

**Usage:**
```typescript
// Basic field with helper text
Field({
  label: "Email",
  control: Input({ type: "email", placeholder: "you@example.com" }),
  helperText: "We'll never share your email.",
});

// Field with validation error
Field({
  label: "Password",
  control: Input({ type: "password" }),
  required: true,
  invalid: formErrors.password.isDefined(),
  errorText: formErrors.password.getOrElse(""),
});

// Required field
Field({
  label: "Username",
  control: Input({ placeholder: "Enter username" }),
  required: true,
});
```

---

