### 32. [ ] TagsInput (`src/forms/tags-input/`)

**Source:** `@chakra-ui/react` - built on Ark UI TagsInput

**Chakra UI Structure:**
```tsx
<TagsInput.Root max={5} delimiter=",">
  <TagsInput.Label>Skills</TagsInput.Label>
  <TagsInput.Control>
    <TagsInput.Context>
      {({ value }) =>
        value.map((tag, index) => (
          <TagsInput.Item key={index} index={index} value={tag}>
            <TagsInput.ItemText>{tag}</TagsInput.ItemText>
            <TagsInput.ItemDeleteTrigger />
          </TagsInput.Item>
        ))
      }
    </TagsInput.Context>
    <TagsInput.Input placeholder="Add tag..." />
  </TagsInput.Control>
  <TagsInput.ClearTrigger>Clear all</TagsInput.ClearTrigger>
</TagsInput.Root>
```

**Compound Components:**
- `TagsInput.Root` - main container
- `TagsInput.Label` - descriptive label
- `TagsInput.Control` - wrapper for tags and input
- `TagsInput.Item` - individual tag wrapper
- `TagsInput.ItemText` - tag text content
- `TagsInput.ItemInput` - inline edit input for tag
- `TagsInput.ItemDeleteTrigger` - remove tag button
- `TagsInput.Input` - input for adding new tags
- `TagsInput.ClearTrigger` - remove all tags button
- `TagsInput.HiddenInput` - native hidden input

**Root Props:**
- `value`: string[] - controlled tag values
- `defaultValue`: string[] - initial tags
- `max`: number - maximum number of tags
- `maxLength`: number - max characters per tag
- `disabled`: boolean - disable input
- `readOnly`: boolean - read-only mode
- `invalid`: boolean - invalid state
- `editable`: boolean - allow editing existing tags
- `delimiter`: string | RegExp - separator for parsing pasted text
- `addOnPaste`: boolean - parse pasted text into tags
- `blurBehavior`: "clear" | "add" - action on blur
- `allowOverflow`: boolean - allow exceeding max
- `validate`: (details: ValidateArgs) => boolean - custom validation

**East UI Types:**
```typescript
// Blur behavior
export const TagsInputBlurBehaviorType = VariantType({
  clear: NullType,
  add: NullType,
});

export const TagsInputRootType = StructType({
  // Value
  value: ArrayType(StringType),
  defaultValue: OptionType(ArrayType(StringType)),

  // Constraints
  max: OptionType(IntegerType),
  maxLength: OptionType(IntegerType),

  // States
  disabled: OptionType(BooleanType),
  readOnly: OptionType(BooleanType),
  invalid: OptionType(BooleanType),

  // Behavior
  editable: OptionType(BooleanType),
  delimiter: OptionType(StringType),
  addOnPaste: OptionType(BooleanType),
  blurBehavior: OptionType(TagsInputBlurBehaviorType),
  allowOverflow: OptionType(BooleanType),

  // Content
  label: OptionType(StringType),
  placeholder: OptionType(StringType),

  // Styling
  size: OptionType(SizeType),
  variant: OptionType(InputVariantType),
  colorPalette: OptionType(ColorSchemeType),
});

export const TagsInput = {
  Root: createTagsInputRoot,
  Types: {
    Root: TagsInputRootType,
    BlurBehavior: TagsInputBlurBehaviorType,
  },
} as const;
```

**Usage:**
```typescript
// Basic tags input
TagsInput.Root([], {
  label: "Skills",
  placeholder: "Add skill...",
  max: 5n,
});

// Comma-delimited with paste support
TagsInput.Root(["react", "typescript"], {
  label: "Technologies",
  delimiter: ",",
  addOnPaste: true,
  placeholder: "Type or paste tags...",
});

// Editable tags
TagsInput.Root(row.tags, {
  editable: true,
  maxLength: 20n,
  colorPalette: "blue",
});

// Read-only display
TagsInput.Root(["approved", "verified"], {
  readOnly: true,
  variant: "subtle",
});
```

---

