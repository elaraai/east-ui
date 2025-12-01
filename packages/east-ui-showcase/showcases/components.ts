/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, StringType } from "@elaraai/east";
import { Box, Text, UIComponentType, Stack } from "@elaraai/east-ui";

/**
 * Creates a showcase card with title, description, and content.
 * Shared component for all showcase files.
 */
export const ShowcaseCard = East.function(
    [StringType, StringType, UIComponentType],
    UIComponentType,
    ($, title, description, content) => {
        return Box.Root([
            Stack.VStack([
                Text.Root(title, {
                    fontWeight: "semibold",
                    color: "gray.800"
                }),
                Text.Root(description, {
                    color: "gray.500",
                    fontSize: "sm"
                }),
                Box.Root([content], {
                    padding: "4",
                    background: "gray.50",
                    borderRadius: "md",
                    display: "flex",
                    alignItems: "center",
                }),
            ], { gap: "3", align: "stretch" }),
        ], {
            padding: "5",
            background: "white",
            borderRadius: "lg",
        });
    }
);
