### 30. [ ] Fieldset (`src/forms/fieldset/`)

**Source:** `@chakra-ui/react` - built on Ark UI Fieldset

**Chakra UI Structure:**
```tsx
<Fieldset.Root size="md">
  <Fieldset.Legend>Contact Information</Fieldset.Legend>
  <Fieldset.HelperText>Please fill out all required fields.</Fieldset.HelperText>
  <Fieldset.Content>
    <Field.Root>
      <Field.Label>Email</Field.Label>
      <Input type="email" />
    </Field.Root>
    <Field.Root>
      <Field.Label>Phone</Field.Label>
      <Input type="tel" />
    </Field.Root>
  </Fieldset.Content>
  <Fieldset.ErrorText>Some fields are invalid.</Fieldset.ErrorText>
</Fieldset.Root>
```

**Compound Components:**
- `Fieldset.Root` - main container (renders as `<fieldset>`)
- `Fieldset.Legend` - group title (renders as `<legend>`)
- `Fieldset.HelperText` - descriptive help text
- `Fieldset.Content` - container for form fields
- `Fieldset.ErrorText` - validation error message

**Root Props:**
- `size`: "sm" | "md" | "lg" - overall size
- `disabled`: boolean - disable all fields in fieldset
- `invalid`: boolean - mark fieldset as invalid

**East UI Types:**
```typescript
// Fieldset is a container component - children are UIComponents
// Defined inline in component.ts with node for children

// types.ts - style types only
export const FieldsetStyleType = StructType({
  size: OptionType(SizeType),
});

// component.ts - inline definition
Fieldset: StructType({
  legend: OptionType(StringType),
  helperText: OptionType(StringType),
  errorText: OptionType(StringType),
  content: ArrayType(node),  // UI component children!
  disabled: OptionType(BooleanType),
  invalid: OptionType(BooleanType),
  style: OptionType(FieldsetStyleType),
}),

// index.ts - namespace export
export const Fieldset = {
  Root: createFieldsetRoot,
  Types: {
    Fieldset: FieldsetType,
    Style: FieldsetStyleType,
  },
} as const;
```

**Usage:**
```typescript
// Contact form fieldset
Fieldset.Root([
  Field.Root("Email", Input.String("", { placeholder: "you@example.com" })),
  Field.Root("Phone", Input.String("", { placeholder: "+1 (555) 000-0000" })),
], {
  legend: "Contact Information",
  helperText: "Please fill out all required fields.",
  size: "md",
});

// Disabled fieldset
Fieldset.Root([
  Field.Root("Name", Input.String("John")),
], {
  legend: "Read-only Information",
  disabled: true,
});

// Invalid fieldset with error
Fieldset.Root([
  Field.Root("Password", Input.String("", { variant: "outline" })),
], {
  legend: "Security",
  invalid: true,
  errorText: "Password does not meet requirements.",
});
```

---

