/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, some } from "@elaraai/east";
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

        return Grid.Root(
            [
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
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
