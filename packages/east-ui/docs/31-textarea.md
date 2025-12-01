### 31. [ ] Textarea (`src/forms/textarea/`)

**Source:** `@chakra-ui/react` - Textarea component

**Chakra UI Structure:**
```tsx
<Textarea
  placeholder="Enter description..."
  variant="outline"
  size="md"
  resize="vertical"
  rows={4}
/>
```

**Props:**
- `value`: string - current value
- `placeholder`: string - placeholder text
- `variant`: "outline" | "subtle" | "flushed" - appearance style
- `size`: "xs" | "sm" | "md" | "lg" | "xl" - text size
- `resize`: "none" | "vertical" | "horizontal" | "both" - resize behavior
- `rows`: number - visible text rows
- `disabled`: boolean - disable input
- `readOnly`: boolean - read-only mode
- `invalid`: boolean - invalid state
- `required`: boolean - required field
- `maxLength`: number - maximum characters
- `autoresize`: boolean - auto-resize based on content

**East UI Types:**
```typescript
// Textarea resize behavior
export const TextareaResizeType = VariantType({
  none: NullType,
  vertical: NullType,
  horizontal: NullType,
  both: NullType,
});

// Textarea uses same variant as Input
// InputVariantType: outline | subtle | flushed

export const TextareaType = StructType({
  value: StringType,
  placeholder: OptionType(StringType),
  variant: OptionType(InputVariantType),
  size: OptionType(SizeType),
  resize: OptionType(TextareaResizeType),
  rows: OptionType(IntegerType),
  disabled: OptionType(BooleanType),
  readOnly: OptionType(BooleanType),
  invalid: OptionType(BooleanType),
  required: OptionType(BooleanType),
  maxLength: OptionType(IntegerType),
  autoresize: OptionType(BooleanType),
});

export interface TextareaStyle {
  placeholder?: SubtypeExprOrValue<StringType>;
  variant?: SubtypeExprOrValue<InputVariantType> | InputVariantLiteral;
  size?: SubtypeExprOrValue<SizeType> | SizeLiteral;
  resize?: SubtypeExprOrValue<TextareaResizeType> | "none" | "vertical" | "horizontal" | "both";
  rows?: SubtypeExprOrValue<IntegerType>;
  disabled?: SubtypeExprOrValue<BooleanType>;
  readOnly?: SubtypeExprOrValue<BooleanType>;
  invalid?: SubtypeExprOrValue<BooleanType>;
  required?: SubtypeExprOrValue<BooleanType>;
  maxLength?: SubtypeExprOrValue<IntegerType>;
  autoresize?: SubtypeExprOrValue<BooleanType>;
}

export const Textarea = {
  Root: createTextarea,
  Types: {
    Textarea: TextareaType,
    Resize: TextareaResizeType,
  },
} as const;
```

**Usage:**
```typescript
// Basic textarea
Textarea.Root("", {
  placeholder: "Enter description...",
  rows: 4n,
});

// Auto-resizing textarea
Textarea.Root("", {
  placeholder: "Start typing...",
  autoresize: true,
  variant: "outline",
});

// Fixed size textarea
Textarea.Root("", {
  rows: 6n,
  resize: "none",
  maxLength: 500n,
});

// Flushed variant
Textarea.Root(row.notes, {
  variant: "flushed",
  size: "lg",
});
```

---

