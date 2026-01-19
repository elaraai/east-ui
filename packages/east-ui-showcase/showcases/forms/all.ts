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
    Accordion,
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
                Input.DateTime(new Date(), { precision: 'datetime' }),
                some(`Input.DateTime(new Date(), { precision: 'datetime' })`)
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
                    Field.StringInput(
                        "Email",
                        "",
                        { helperText: "We'll never share your email.", placeholder: "you@example.com" }
                    ),
                    Field.StringInput(
                        "Password",
                        "",
                        { required: true, errorText: "Password is required", invalid: true, placeholder: "Enter password" }
                    ),
                ], { gap: "4", align: "stretch", width: "100%" }),
                some(`
                    Stack.VStack([
                        Field.StringInput(
                            "Email",
                            "",
                            { helperText: "We'll never share your email.", placeholder: "you@example.com" }
                        ),
                        Field.StringInput(
                            "Password",
                            "",
                            { required: true, errorText: "Password is required", invalid: true, placeholder: "Enter password" }
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
        $.if(State.has("form_string_input").not(), $ => {
            $(State.write([StringType], "form_string_input", "hello"));
        });
        $.if(State.has("form_integer").not(), $ => {
            $(State.write([IntegerType], "form_integer", 0n));
        });
        $.if(State.has("form_float").not(), $ => {
            $(State.write([FloatType], "form_float", 50.0));
        });
        $.if(State.has("form_checkbox").not(), $ => {
            $(State.write([BooleanType], "form_checkbox", false));
        });
        $.if(State.has("form_switch").not(), $ => {
            $(State.write([BooleanType], "form_switch", false));
        });
        $.if(State.has("form_select").not(), $ => {
            $(State.write([StringType], "form_select", ""));
        });
        $.if(State.has("form_slider").not(), $ => {
            $(State.write([FloatType], "form_slider", 50.0));
        });
        $.if(State.has("form_textarea").not(), $ => {
            $(State.write([StringType], "form_textarea", ""));
        });
        $.if(State.has("form_tags").not(), $ => {
            $(State.write([ArrayType(StringType)], "form_tags", ["initial"]));
        });
        $.if(State.has("form_focus_count").not(), $ => {
            $(State.write([IntegerType], "form_focus_count", 0n));
        });
        $.if(State.has("form_blur_count").not(), $ => {
            $(State.write([IntegerType], "form_blur_count", 0n));
        });
        $.if(State.has("form_integer_input").not(), $ => {
            $(State.write([IntegerType], "form_integer_input", 0n));
        });
        $.if(State.has("form_float_input").not(), $ => {
            $(State.write([FloatType], "form_float_input", 0.0));
        });
        $.if(State.has("form_datetime_input").not(), $ => {
            $(State.write([DateTimeType], "form_datetime_input", new Date()));
        });

        // Interactive String Input
        const interactiveStringInput = $.let(
            ShowcaseCard(
                "Interactive Input",
                "Type to see live updates via onChange callback",
                Reactive.Root(East.function([], UIComponentType, $ => {
                    const text = $.let(State.read([StringType], "form_string_input"));
                    const focusCount = $.let(State.read([IntegerType], "form_focus_count"));
                    const blurCount = $.let(State.read([IntegerType], "form_blur_count"));

                    const onChange = East.function([StringType], NullType, ($, newValue) => {
                        $(State.write([StringType], "form_string_input", newValue));
                    });
                    const onFocus = East.function([], NullType, $ => {
                        const current = $.let(State.read([IntegerType], "form_focus_count"));
                        $(State.write([IntegerType], "form_focus_count", current.add(1n)));
                    });
                    const onBlur = East.function([], NullType, $ => {
                        const current = $.let(State.read([IntegerType], "form_blur_count"));
                        $(State.write([IntegerType], "form_blur_count", current.add(1n)));
                    });

                    return Stack.VStack([
                        Input.String(text, {
                            placeholder: "Type something...",
                            onChange,
                            onFocus,
                            onBlur
                        }),
                        Text.Root(East.str`You typed: ${text}`),
                        Text.Root(East.str`Length: ${text.length()}`),
                        Stack.HStack([
                            Badge.Root(East.str`Focus: ${focusCount}`, { colorPalette: "blue" }),
                            Badge.Root(East.str`Blur: ${blurCount}`, { colorPalette: "orange" }),
                        ], { gap: "2" }),
                    ], { gap: "3", align: "stretch" });
                })),
                some(`
                Reactive.Root(East.function([], UIComponentType, $ => {
                    const text = $.let(State.read([StringType], "form_string_input"));
                    const focusCount = $.let(State.read([IntegerType], "form_focus_count"));
                    const blurCount = $.let(State.read([IntegerType], "form_blur_count"));

                    const onChange = East.function([StringType], NullType, ($, newValue) => {
                        $(State.write([StringType], "form_string_input", newValue));
                    });
                    const onFocus = East.function([], NullType, $ => {
                        const current = $.let(State.read([IntegerType], "form_focus_count"));
                        $(State.write([IntegerType], "form_focus_count", current.add(1n)));
                    });
                    const onBlur = East.function([], NullType, $ => {
                        const current = $.let(State.read([IntegerType], "form_blur_count"));
                        $(State.write([IntegerType], "form_blur_count", current.add(1n)));
                    });

                    return Stack.VStack([
                        Input.String(text, {
                            placeholder: "Type something...",
                            onChange,
                            onFocus,
                            onBlur
                        }),
                        Text.Root(East.str\`You typed: \${text}\`),
                        Text.Root(East.str\`Length: \${text.length()}\`),
                        Stack.HStack([
                            Badge.Root(East.str\`Focus: \${focusCount}\`, { colorPalette: "blue" }),
                            Badge.Root(East.str\`Blur: \${blurCount}\`, { colorPalette: "orange" }),
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
                Reactive.Root(East.function([], UIComponentType, $ => {
                    const checked = $.let(State.read([BooleanType], "form_checkbox"));
                    const onChange = East.function([BooleanType], NullType, ($, newValue) => {
                        $(State.write([BooleanType], "form_checkbox", newValue));
                    });

                    return Stack.VStack([
                        Checkbox.Root(checked, {
                            label: "Click me!",
                            colorPalette: "blue",
                            onChange
                        }),
                        Badge.Root(
                            checked.ifElse(_$ => "Checked!", _$ => "Unchecked"),
                            { colorPalette: checked.ifElse(_$ => variant("green", null), _$ => variant("gray", null)) }
                        ),
                    ], { gap: "3", align: "flex-start" });
                })),
                some(`
                    Reactive.Root(East.function([], UIComponentType, $ => {
                        const checked = $.let(State.read([BooleanType], "form_checkbox"));
                        const onChange = East.function([BooleanType], NullType, ($, newValue) => {
                            $(State.write([BooleanType], "form_checkbox", newValue));
                        });

                        return Stack.VStack([
                            Checkbox.Root(checked, {
                                label: "Click me!",
                                colorPalette: "blue",
                                onChange
                            }),
                            Badge.Root(
                                checked.ifElse(_$ => "Checked!", _$ => "Unchecked"),
                                { colorPalette: checked.ifElse(_$ => variant("green", null), _$ => variant("gray", null)) }
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
                Reactive.Root(East.function([], UIComponentType, $ => {
                    const enabled = $.let(State.read([BooleanType], "form_switch"));
                    const onChange = East.function([BooleanType], NullType, ($, newValue) => {
                        $(State.write([BooleanType], "form_switch", newValue));
                    });

                    return Stack.VStack([
                        Switch.Root(enabled, {
                            label: "Enable feature",
                            colorPalette: "green",
                            onChange
                        }),
                        Badge.Root(
                            enabled.ifElse(_$ => "Feature ON", _$ => "Feature OFF"),
                            {
                                colorPalette: enabled.ifElse(_$ => variant("green", null), _$ => variant("red", null)),
                                variant: "solid"
                            }
                        ),
                    ], { gap: "3", align: "flex-start" });
                })),
                some(`
                    Reactive.Root(East.function([], UIComponentType, $ => {
                        const enabled = $.let(State.read([BooleanType], "form_switch"));
                        const onChange = East.function([BooleanType], NullType, ($, newValue) => {
                            $(State.write([BooleanType], "form_switch", newValue));
                        });

                        return Stack.VStack([
                            Switch.Root(enabled, {
                                label: "Enable feature",
                                colorPalette: "green",
                                onChange
                            }),
                            Badge.Root(
                                enabled.ifElse(_$ => "Feature ON", _$ => "Feature OFF"),
                                {
                                    colorPalette: enabled.ifElse(_$ => variant("green", null), _$ => variant("red", null)),
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
                Reactive.Root(East.function([], UIComponentType, $ => {
                    const value = $.let(State.read([FloatType], "form_slider"));
                    const onChange = East.function([FloatType], NullType, ($, newValue) => {
                        $(State.write([FloatType], "form_slider", newValue));
                    });

                    return Stack.VStack([
                        Slider.Root(value, {
                            min: 0,
                            max: 100,
                            colorPalette: "blue",
                            onChange
                        }),
                        Text.Root(East.str`Value: ${East.print(value)}`),
                        Badge.Root(
                            East.str`${East.print(value)}%`,
                            { colorPalette: "blue", variant: "solid" }
                        ),
                    ], { gap: "3", align: "stretch" });
                })),
                some(`
                    Reactive.Root(East.function([], UIComponentType, $ => {
                        const value = $.let(State.read([FloatType], "form_slider"));
                        const onChange = East.function([FloatType], NullType, ($, newValue) => {
                            $(State.write([FloatType], "form_slider", newValue));
                        });

                        return Stack.VStack([
                            Slider.Root(value, {
                                min: 0,
                                max: 100,
                                colorPalette: "blue",
                                onChange
                            }),
                            Text.Root(East.str\`Value: \${East.print(value)}\`),
                            Badge.Root(
                                East.str\`\${East.print(value)}%\`,
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
                Reactive.Root(East.function([], UIComponentType, $ => {
                    const selected = $.let(State.read([StringType], "form_select"));
                    const onChange = East.function([StringType], NullType, ($, newValue) => {
                        $(State.write([StringType], "form_select", newValue));
                    });

                    return Stack.VStack([
                        Select.Root(selected, [
                            Select.Item("apple", "Apple"),
                            Select.Item("banana", "Banana"),
                            Select.Item("cherry", "Cherry"),
                            Select.Item("date", "Date"),
                        ], { placeholder: "Pick a fruit", onChange }),
                        Text.Root(East.str`Selected: ${East.greater(selected.length(), 0n).ifElse(
                            _$ => selected,
                            _$ => "(none)"
                        )}`),
                    ], { gap: "3", align: "stretch" });
                })),
                some(`
                    Reactive.Root(East.function([], UIComponentType, $ => {
                        const selected = $.let(State.read([StringType], "form_select"));
                        const onChange = East.function([StringType], NullType, ($, newValue) => {
                            $(State.write([StringType], "form_select", newValue));
                        });

                        return Stack.VStack([
                            Select.Root(selected, [
                                Select.Item("apple", "Apple"),
                                Select.Item("banana", "Banana"),
                                Select.Item("cherry", "Cherry"),
                                Select.Item("date", "Date"),
                            ], { placeholder: "Pick a fruit", onChange }),
                            Text.Root(East.str\`Selected: \${East.greater(selected.length(), 0n).ifElse(
                                _$ => selected,
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
                Reactive.Root(East.function([], UIComponentType, $ => {
                    const text = $.let(State.read([StringType], "form_textarea"));
                    const onChange = East.function([StringType], NullType, ($, newValue) => {
                        $(State.write([StringType], "form_textarea", newValue));
                    });

                    return Stack.VStack([
                        Textarea.Root(text, {
                            placeholder: "Write something...",
                            rows: 3,
                            onChange
                        }),
                        Stack.HStack([
                            Badge.Root(East.str`${text.length()} chars`, { colorPalette: "blue" }),
                        ], { gap: "2" }),
                    ], { gap: "3", align: "stretch" });
                })),
                some(`
                    Reactive.Root(East.function([], UIComponentType, $ => {
                        const text = $.let(State.read([StringType], "form_textarea"));
                        const onChange = East.function([StringType], NullType, ($, newValue) => {
                            $(State.write([StringType], "form_textarea", newValue));
                        });

                        return Stack.VStack([
                            Textarea.Root(text, {
                                placeholder: "Write something...",
                                rows: 3,
                                onChange
                            }),
                            Stack.HStack([
                                Badge.Root(East.str\`\${text.length()} chars\`, { colorPalette: "blue" }),
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
                Reactive.Root(East.function([], UIComponentType, $ => {
                    const tags = $.let(State.read([ArrayType(StringType)], "form_tags"));
                    const onChange = East.function([ArrayType(StringType)], NullType, ($, newValue) => {
                        $(State.write([ArrayType(StringType)], "form_tags", newValue));
                    });

                    return Stack.VStack([
                        TagsInput.Root(tags, {
                            placeholder: "Add tag...",
                            colorPalette: "purple",
                            onChange
                        }),
                        Badge.Root(East.str`${tags.size()} tags`, { colorPalette: "purple" }),
                    ], { gap: "3", align: "stretch" });
                })),
                some(`
                    Reactive.Root(East.function([], UIComponentType, $ => {
                        const tags = $.let(State.read([ArrayType(StringType)], "form_tags"));
                        const onChange = East.function([ArrayType(StringType)], NullType, ($, newValue) => {
                            $(State.write([ArrayType(StringType)], "form_tags", newValue));
                        });

                        return Stack.VStack([
                            TagsInput.Root(tags, {
                                placeholder: "Add tag...",
                                colorPalette: "purple",
                                onChange
                            }),
                            Badge.Root(East.str\`\${tags.size()} tags\`, { colorPalette: "purple" }),
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
                Reactive.Root(East.function([], UIComponentType, $ => {
                    const value = $.let(State.read([IntegerType], "form_integer_input"));
                    const onChange = East.function([IntegerType], NullType, ($, newValue) => {
                        $(State.write([IntegerType], "form_integer_input", newValue));
                    });

                    return Stack.VStack([
                        Input.Integer(value, {
                            min: 0n,
                            max: 1000n,
                            step: 1n,
                            onChange
                        }),
                        Text.Root(East.str`Value: ${value}`),
                        Badge.Root(
                            East.equal(value.remainder(2n), 0n).ifElse(_$ => "Even", _$ => "Odd"),
                            { colorPalette: "teal", variant: "solid" }
                        ),
                    ], { gap: "3", align: "stretch" });
                })),
                some(`
                Reactive.Root(East.function([], UIComponentType, $ => {
                    const value = $.let(State.read([IntegerType], "form_integer_input"));
                    const onChange = East.function([IntegerType], NullType, ($, newValue) => {
                        $(State.write([IntegerType], "form_integer_input", newValue));
                    });

                    return Stack.VStack([
                        Input.Integer(value, {
                            min: 0n,
                            max: 1000n,
                            step: 1n,
                            onChange
                        }),
                        Text.Root(East.str\`Value: \${value}\`),
                        Badge.Root(
                            East.equal(value.remainder(2n), 0n).ifElse(_$ => "Even", _$ => "Odd"),
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
                Reactive.Root(East.function([], UIComponentType, $ => {
                    const value = $.let(State.read([FloatType], "form_float_input"));
                    const onChange = East.function([FloatType], NullType, ($, newValue) => {
                        $(State.write([FloatType], "form_float_input", newValue));
                    });

                    return Stack.VStack([
                        Input.Float(value, {
                            min: 0,
                            max: 100,
                            step: 0.1,
                            precision: 2n,
                            onChange
                        }),
                        Text.Root(East.str`Value: ${East.print(value)}`),
                    ], { gap: "3", align: "stretch" });
                })),
                some(`
                    Reactive.Root(East.function([], UIComponentType, $ => {
                        const value = $.let(State.read([FloatType], "form_float_input"));
                        const onChange = East.function([FloatType], NullType, ($, newValue) => {
                            $(State.write([FloatType], "form_float_input", newValue));
                        });

                        return Stack.VStack([
                            Input.Float(value, {
                                min: 0,
                                max: 100,
                                step: 0.1,
                                precision: 2n,
                                onChange
                            }),
                            Text.Root(East.str\`Value: \${East.print(value)}\`),
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
                Reactive.Root(East.function([], UIComponentType, $ => {
                    const value = $.let(State.read([DateTimeType], "form_datetime_input"));
                    const onChange = East.function([DateTimeType], NullType, ($, newValue) => {
                        $(State.write([DateTimeType], "form_datetime_input", newValue));
                    });

                    return Stack.VStack([
                        Input.DateTime(value, {
                            onChange
                        }),
                        Text.Root(East.str`Year: ${value.getYear()}`),
                        Text.Root(East.str`Month: ${value.getMonth()}`),
                        Text.Root(East.str`Day: ${value.getDayOfMonth()}`),
                    ], { gap: "3", align: "stretch" });
                })),
                some(`
                    Reactive.Root(East.function([], UIComponentType, $ => {
                        const value = $.let(State.read([DateTimeType], "form_datetime_input"));
                        const onChange = East.function([DateTimeType], NullType, ($, newValue) => {
                            $(State.write([DateTimeType], "form_datetime_input", newValue));
                        });

                        return Stack.VStack([
                            Input.DateTime(value, {
                                showTime: true,
                                onChange
                            }),
                            Text.Root(East.str\`Year: \${value.getYear()}\`),
                            Text.Root(East.str\`Month: \${value.getMonth()}\`),
                            Text.Root(East.str\`Day: \${value.getDayOfMonth()}\`),
                        ], { gap: "3", align: "stretch" });
                    })
                `)
            )
        );

        return Accordion.Root([
            Accordion.Item("input", "Input", [
                Grid.Root([
                    Grid.Item(stringInput),
                    Grid.Item(integerInput),
                    Grid.Item(floatInput),
                    Grid.Item(dateTimeInput),
                    Grid.Item(inputSizes),
                    Grid.Item(inputVariants),
                ], { templateColumns: "repeat(2, 1fr)", gap: "4" }),
            ]),
            Accordion.Item("toggles", "Toggles", [
                Grid.Root([
                    Grid.Item(checkbox),
                    Grid.Item(switchShowcase),
                    Grid.Item(checkboxSizes),
                    Grid.Item(switchSizes),
                ], { templateColumns: "repeat(2, 1fr)", gap: "4" }),
            ]),
            Accordion.Item("selection", "Selection", [
                Grid.Root([
                    Grid.Item(selectShowcase),
                    Grid.Item(slider),
                ], { templateColumns: "repeat(2, 1fr)", gap: "4" }),
            ]),
            Accordion.Item("text", "Text Input", [
                Grid.Root([
                    Grid.Item(textarea),
                    Grid.Item(tagsInput),
                ], { templateColumns: "repeat(2, 1fr)", gap: "4" }),
            ]),
            Accordion.Item("file-field", "File & Field", [
                Grid.Root([
                    Grid.Item(fileUpload, { colSpan: "2" }),
                    Grid.Item(fieldShowcase, { colSpan: "2" }),
                ], { templateColumns: "repeat(2, 1fr)", gap: "4" }),
            ]),
            Accordion.Item("interactive", "Interactive Examples", [
                Grid.Root([
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
                ], { templateColumns: "repeat(2, 1fr)", gap: "4" }),
            ]),
        ], { multiple: true, collapsible: true });
    }
);
