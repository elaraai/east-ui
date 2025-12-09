/**
 * Forms TypeDoc Examples
 *
 * This file contains compilable versions of all TypeDoc @example blocks
 * from the forms module (Checkbox, Input, Select, Slider, Switch, etc.).
 *
 * Each example is compiled AND executed to verify correctness.
 *
 * Format: Each example has a comment indicating:
 *   - File path
 *   - Export property (e.g., Checkbox.Root, Input.String.Root)
 */

import { East } from "@elaraai/east";
import { Checkbox, Field, Fieldset, FileUpload, Input, Select, Slider, UIComponentType } from "../src/index.js";

// ============================================================================
// INPUT
// ============================================================================

// File: src/forms/input/index.ts
// Export: Input.String
const inputStringExample = East.function([], UIComponentType, $ => {
    return Input.String("John", {
        placeholder: "Enter name",
        variant: "outline",
    });
});
inputStringExample.toIR().compile([])();

// File: src/forms/input/index.ts
// Export: Input.Integer
const inputIntegerExample = East.function([], UIComponentType, $ => {
    return Input.Integer(25n, {
        min: 0n,
        max: 150n,
    });
});
inputIntegerExample.toIR().compile([])();

// File: src/forms/input/index.ts
// Export: Input.Float
const inputFloatExample = East.function([], UIComponentType, $ => {
    return Input.Float(19.99, {
        min: 0,
        precision: 2n,
    });
});
inputFloatExample.toIR().compile([])();

// File: src/forms/input/index.ts
// Export: Input.DateTime
const inputDateTimeExample = East.function([], UIComponentType, $ => {
    return Input.DateTime(new Date(), {
        showTime: true,
        format: "yyyy-MM-dd HH:mm",
    });
});
inputDateTimeExample.toIR().compile([])();

// File: src/forms/input/index.ts
// Export: Input.Variant
const inputVariantExample = East.function([], UIComponentType, $ => {
    return Input.String("", {
        variant: Input.Variant("outline"),
    });
});
inputVariantExample.toIR().compile([])();

// File: src/forms/input/types.ts
// Export: InputVariant
const inputVariantTypesExample = East.function([], UIComponentType, $ => {
    return Input.String("", {
        variant: Input.Variant("outline"),
    });
});
inputVariantTypesExample.toIR().compile([])();

// ============================================================================
// SELECT
// ============================================================================

// File: src/forms/select/index.ts
// Export: createSelectItem (private function)
const selectItemExample = East.function([], UIComponentType, $ => {
    return Select.Root("", [
        Select.Item("us", "United States"),
        Select.Item("restricted", "Restricted", { disabled: true }),
    ]);
});
selectItemExample.toIR().compile([])();

// File: src/forms/select/index.ts
// Export: createSelectRoot (private function)
const selectRootExample = East.function([], UIComponentType, $ => {
    return Select.Root("", [
        Select.Item("us", "United States"),
        Select.Item("uk", "United Kingdom"),
        Select.Item("ca", "Canada"),
    ], {
        placeholder: "Select a country",
    });
});
selectRootExample.toIR().compile([])();

// File: src/forms/select/index.ts
// Export: Select namespace
const selectNamespaceExample = East.function([], UIComponentType, $ => {
    return Select.Root("", [
        Select.Item("us", "United States"),
        Select.Item("uk", "United Kingdom"),
        Select.Item("ca", "Canada"),
    ], {
        placeholder: "Select a country",
    });
});
selectNamespaceExample.toIR().compile([])();

// ============================================================================
// SLIDER
// ============================================================================

// File: src/forms/slider/index.ts
// Export: createSlider (private function)
const sliderExample = East.function([], UIComponentType, $ => {
    return Slider.Root(50.0, {
        min: 0,
        max: 100,
        step: 5,
        colorPalette: "blue",
    });
});
sliderExample.toIR().compile([])();

// File: src/forms/slider/index.ts
// Export: Slider namespace
const sliderNamespaceExample = East.function([], UIComponentType, $ => {
    return Slider.Root(50.0, {
        min: 0,
        max: 100,
        step: 1,
        colorPalette: "blue",
    });
});
sliderNamespaceExample.toIR().compile([])();

