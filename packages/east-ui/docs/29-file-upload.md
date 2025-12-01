### 29. [ ] FileUpload (`src/forms/file-upload/`)

**Source:** `@chakra-ui/react` - built on Ark UI FileUpload

**Chakra UI Structure:**
```tsx
<FileUpload.Root maxFiles={5} accept={{ "image/*": [".png", ".jpg"] }}>
  <FileUpload.Label>Upload images</FileUpload.Label>
  <FileUpload.Dropzone>
    <FileUpload.Trigger>Choose files</FileUpload.Trigger>
    <p>or drag and drop here</p>
  </FileUpload.Dropzone>
  <FileUpload.ItemGroup>
    <FileUpload.Context>
      {({ acceptedFiles }) =>
        acceptedFiles.map((file) => (
          <FileUpload.Item key={file.name} file={file}>
            <FileUpload.ItemPreview type="image/*">
              <FileUpload.ItemPreviewImage />
            </FileUpload.ItemPreview>
            <FileUpload.ItemName />
            <FileUpload.ItemSizeText />
            <FileUpload.ItemDeleteTrigger />
          </FileUpload.Item>
        ))
      }
    </FileUpload.Context>
  </FileUpload.ItemGroup>
  <FileUpload.HiddenInput />
</FileUpload.Root>
```

**Compound Components:**
- `FileUpload.Root` - main container
- `FileUpload.Label` - descriptive label
- `FileUpload.Trigger` - button activating file picker
- `FileUpload.Dropzone` - drag-and-drop area
- `FileUpload.ClearTrigger` - button to remove all files
- `FileUpload.ItemGroup` - container for file listings
- `FileUpload.Item` - individual file entry wrapper
- `FileUpload.ItemName` - displays filename
- `FileUpload.ItemSizeText` - shows formatted file size
- `FileUpload.ItemPreview` - conditional preview container
- `FileUpload.ItemPreviewImage` - image thumbnail display
- `FileUpload.ItemDeleteTrigger` - removes specific file
- `FileUpload.HiddenInput` - native file input element

**Root Props:**
- `accept`: Record<string, string[]> | FileMimeType[] - permitted file types
- `maxFiles`: number (default: 1) - maximum uploadable files
- `maxFileSize`: number (default: Infinity) - max file size in bytes
- `minFileSize`: number (default: 0) - min file size in bytes
- `directory`: boolean - enable folder upload (webkit)
- `disabled`: boolean - disable input
- `required`: boolean - mark as mandatory
- `allowDrop`: boolean (default: true) - permit drag-and-drop
- `capture`: "user" | "environment" - camera for media capture
- `name`: string - input name attribute

**Error Types:**
- `TOO_MANY_FILES` - exceeds file count limit
- `FILE_INVALID_TYPE` - unsupported file type
- `FILE_TOO_LARGE` - exceeds size threshold
- `FILE_TOO_SMALL` - below minimum size
- `FILE_INVALID` - general validation failure
- `FILE_EXISTS` - duplicate file

**East UI Types:**
```typescript
// File accept type - MIME types or extensions
export const FileAcceptType = MapType(StringType, ArrayType(StringType));

// Capture mode for camera
export const FileCaptureType = VariantType({
  user: NullType,
  environment: NullType,
});

// File error types
export const FileErrorType = VariantType({
  TOO_MANY_FILES: NullType,
  FILE_INVALID_TYPE: NullType,
  FILE_TOO_LARGE: NullType,
  FILE_TOO_SMALL: NullType,
  FILE_INVALID: NullType,
  FILE_EXISTS: NullType,
});

// Rejected file info
export const FileRejectionType = StructType({
  file: BlobType,
  errors: ArrayType(FileErrorType),
});

// Root type
export const FileUploadRootType = StructType({
  // File constraints
  accept: OptionType(FileAcceptType),
  maxFiles: OptionType(IntegerType),
  maxFileSize: OptionType(IntegerType),
  minFileSize: OptionType(IntegerType),

  // Behavior
  directory: OptionType(BooleanType),
  disabled: OptionType(BooleanType),
  required: OptionType(BooleanType),
  allowDrop: OptionType(BooleanType),
  capture: OptionType(FileCaptureType),
  name: OptionType(StringType),

  // Content
  label: OptionType(StringType),
  dropzoneText: OptionType(StringType),
  triggerText: OptionType(StringType),
});

export const FileUpload = {
  Root: createFileUploadRoot,
  Types: {
    Root: FileUploadRootType,
    Accept: FileAcceptType,
    Error: FileErrorType,
    Rejection: FileRejectionType,
  },
} as const;
```

**Usage:**
```typescript
// Image upload with drag-and-drop
FileUpload.Root({
  accept: { "image/*": [".png", ".jpg", ".gif"] },
  maxFiles: 5,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  label: "Upload images",
  dropzoneText: "or drag and drop here",
  triggerText: "Choose files",
});

// Single document upload
FileUpload.Root({
  accept: { "application/pdf": [".pdf"] },
  maxFiles: 1,
  required: true,
  label: "Upload document",
});

// Directory upload
FileUpload.Root({
  directory: true,
  label: "Upload folder",
});
```

---

