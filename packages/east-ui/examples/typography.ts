/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

/**
 * Typography Example
 *
 * Demonstrates the Text component with various styling options.
 * Open this file with the East UI Preview extension to see the rendered output.
 */

import { East } from "@elaraai/east";
import type { CallableFunctionExpr } from "@elaraai/east/internal";
import { UIComponentType, Text, Stack } from "../src/index.js";

const example: CallableFunctionExpr<[], typeof UIComponentType> = East.function(
    [],
    UIComponentType,
    () => {
        return Stack.Root([
            // Basic text
            Text.Root("Basic Text"),

            // Text with background
            Text.Root("Text with Background", {
                color: "white",
                background: "purple.600",
            }),

            // Bold text
            Text.Root("Bold Text", {
                fontWeight: "bold",
            }),

            // Italic text
            Text.Root("Italic Text", {
                fontStyle: "italic",
            }),

            // Different font sizes
            Text.Root("Extra Small Text", { 
                fontSize: "xs" 
            }),
            Text.Root("Small Text", { 
                fontSize: "sm" 
            }),
            Text.Root("Medium Text", { 
                fontSize: "md" 
            }),
            Text.Root("Large Text", { 
                fontSize: "lg" 
            }),

            // Text transforms
            Text.Root("uppercase text", {
                textTransform: "uppercase",
            }),
            Text.Root("LOWERCASE TEXT", {
                textTransform: "lowercase",
            }),
            Text.Root("capitalize each word", {
                textTransform: "capitalize",
            }),

            // Text alignment
            Text.Root("Left Aligned", { textAlign: "left" }),
            Text.Root("Center Aligned", { textAlign: "center" }),
            Text.Root("Right Aligned", { textAlign: "right" }),

            // Text with border
            Text.Root("Text with Border", {
                borderWidth: "thin",
                borderStyle: "solid",
                borderColor: "gray.300",
            }),

            // Fully styled text
            Text.Root("Fully Styled Text", {
                color: "white",
                background: "teal.500",
                fontWeight: "semibold",
                fontStyle: "italic",
                fontSize: "lg",
                textTransform: "uppercase",
                textAlign: "center",
                borderWidth: "medium",
                borderStyle: "dashed",
                borderColor: "teal.700",
            }),
        ], {
            gap: "4",
            direction: "column",
        });
    }
);

export default example;
