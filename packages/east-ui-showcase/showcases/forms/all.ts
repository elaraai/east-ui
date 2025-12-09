/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, some, StringType, IntegerType, FloatType, BooleanType, NullType, ArrayType, variant, DateTimeType } from "@elaraai/east";
import {
    UIComponentType,
    Grid,
    Stack,
    Input,
    Checkbox,
    Switch,
    Select,
    Slider,
    Textarea,
    TagsInput,
    FileUpload,
    Field,
    State,
    Reactive,
    Text,
    Badge,
} from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Forms showcase - demonstrates all form components.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // String Input
        const stringInput = $.let(
            ShowcaseCard(
                "String Input",
                "Text input with placeholder",
                Input.String("", { placeholder: "Enter your name", variant: "outline" }),
                some(`Input.String("", { placeholder: "Enter your name", variant: "outline" })`)
            )
        );

        // Integer Input
        const integerInput = $.let(
            ShowcaseCard(
                "Integer Input",
                "Numeric input with min/max",
                Input.Integer(0n, { min: 0n, max: 100n, step: 1n }),
                some(`Input.Integer(0n, { min: 0n, max: 100n, step: 1n })`)
            )
        );

        // Float Input
        const floatInput = $.let(
            ShowcaseCard(
                "Float Input",
                "Decimal input with precision",
                Input.Float(0.0, { min: 0, max: 100, step: 0.1, precision: 2n }),
                some(`Input.Float(0.0, { min: 0, max: 100, step: 0.1, precision: 2n })`)
            )
        );

        // DateTime Input
        const dateTimeInput = $.let(
            ShowcaseCard(
                "DateTime Input",
                "Date and time picker",
                Input.DateTime(new Date(), { showTime: true }),
                some(`Input.DateTime(new Date(), { showTime: true })`)
            )
        );

        // Input Sizes
        const inputSizes = $.let(
            ShowcaseCard(
                "Input Sizes",
                "Available sizes: xs, sm, md, lg",
                Stack.VStack([
                    Input.String("", { placeholder: "Extra Small", size: "xs" }),
                    Input.String("", { placeholder: "Small", size: "sm" }),
                    Input.String("", { placeholder: "Medium", size: "md" }),
                    Input.String("", { placeholder: "Large", size: "lg" }),
                ], { gap: "2", align: "stretch", width: "100%" }),
                some(`
                    Stack.VStack([
                        Input.String("", { placeholder: "Extra Small", size: "xs" }),
                        Input.String("", { placeholder: "Small", size: "sm" }),
                        Input.String("", { placeholder: "Medium", size: "md" }),
                        Input.String("", { placeholder: "Large", size: "lg" }),
                    ], { gap: "2", align: "stretch", width: "100%" })
                `)
            )
        );

        // Input Variants
        const inputVariants = $.let(
            ShowcaseCard(
                "Input Variants",
                "Available variants: outline, subtle, flushed",
                Stack.VStack([
                    Input.String("", { placeholder: "Outline", variant: "outline" }),
                    Input.String("", { placeholder: "Subtle", variant: "subtle" }),
                    Input.String("", { placeholder: "Flushed", variant: "flushed" }),
                ], { gap: "2", align: "stretch", width: "100%" }),
                some(`
                    Stack.VStack([
                        Input.String("", { placeholder: "Outline", variant: "outline" }),
                        Input.String("", { placeholder: "Subtle", variant: "subtle" }),
                        Input.String("", { placeholder: "Flushed", variant: "flushed" }),
                    ], { gap: "2", align: "stretch", width: "100%" })
                `)
            )
        );

        // Checkbox
        const checkbox = $.let(
            ShowcaseCard(
                "Checkbox",
                "Boolean selection control",
                Stack.VStack([
                    Checkbox.Root(false, { label: "Accept terms" }),
                    Checkbox.Root(true, { label: "Checked option", colorPalette: "blue" }),
                    Checkbox.Root(false, { label: "Indeterminate", indeterminate: true }),
                    Checkbox.Root(false, { label: "Disabled", disabled: true }),
                ], { gap: "3", align: "flex-start" }),
                some(`
                    Stack.VStack([
                        Checkbox.Root(false, { label: "Accept terms" }),
                        Checkbox.Root(true, { label: "Checked option", colorPalette: "blue" }),
                        Checkbox.Root(false, { label: "Indeterminate", indeterminate: true }),
                        Checkbox.Root(false, { label: "Disabled", disabled: true }),
                    ], { gap: "3", align: "flex-start" })
                `)
            )
        );

        // Switch
        const switchShowcase = $.let(
            ShowcaseCard(
                "Switch",
                "Toggle control for on/off states",
                Stack.VStack([
                    Switch.Root(false, { label: "Notifications" }),
                    Switch.Root(true, { label: "Dark mode", colorPalette: "blue" }),
                    Switch.Root(false, { label: "Feature flag", colorPalette: "green" }),
                    Switch.Root(false, { label: "Disabled", disabled: true }),
                ], { gap: "3", align: "flex-start" }),
                some(`
                    Stack.VStack([
                        Switch.Root(false, { label: "Notifications" }),
                        Switch.Root(true, { label: "Dark mode", colorPalette: "blue" }),
                        Switch.Root(false, { label: "Feature flag", colorPalette: "green" }),
                        Switch.Root(false, { label: "Disabled", disabled: true }),
                    ], { gap: "3", align: "flex-start" })
                `)
            )
        );

        // Select
        const selectShowcase = $.let(
            ShowcaseCard(
                "Select",
                "Dropdown selection control",
                Select.Root("", [
                    Select.Item("us", "United States"),
                    Select.Item("uk", "United Kingdom"),
                    Select.Item("ca", "Canada"),
                    Select.Item("au", "Australia"),
                ], { placeholder: "Select a country" }),
                some(`
                    Select.Root("", [
                        Select.Item("us", "United States"),
                        Select.Item("uk", "United Kingdom"),
                        Select.Item("ca", "Canada"),
                        Select.Item("au", "Australia"),
                    ], { placeholder: "Select a country" })
                `)
            )
        );

        // Slider
        const slider = $.let(
            ShowcaseCard(
                "Slider",
                "Numeric range selection",
                Stack.VStack([
                    Slider.Root(50.0, { min: 0, max: 100, colorPalette: "blue" }),
                    Slider.Root(25.0, { min: 0, max: 100, step: 25, colorPalette: "green" }),
                    Slider.Root(75.0, { min: 0, max: 100, disabled: true }),
                ], { gap: "4", align: "stretch", width: "100%" }),
                some(`
                    Stack.VStack([
                        Slider.Root(50.0, { min: 0, max: 100, colorPalette: "blue" }),
                        Slider.Root(25.0, { min: 0, max: 100, step: 25, colorPalette: "green" }),
                        Slider.Root(75.0, { min: 0, max: 100, disabled: true }),
                    ], { gap: "4", align: "stretch", width: "100%" })
                `)
            )
        );

        // Textarea
        const textarea = $.let(
            ShowcaseCard(
                "Textarea",
                "Multi-line text input",
                Textarea.Root("", {
                    placeholder: "Enter your message...",
                    rows: 4,
                    resize: "vertical",
                }),
                some(`
                    Textarea.Root("", {
                        placeholder: "Enter your message...",
                        rows: 4,
                        resize: "vertical",
                    })
                `)
            )
        );

        // Tags Input
        const tagsInput = $.let(
            ShowcaseCard(
                "Tags Input",
                "Multi-tag entry control",
                TagsInput.Root(["react", "typescript"], {
                    label: "Technologies",
                    placeholder: "Add tag...",
                    max: 5,
                    colorPalette: "blue",
                }),
                some(`
                    TagsInput.Root(["react", "typescript"], {
                        label: "Technologies",
                        placeholder: "Add tag...",
                        max: 5,
                        colorPalette: "blue",
                    })
                `)
            )
        );

        // File Upload
        const fileUpload = $.let(
            ShowcaseCard(
                "File Upload",
                "File selection with drag and drop",
                FileUpload.Root({
                    label: "Upload Files",
                    dropzoneText: "or drag and drop",
                    triggerText: "Choose files",
                    maxFiles: 5,
                    accept: "image/*",
                }),
                some(`
                    FileUpload.Root({
                        label: "Upload Files",
                        dropzoneText: "or drag and drop",
                        triggerText: "Choose files",
                        maxFiles: 5,
                        accept: "image/*",
                    })
                `)
            )
        );

        // Field wrapper
        const fieldShowcase = $.let(
            ShowcaseCard(
                "Field",
                "Wraps controls with labels and messages",
                Stack.VStack([
                    Field.Root(
                        "Email",
                        Input.String("", { placeholder: "you@example.com" }),
                        { helperText: "We'll never share your email." }
                    ),
                    Field.Root(
                        "Password",
                        Input.String("", { placeholder: "Enter password" }),
                        { required: true, errorText: "Password is required", invalid: true }
                    ),
                ], { gap: "4", align: "stretch", width: "100%" }),
                some(`
                    Stack.VStack([
                        Field.Root(
                            "Email",
                            Input.String("", { placeholder: "you@example.com" }),
                            { helperText: "We'll never share your email." }
                        ),
                        Field.Root(
                            "Password",
                            Input.String("", { placeholder: "Enter password" }),
                            { required: true, errorText: "Password is required", invalid: true }
                        ),
                    ], { gap: "4", align: "stretch", width: "100%" })
                `)
            )
        );

        // Checkbox sizes
        const checkboxSizes = $.let(
            ShowcaseCard(
                "Checkbox Sizes",
                "Size variations: sm, md, lg",
                Stack.HStack([
                    Checkbox.Root(true, { label: "Small", size: "sm", colorPalette: "blue" }),
                    Checkbox.Root(true, { label: "Medium", size: "md", colorPalette: "blue" }),
                    Checkbox.Root(true, { label: "Large", size: "lg", colorPalette: "blue" }),
                ], { gap: "4" }),
                some(`
                    Stack.HStack([
                        Checkbox.Root(true, { label: "Small", size: "sm", colorPalette: "blue" }),
                        Checkbox.Root(true, { label: "Medium", size: "md", colorPalette: "blue" }),
                        Checkbox.Root(true, { label: "Large", size: "lg", colorPalette: "blue" }),
                    ], { gap: "4" })
                `)
            )
        );

        // Switch sizes
        const switchSizes = $.let(
            ShowcaseCard(
                "Switch Sizes",
                "Size variations: sm, md, lg",
                Stack.HStack([
                    Switch.Root(true, { label: "SM", size: "sm", colorPalette: "green" }),
                    Switch.Root(true, { label: "MD", size: "md", colorPalette: "green" }),
                    Switch.Root(true, { label: "LG", size: "lg", colorPalette: "green" }),
                ], { gap: "4" }),
                some(`
                    Stack.HStack([
                        Switch.Root(true, { label: "SM", size: "sm", colorPalette: "green" }),
                        Switch.Root(true, { label: "MD", size: "md", colorPalette: "green" }),
                        Switch.Root(true, { label: "LG", size: "lg", colorPalette: "green" }),
                    ], { gap: "4" })
                `)
            )
        );

        // =====================================================================
        // INTERACTIVE EXAMPLES - Demonstrate callbacks with Reactive.Root
        // =====================================================================

        // Initialize state for interactive examples
        $(State.initTyped("form_text", "", StringType)());
        $(State.initTyped("form_integer", 0n, IntegerType)());
        $(State.initTyped("form_float", 50.0, FloatType)());
        $(State.initTyped("form_checkbox", false, BooleanType)());
        $(State.initTyped("form_switch", false, BooleanType)());
        $(State.initTyped("form_select", "", StringType)());
        $(State.initTyped("form_slider", 50.0, FloatType)());
        $(State.initTyped("form_textarea", "", StringType)());
        $(State.initTyped("form_tags", ["initial"], ArrayType(StringType))());
        $(State.initTyped("form_focus_count", 0n, IntegerType)());
        $(State.initTyped("form_blur_count", 0n, IntegerType)());
        $(State.initTyped("form_integer_input", 0n, IntegerType)());
        $(State.initTyped("form_float_input", 0.0, FloatType)());
        $(State.initTyped("form_datetime", new Date(), DateTimeType)());

        // Interactive String Input
        const interactiveStringInput = $.let(
            ShowcaseCard(
                "Interactive Input",
                "Type to see live updates via onChange callback",
                Reactive.Root($ => {
                    const text = $.let(State.readTyped("form_text", StringType)());
                    const focusCount = $.let(State.readTyped("form_focus_count", IntegerType)());
                    const blurCount = $.let(State.readTyped("form_blur_count", IntegerType)());

                    const onChange = East.function([StringType], NullType, ($, newValue) => {
                        $(State.writeTyped("form_text", some(newValue), StringType)());
                    });
                    const onFocus = East.function([], NullType, $ => {
                        const current = $.let(State.readTyped("form_focus_count", IntegerType)());
                        $(State.writeTyped("form_focus_count", some(current.unwrap('some').add(1n)), IntegerType)());
                    });
                    const onBlur = East.function([], NullType, $ => {
                        const current = $.let(State.readTyped("form_blur_count", IntegerType)());
                        $(State.writeTyped("form_blur_count", some(current.unwrap('some').add(1n)), IntegerType)());
                    });

                    return Stack.VStack([
                        Input.String(text.unwrap('some'), {
                            placeholder: "Type something...",
                            onChange,
                            onFocus,
                            onBlur
                        }),
                        Text.Root(East.str`You typed: ${text.unwrap('some')}`),
                        Text.Root(East.str`Length: ${text.unwrap('some').length()}`),
                        Stack.HStack([
                            Badge.Root(East.str`Focus: ${focusCount.unwrap('some')}`, { colorPalette: "blue" }),
                            Badge.Root(East.str`Blur: ${blurCount.unwrap('some')}`, { colorPalette: "orange" }),
                        ], { gap: "2" }),
                    ], { gap: "3", align: "stretch" });
                }),
                some(`
                Reactive.Root($ => {
                    const text = $.let(State.readTyped("form_text", StringType)());
                    const focusCount = $.let(State.readTyped("form_focus_count", IntegerType)());
                    const blurCount = $.let(State.readTyped("form_blur_count", IntegerType)());

                    const onChange = East.function([StringType], NullType, ($, newValue) => {
                        $(State.writeTyped("form_text", some(newValue), StringType)());
                    });
                    const onFocus = East.function([], NullType, $ => {
                        const current = $.let(State.readTyped("form_focus_count", IntegerType)());
                        $(State.writeTyped("form_focus_count", some(current.unwrap('some').add(1n)), IntegerType)());
                    });
                    const onBlur = East.function([], NullType, $ => {
                        const current = $.let(State.readTyped("form_blur_count", IntegerType)());
                        $(State.writeTyped("form_blur_count", some(current.unwrap('some').add(1n)), IntegerType)());
                    });

                    return Stack.VStack([
                        Input.String(text.unwrap('some'), {
                            placeholder: "Type something...",
                            onChange,
                            onFocus,
                            onBlur
                        }),
                        Text.Root(East.str\`You typed: \${text.unwrap('some')}\`),
                        Text.Root(East.str\`Length: \${text.unwrap('some').length()}\`),
                        Stack.HStack([
                            Badge.Root(East.str\`Focus: \${focusCount.unwrap('some')}\`, { colorPalette: "blue" }),
                            Badge.Root(East.str\`Blur: \${blurCount.unwrap('some')}\`, { colorPalette: "orange" }),
                        ], { gap: "2" }),
                    ], { gap: "3", align: "stretch" });
                })    
                `)
            )
        );

        // Interactive Checkbox
        const interactiveCheckbox = $.let(
            ShowcaseCard(
                "Interactive Checkbox",
                "Toggle to see state changes via onChange",
                Reactive.Root($ => {
                    const checked = $.let(State.readTyped("form_checkbox", BooleanType)());
                    const onChange = East.function([BooleanType], NullType, ($, newValue) => {
                        $(State.writeTyped("form_checkbox", some(newValue), BooleanType)());
                    });

                    return Stack.VStack([
                        Checkbox.Root(checked.unwrap('some'), {
                            label: "Click me!",
                            colorPalette: "blue",
                            onChange
                        }),
                        Badge.Root(
                            checked.unwrap('some').ifElse(_$ => "Checked!", _$ => "Unchecked"),
                            { colorPalette: checked.unwrap('some').ifElse(_$ => variant("green", null), _$ => variant("gray", null)) }
                        ),
                    ], { gap: "3", align: "flex-start" });
                }),
                some(`
                    Reactive.Root($ => {
                        const checked = $.let(State.readTyped("form_checkbox", BooleanType)());
                        const onChange = East.function([BooleanType], NullType, ($, newValue) => {
                            $(State.writeTyped("form_checkbox", some(newValue), BooleanType)());
                        });

                        return Stack.VStack([
                            Checkbox.Root(checked.unwrap('some'), {
                                label: "Click me!",
                                colorPalette: "blue",
                                onChange
                            }),
                            Badge.Root(
                                checked.unwrap('some').ifElse(_$ => "Checked!", _$ => "Unchecked"),
                                { colorPalette: checked.unwrap('some').ifElse(_$ => variant("green", null), _$ => variant("gray", null)) }
                            ),
                        ], { gap: "3", align: "flex-start" });
                    })
                `)
            )
        );

        // Interactive Switch
        const interactiveSwitch = $.let(
            ShowcaseCard(
                "Interactive Switch",
                "Toggle switch with live state feedback",
                Reactive.Root($ => {
                    const enabled = $.let(State.readTyped("form_switch", BooleanType)());
                    const onChange = East.function([BooleanType], NullType, ($, newValue) => {
                        $(State.writeTyped("form_switch", some(newValue), BooleanType)());
                    });

                    return Stack.VStack([
                        Switch.Root(enabled.unwrap('some'), {
                            label: "Enable feature",
                            colorPalette: "green",
                            onChange
                        }),
                        Badge.Root(
                            enabled.unwrap('some').ifElse(_$ => "Feature ON", _$ => "Feature OFF"),
                            {
                                colorPalette: enabled.unwrap('some').ifElse(_$ => variant("green", null), _$ => variant("red", null)),
                                variant: "solid"
                            }
                        ),
                    ], { gap: "3", align: "flex-start" });
                }),
                some(`
                    Reactive.Root($ => {
                        const enabled = $.let(State.readTyped("form_switch", BooleanType)());
                        const onChange = East.function([BooleanType], NullType, ($, newValue) => {
                            $(State.writeTyped("form_switch", some(newValue), BooleanType)());
                        });

                        return Stack.VStack([
                            Switch.Root(enabled.unwrap('some'), {
                                label: "Enable feature",
                                colorPalette: "green",
                                onChange
                            }),
                            Badge.Root(
                                enabled.unwrap('some').ifElse(_$ => "Feature ON", _$ => "Feature OFF"),
                                {
                                    colorPalette: enabled.unwrap('some').ifElse(_$ => variant("green", null), _$ => variant("red", null)),
                                    variant: "solid"
                                }
                            ),
                        ], { gap: "3", align: "flex-start" });
                    })
                `)
            )
        );

        // Interactive Slider
        const interactiveSlider = $.let(
            ShowcaseCard(
                "Interactive Slider",
                "Drag to see live value updates",
                Reactive.Root($ => {
                    const value = $.let(State.readTyped("form_slider", FloatType)());
                    const onChange = East.function([FloatType], NullType, ($, newValue) => {
                        $(State.writeTyped("form_slider", some(newValue), FloatType)());
                    });

                    return Stack.VStack([
                        Slider.Root(value.unwrap('some'), {
                            min: 0,
                            max: 100,
                            colorPalette: "blue",
                            onChange
                        }),
                        Text.Root(East.str`Value: ${East.print(value.unwrap('some'))}`),
                        Badge.Root(
                            East.str`${East.print(value.unwrap('some'))}%`,
                            { colorPalette: "blue", variant: "solid" }
                        ),
                    ], { gap: "3", align: "stretch" });
                }),
                some(`
                    Reactive.Root($ => {
                        const value = $.let(State.readTyped("form_slider", FloatType)());
                        const onChange = East.function([FloatType], NullType, ($, newValue) => {
                            $(State.writeTyped("form_slider", some(newValue), FloatType)());
                        });

                        return Stack.VStack([
                            Slider.Root(value.unwrap('some'), {
                                min: 0,
                                max: 100,
                                colorPalette: "blue",
                                onChange
                            }),
                            Text.Root(East.str\`Value: \${East.print(value.unwrap('some'))}\`),
                            Badge.Root(
                                East.str\`\${East.print(value.unwrap('some'))}%\`,
                                { colorPalette: "blue", variant: "solid" }
                            ),
                        ], { gap: "3", align: "stretch" });
                    })
                `)
            )
        );

        // Interactive Select
        const interactiveSelect = $.let(
            ShowcaseCard(
                "Interactive Select",
                "Select an option to see onChange callback",
                Reactive.Root($ => {
                    const selected = $.let(State.readTyped("form_select", StringType)());
                    const onChange = East.function([StringType], NullType, ($, newValue) => {
                        $(State.writeTyped("form_select", some(newValue), StringType)());
                    });

                    return Stack.VStack([
                        Select.Root(selected.unwrap('some'), [
                            Select.Item("apple", "Apple"),
                            Select.Item("banana", "Banana"),
                            Select.Item("cherry", "Cherry"),
                            Select.Item("date", "Date"),
                        ], { placeholder: "Pick a fruit", onChange }),
                        Text.Root(East.str`Selected: ${East.greater(selected.unwrap('some').length(), 0n).ifElse(
                            _$ => selected.unwrap('some'),
                            _$ => "(none)"
                        )}`),
                    ], { gap: "3", align: "stretch" });
                }),
                some(`
                    Reactive.Root($ => {
                        const selected = $.let(State.readTyped("form_select", StringType)());
                        const onChange = East.function([StringType], NullType, ($, newValue) => {
                            $(State.writeTyped("form_select", some(newValue), StringType)());
                        });

                        return Stack.VStack([
                            Select.Root(selected.unwrap('some'), [
                                Select.Item("apple", "Apple"),
                                Select.Item("banana", "Banana"),
                                Select.Item("cherry", "Cherry"),
                                Select.Item("date", "Date"),
                            ], { placeholder: "Pick a fruit", onChange }),
                            Text.Root(East.str\`Selected: \${East.greater(selected.unwrap('some').length(), 0n).ifElse(
                                _$ => selected.unwrap('some'),
                                _$ => "(none)"
                            )}\`),
                        ], { gap: "3", align: "stretch" });
                    })
                `)
            )
        );

        // Interactive Textarea
        const interactiveTextarea = $.let(
            ShowcaseCard(
                "Interactive Textarea",
                "Type to see character count update",
                Reactive.Root($ => {
                    const text = $.let(State.readTyped("form_textarea", StringType)());
                    const onChange = East.function([StringType], NullType, ($, newValue) => {
                        $(State.writeTyped("form_textarea", some(newValue), StringType)());
                    });

                    return Stack.VStack([
                        Textarea.Root(text.unwrap('some'), {
                            placeholder: "Write something...",
                            rows: 3,
                            onChange
                        }),
                        Stack.HStack([
                            Badge.Root(East.str`${text.unwrap('some').length()} chars`, { colorPalette: "blue" }),
                        ], { gap: "2" }),
                    ], { gap: "3", align: "stretch" });
                }),
                some(`
                    Reactive.Root($ => {
                        const text = $.let(State.readTyped("form_textarea", StringType)());
                        const onChange = East.function([StringType], NullType, ($, newValue) => {
                            $(State.writeTyped("form_textarea", some(newValue), StringType)());
                        });

                        return Stack.VStack([
                            Textarea.Root(text.unwrap('some'), {
                                placeholder: "Write something...",
                                rows: 3,
                                onChange
                            }),
                            Stack.HStack([
                                Badge.Root(East.str\`\${text.unwrap('some').length()} chars\`, { colorPalette: "blue" }),
                            ], { gap: "2" }),
                        ], { gap: "3", align: "stretch" });
                    })
                `)
            )
        );

        // Interactive Tags Input
        const interactiveTagsInput = $.let(
            ShowcaseCard(
                "Interactive Tags Input",
                "Add/remove tags to see onChange callback",
                Reactive.Root($ => {
                    const tags = $.let(State.readTyped("form_tags", ArrayType(StringType))());
                    const onChange = East.function([ArrayType(StringType)], NullType, ($, newValue) => {
                        $(State.writeTyped("form_tags", some(newValue), ArrayType(StringType))());
                    });

                    return Stack.VStack([
                        TagsInput.Root(tags.unwrap('some'), {
                            placeholder: "Add tag...",
                            colorPalette: "purple",
                            onChange
                        }),
                        Badge.Root(East.str`${tags.unwrap('some').size()} tags`, { colorPalette: "purple" }),
                    ], { gap: "3", align: "stretch" });
                }),
                some(`
                    Reactive.Root($ => {
                        const tags = $.let(State.readTyped("form_tags", ArrayType(StringType))());
                        const onChange = East.function([ArrayType(StringType)], NullType, ($, newValue) => {
                            $(State.writeTyped("form_tags", some(newValue), ArrayType(StringType))());
                        });

                        return Stack.VStack([
                            TagsInput.Root(tags.unwrap('some'), {
                                placeholder: "Add tag...",
                                colorPalette: "purple",
                                onChange
                            }),
                            Badge.Root(East.str\`\${tags.unwrap('some').size()} tags\`, { colorPalette: "purple" }),
                        ], { gap: "3", align: "stretch" });
                    })
                `)
            )
        );

        // Interactive Integer Input
        const interactiveIntegerInput = $.let(
            ShowcaseCard(
                "Interactive Integer Input",
                "Numeric input with live value display",
                Reactive.Root($ => {
                    const value = $.let(State.readTyped("form_integer_input", IntegerType)());
                    const onChange = East.function([IntegerType], NullType, ($, newValue) => {
                        $(State.writeTyped("form_integer_input", some(newValue), IntegerType)());
                    });

                    return Stack.VStack([
                        Input.Integer(value.unwrap('some'), {
                            min: 0n,
                            max: 1000n,
                            step: 1n,
                            onChange
                        }),
                        Text.Root(East.str`Value: ${value.unwrap('some')}`),
                        Badge.Root(
                            East.equal(value.unwrap('some').remainder(2n), 0n).ifElse(_$ => "Even", _$ => "Odd"),
                            { colorPalette: "teal", variant: "solid" }
                        ),
                    ], { gap: "3", align: "stretch" });
                }),
                some(`
                Reactive.Root($ => {
                    const value = $.let(State.readTyped("form_integer_input", IntegerType)());
                    const onChange = East.function([IntegerType], NullType, ($, newValue) => {
                        $(State.writeTyped("form_integer_input", some(newValue), IntegerType)());
                    });

                    return Stack.VStack([
                        Input.Integer(value.unwrap('some'), {
                            min: 0n,
                            max: 1000n,
                            step: 1n,
                            onChange
                        }),
                        Text.Root(East.str\`Value: \${value.unwrap('some')}\`),
                        Badge.Root(
                            East.equal(value.unwrap('some').remainder(2n), 0n).ifElse(_$ => "Even", _$ => "Odd"),
                            { colorPalette: "teal", variant: "solid" }
                        ),
                    ], { gap: "3", align: "stretch" });
                })
                `)
            )
        );

        // Interactive Float Input
        const interactiveFloatInput = $.let(
            ShowcaseCard(
                "Interactive Float Input",
                "Decimal input with precision display",
                Reactive.Root($ => {
                    const value = $.let(State.readTyped("form_float_input", FloatType)());
                    const onChange = East.function([FloatType], NullType, ($, newValue) => {
                        $(State.writeTyped("form_float_input", some(newValue), FloatType)());
                    });

                    return Stack.VStack([
                        Input.Float(value.unwrap('some'), {
                            min: 0,
                            max: 100,
                            step: 0.1,
                            precision: 2n,
                            onChange
                        }),
                        Text.Root(East.str`Value: ${East.print(value.unwrap('some'))}`),
                    ], { gap: "3", align: "stretch" });
                }),
                some(`
                    Reactive.Root($ => {
                        const value = $.let(State.readTyped("form_float_input", FloatType)());
                        const onChange = East.function([FloatType], NullType, ($, newValue) => {
                            $(State.writeTyped("form_float_input", some(newValue), FloatType)());
                        });

                        return Stack.VStack([
                            Input.Float(value.unwrap('some'), {
                                min: 0,
                                max: 100,
                                step: 0.1,
                                precision: 2n,
                                onChange
                            }),
                            Text.Root(East.str\`Value: \${East.print(value.unwrap('some'))}\`),
                        ], { gap: "3", align: "stretch" });
                    })
                `)
            )
        );

        // Interactive DateTime Input
        const interactiveDateTimeInput = $.let(
            ShowcaseCard(
                "Interactive DateTime Input",
                "Date picker with live value display",
                Reactive.Root($ => {
                    const value = $.let(State.readTyped("form_datetime", DateTimeType)());
                    const onChange = East.function([DateTimeType], NullType, ($, newValue) => {
                        $(State.writeTyped("form_datetime", some(newValue), DateTimeType)());
                    });

                    return Stack.VStack([
                        Input.DateTime(value.unwrap('some'), {
                            showTime: true,
                            onChange
                        }),
                        Text.Root(East.str`Year: ${value.unwrap('some').getYear()}`),
                        Text.Root(East.str`Month: ${value.unwrap('some').getMonth()}`),
                        Text.Root(East.str`Day: ${value.unwrap('some').getDayOfMonth()}`),
                    ], { gap: "3", align: "stretch" });
                }),
                some(`
                    Reactive.Root($ => {
                        const value = $.let(State.readTyped("form_datetime", DateTimeType)());
                        const onChange = East.function([DateTimeType], NullType, ($, newValue) => {
                            $(State.writeTyped("form_datetime", some(newValue), DateTimeType)());
                        });

                        return Stack.VStack([
                            Input.DateTime(value.unwrap('some'), {
                                showTime: true,
                                onChange
                            }),
                            Text.Root(East.str\`Year: \${value.unwrap('some').getYear()}\`),
                            Text.Root(East.str\`Month: \${value.unwrap('some').getMonth()}\`),
                            Text.Root(East.str\`Day: \${value.unwrap('some').getDayOfMonth()}\`),
                        ], { gap: "3", align: "stretch" });
                    })
                `)
            )
        );

        return Grid.Root(
            [
                // Static examples
                Grid.Item(stringInput),
                Grid.Item(integerInput),
                Grid.Item(floatInput),
                Grid.Item(dateTimeInput),
                Grid.Item(inputSizes),
                Grid.Item(inputVariants),
                Grid.Item(checkbox),
                Grid.Item(switchShowcase),
                Grid.Item(checkboxSizes),
                Grid.Item(switchSizes),
                Grid.Item(selectShowcase),
                Grid.Item(slider),
                Grid.Item(textarea),
                Grid.Item(tagsInput),
                Grid.Item(fileUpload, { colSpan: "2" }),
                Grid.Item(fieldShowcase, { colSpan: "2" }),
                // Interactive examples with callbacks
                Grid.Item(interactiveStringInput),
                Grid.Item(interactiveIntegerInput),
                Grid.Item(interactiveFloatInput),
                Grid.Item(interactiveDateTimeInput),
                Grid.Item(interactiveCheckbox),
                Grid.Item(interactiveSwitch),
                Grid.Item(interactiveSlider),
                Grid.Item(interactiveSelect),
                Grid.Item(interactiveTextarea),
                Grid.Item(interactiveTagsInput, { colSpan: "2" }),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
