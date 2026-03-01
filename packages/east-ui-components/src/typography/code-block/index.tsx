/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { CodeBlock as ChakraCodeBlock, IconButton, Box, createShikiAdapter } from "@chakra-ui/react";
import { createHighlighter, type HighlighterGeneric } from "shiki";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { CodeBlock } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define the equality function at module level
const codeBlockEqual = equalFor(CodeBlock.Types.CodeBlock);

// Cache the highlighter promise so it's only created once
let highlighterPromise: Promise<HighlighterGeneric<any, any>> | null = null;

function getHighlighter(): Promise<HighlighterGeneric<any, any>> {
    if (!highlighterPromise) {
        highlighterPromise = createHighlighter({
            langs: [
                "typescript",
                "javascript",
                "json",
                "html",
                "css",
                "python",
                "rust",
                "go",
                "sql",
                "bash",
                "markdown",
                "yaml",
                "xml",
            ],
            themes: ["github-dark"],
        });
    }
    return highlighterPromise;
}

// Create a singleton Shiki adapter that uses the cached highlighter
const shikiAdapter = createShikiAdapter<HighlighterGeneric<any, any>>({
    load: getHighlighter,
    theme: "github-dark",
});

/** East CodeBlock value type */
export type CodeBlockValue = ValueTypeOf<typeof CodeBlock.Types.CodeBlock>;

export interface CodeBlockProps {
    language?: string | undefined;
    showLineNumbers?: boolean | undefined;
    highlightLines?: number[] | undefined;
    maxHeight?: string | undefined;
    showCopyButton?: boolean | undefined;
    title?: string | undefined;
    overflow?: string | undefined;
    overflowX?: string | undefined;
    overflowY?: string | undefined;
    width?: string | undefined;
    height?: string | undefined;
    minWidth?: string | undefined;
    minHeight?: string | undefined;
    maxWidth?: string | undefined;
    pt?: string | undefined;
    pr?: string | undefined;
    pb?: string | undefined;
    pl?: string | undefined;
    mt?: string | undefined;
    mr?: string | undefined;
    mb?: string | undefined;
    ml?: string | undefined;
    opacity?: number | undefined;
}

/**
 * Converts an East UI CodeBlock value to component props.
 * Pure function - easy to test independently.
 */
export function toCodeBlockProps(value: CodeBlockValue): CodeBlockProps {
    // Language is now a variant - extract the tag name
    const languageVariant = getSomeorUndefined(value.language);
    const language = languageVariant?.type;

    // Convert bigint[] to number[] for highlightLines
    const highlightLinesBigint = getSomeorUndefined(value.highlightLines);
    const highlightLines = highlightLinesBigint?.map(n => Number(n));

    const padding = getSomeorUndefined(value.padding);
    const margin = getSomeorUndefined(value.margin);

    return {
        language,
        showLineNumbers: getSomeorUndefined(value.showLineNumbers),
        highlightLines,
        maxHeight: getSomeorUndefined(value.maxHeight),
        showCopyButton: getSomeorUndefined(value.showCopyButton),
        title: getSomeorUndefined(value.title),
        overflow: getSomeorUndefined(value.overflow)?.type,
        overflowX: getSomeorUndefined(value.overflowX)?.type,
        overflowY: getSomeorUndefined(value.overflowY)?.type,
        width: getSomeorUndefined(value.width),
        height: getSomeorUndefined(value.height),
        minWidth: getSomeorUndefined(value.minWidth),
        minHeight: getSomeorUndefined(value.minHeight),
        maxWidth: getSomeorUndefined(value.maxWidth),
        pt: padding ? getSomeorUndefined(padding.top) : undefined,
        pr: padding ? getSomeorUndefined(padding.right) : undefined,
        pb: padding ? getSomeorUndefined(padding.bottom) : undefined,
        pl: padding ? getSomeorUndefined(padding.left) : undefined,
        mt: margin ? getSomeorUndefined(margin.top) : undefined,
        mr: margin ? getSomeorUndefined(margin.right) : undefined,
        mb: margin ? getSomeorUndefined(margin.bottom) : undefined,
        ml: margin ? getSomeorUndefined(margin.left) : undefined,
        opacity: getSomeorUndefined(value.opacity),
    };
}

export interface EastChakraCodeBlockProps {
    value: CodeBlockValue;
}

/**
 * Renders an East UI CodeBlock value using Chakra UI CodeBlock component
 * with Shiki syntax highlighting.
 *
 * @remarks
 * This component automatically sets up syntax highlighting using Shiki.
 * Supported languages: typescript, javascript, json, html, css, python,
 * rust, go, sql, bash, markdown, yaml, xml.
 */
export const EastChakraCodeBlock = memo(function EastChakraCodeBlock({ value }: EastChakraCodeBlockProps) {
    const props = useMemo(() => toCodeBlockProps(value), [value]);

    const meta = useMemo(() => {
        const result: { showLineNumbers?: boolean; highlightLines?: number[] } = {};
        if (props.showLineNumbers !== undefined) {
            result.showLineNumbers = props.showLineNumbers;
        }
        if (props.highlightLines !== undefined) {
            result.highlightLines = props.highlightLines;
        }
        return Object.keys(result).length > 0 ? result : undefined;
    }, [props.showLineNumbers, props.highlightLines]);

    const showHeader = props.title || props.showCopyButton;

    return (
        <ChakraCodeBlock.AdapterProvider value={shikiAdapter}>
            <Box
                    maxHeight={props.maxHeight}
                    overflow={props.overflow ?? "auto"}
                    overflowX={props.overflowX}
                    overflowY={props.overflowY}
                    width={props.width}
                    height={props.height}
                    minWidth={props.minWidth}
                    minHeight={props.minHeight}
                    maxWidth={props.maxWidth}
                    pt={props.pt}
                    pr={props.pr}
                    pb={props.pb}
                    pl={props.pl}
                    mt={props.mt}
                    mr={props.mr}
                    mb={props.mb}
                    ml={props.ml}
                    opacity={props.opacity}
                >
                <ChakraCodeBlock.Root
                    code={value.code}
                    language={props.language}
                    meta={meta}
                >
                    {showHeader && (
                        <ChakraCodeBlock.Header>
                            {props.title && <ChakraCodeBlock.Title>{props.title}</ChakraCodeBlock.Title>}
                            {props.showCopyButton && (
                                <ChakraCodeBlock.CopyTrigger asChild>
                                    <IconButton variant="ghost" size="2xs">
                                        <ChakraCodeBlock.CopyIndicator />
                                    </IconButton>
                                </ChakraCodeBlock.CopyTrigger>
                            )}
                        </ChakraCodeBlock.Header>
                    )}
                    <ChakraCodeBlock.Content>
                        <ChakraCodeBlock.Code>
                            <ChakraCodeBlock.CodeText />
                        </ChakraCodeBlock.Code>
                    </ChakraCodeBlock.Content>
                </ChakraCodeBlock.Root>
            </Box>
        </ChakraCodeBlock.AdapterProvider>
    );
}, (prev, next) => codeBlockEqual(prev.value, next.value));