// File: src/forms/slider/types.ts
// Export: SliderVariant
const sliderVariantExample = East.function([], UIComponentType, $ => {
    return Slider.Root(50.0, {
        variant: Slider.Variant("subtle"),
    });
});
sliderVariantExample.toIR().compile([])();

// ============================================================================
// CHECKBOX
// ============================================================================

// File: src/forms/checkbox/index.ts
// Export: createCheckbox (private function)
const checkboxExample = East.function([], UIComponentType, $ => {
    return Checkbox.Root(true, {
        label: "Enable notifications",
        colorPalette: "blue",
        size: "md",
    });
});
checkboxExample.toIR().compile([])();

// File: src/forms/checkbox/index.ts
// Export: Checkbox.Root
const checkboxRootExample = East.function([], UIComponentType, $ => {
    return Checkbox.Root(true, {
        label: "Enable notifications",
        colorPalette: "blue",
        size: "md",
    });
});
checkboxRootExample.toIR().compile([])();

// ============================================================================
// FIELD
// ============================================================================

// File: src/forms/field/index.ts
// Export: createField (private function)
const fieldExample = East.function([], UIComponentType, $ => {
    return Field.Root(
        "Email",
        Input.String("", { placeholder: "Enter email" }),
        { helperText: "We'll never share your email" }
    );
});
fieldExample.toIR().compile([])();

// File: src/forms/field/index.ts
// Export: Field.Root
const fieldRootExample = East.function([], UIComponentType, $ => {
    return Field.Root(
        "Email",
        Input.String("", { placeholder: "Enter email" }),
        { helperText: "We'll never share your email" }
    );
});
fieldRootExample.toIR().compile([])();

// ============================================================================
// FIELDSET
// ============================================================================

// File: src/forms/fieldset/index.ts
// Export: createFieldset (private function)
const fieldsetExample = East.function([], UIComponentType, $ => {
    return Fieldset.Root([
        Field.Root("First Name", Input.String("", { placeholder: "First name" })),
        Field.Root("Last Name", Input.String("", { placeholder: "Last name" })),
    ], {
        legend: "Personal Information",
    });
});
fieldsetExample.toIR().compile([])();

// File: src/forms/fieldset/index.ts
// Export: Fieldset.Root
const fieldsetRootExample = East.function([], UIComponentType, $ => {
    return Fieldset.Root([
        Field.Root("First Name", Input.String("", { placeholder: "First name" })),
        Field.Root("Last Name", Input.String("", { placeholder: "Last name" })),
    ], {
        legend: "Personal Information",
    });
});
fieldsetRootExample.toIR().compile([])();

// ============================================================================
// FILE UPLOAD
// ============================================================================

// File: src/forms/file-upload/index.ts
// Export: createFileUpload (private function)
const fileUploadExample = East.function([], UIComponentType, $ => {
    return FileUpload.Root({
        accept: "image/*",
        maxFiles: 5n,
    });
});
fileUploadExample.toIR().compile([])();

// File: src/forms/file-upload/index.ts
// Export: FileUpload.Root
const fileUploadRootExample = East.function([], UIComponentType, $ => {
    return FileUpload.Root({
        accept: "image/*",
        maxFiles: 5n,
    });
});
fileUploadRootExample.toIR().compile([])();

// File: src/forms/file-upload/index.ts
// Export: FileUpload.Root (with all options)
const fileUploadFullExample = East.function([], UIComponentType, $ => {
    return FileUpload.Root({
        accept: "image/*",
        maxFiles: 3n,
        maxFileSize: 10n * 1024n * 1024n, // 10MB
        label: "Upload images",
        dropzoneText: "Drag images here",
        triggerText: "Browse",
    });
});
fileUploadFullExample.toIR().compile([])();

// File: src/forms/file-upload/index.ts
// Export: FileUpload.Root (mobile camera capture)
const fileUploadCaptureExample = East.function([], UIComponentType, $ => {
    return FileUpload.Root({
        accept: "image/*",
        capture: "environment",
        label: "Take photo",
    });
});
fileUploadCaptureExample.toIR().compile([])();

console.log("Forms TypeDoc examples compiled and executed successfully!");
