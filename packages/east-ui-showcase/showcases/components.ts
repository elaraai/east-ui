/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, StringType, OptionType } from "@elaraai/east";
import { Box, Text, UIComponentType, Stack, HoverCard, Icon, CodeBlock } from "@elaraai/east-ui";

/**
 * Strips leading indentation from multi-line strings.
 * Allows code examples to be naturally indented in source files.
 */
const dedent = East.function([StringType], StringType, ($, str) => {
    const lines = $.let(str.split("\n"));

    // Remove first line if empty
    $.if(East.greater(lines.size(), 0n).and($ => East.equal(lines.get(0n).trim().length(), 0n)), $ => {
        $(lines.popFirst());
    });

    // Remove last line if empty
    $.if(East.greater(lines.size(), 0n).and($ => East.equal(lines.get(lines.size().subtract(1n)).trim().length(), 0n)), $ => {
        $(lines.popLast());
    });

    // Find minimum indentation of non-empty lines
    const nonEmpty = $.let(lines.filter(($, line) => East.greater(line.trim().length(), 0n)));
    const indents = $.let(nonEmpty.map(($, line) => line.length().subtract(line.trimStart().length())));

    const minIndent = $.let(0n);
    $.if(East.greater(indents.size(), 0n), $ => {
        $.assign(minIndent, indents.minimum());
    });

    // Strip indentation and join
    $.return(lines.map(($, line) => line.substring(minIndent, line.length())).stringJoin("\n"));
});

/**
 * Creates a showcase card with title, description, content, and optional code example.
 * When code is provided, a code icon appears that shows the source on hover.
 * The code string is automatically dedented for clean display.
 * Shared component for all showcase files.
 */
export const ShowcaseCard = East.function(
    [StringType, StringType, UIComponentType, OptionType(StringType)],
    UIComponentType,
    ($, title, description, content, code) => {
        // Default title (no code icon)
        const titleRow = $.let(Text.Root(title, {
            fontWeight: "semibold",
            color: "gray.800"
        }));

        // If code is provided, replace with HStack containing title + code icon
        $.match(code, {
            some: ($, codeString) => $.assign(titleRow, Stack.HStack([
                Text.Root(title, {
                    fontWeight: "semibold",
                    color: "gray.800"
                }),
                HoverCard.Root(
                    Icon.Root("fas", "code", { color: "gray.400", size: "sm" }),
                    [Box.Root([
                        CodeBlock.Root(dedent(codeString), { 
                            language: "typescript", 
                            showCopyButton: true, 
                            title, 
                            wordWrap: true,
                        })], { maxHeight: "400px", maxWidth: "650px", overflow: "auto" })
                    ],
                    { placement: "left", openDelay: 100n }
                ),
            ], { gap: "2", justify: "space-between", width: "100%" })),
        });

        return Box.Root([
            Stack.VStack([
                titleRow,
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
