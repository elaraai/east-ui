/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type SubtypeExprOrValue,
    FloatType,
    OptionType,
    StringType,
    StructType,
    BooleanType,
    ArrayType,
    IntegerType,
    VariantType,
    NullType,
} from "@elaraai/east";

import { OverflowType } from "../../style.js";
import type { OverflowLiteral } from "../../style.js";
import { PaddingType, MarginType } from "../../layout/style.js";

// ============================================================================
// Language Type
// ============================================================================

/**
 * Programming language variant type for syntax highlighting.
 *
 * @remarks
 * These languages are pre-registered with the syntax highlighter.
 * Create instances using `variant("typescript", null)` or the string shorthand.
 *
 * @property typescript - TypeScript language
 * @property javascript - JavaScript language
 * @property json - JSON format
 * @property html - HTML markup
 * @property css - CSS styles
 * @property python - Python language
 * @property rust - Rust language
 * @property go - Go language
 * @property sql - SQL queries
 * @property bash - Bash/shell scripts
 * @property markdown - Markdown text
 * @property yaml - YAML configuration
 * @property xml - XML markup
 * @property plaintext - Plain text (no highlighting)
 */
export const CodeLanguageType = VariantType({
    typescript: NullType,
    javascript: NullType,
    json: NullType,
    html: NullType,
    css: NullType,
    python: NullType,
    rust: NullType,
    go: NullType,
    sql: NullType,
    bash: NullType,
    markdown: NullType,
    yaml: NullType,
    xml: NullType,
    plaintext: NullType,
});

export type CodeLanguageType = typeof CodeLanguageType;

/** String literal union for language shortcuts */
export type CodeLanguage =
    | "typescript"
    | "javascript"
    | "json"
    | "html"
    | "css"
    | "python"
    | "rust"
    | "go"
    | "sql"
    | "bash"
    | "markdown"
    | "yaml"
    | "xml"
    | "plaintext";

// ============================================================================
// CodeBlock Type
// ============================================================================

/**
 * The concrete East type for CodeBlock component data.
 *
 * @property code - The code content to display
 * @property language - Programming language for syntax highlighting
 * @property showLineNumbers - Whether to show line numbers
 * @property highlightLines - Line numbers to highlight
 * @property maxHeight - Maximum height with scroll
 * @property showCopyButton - Whether to show copy-to-clipboard button
 * @property wordWrap - Whether to enable word wrapping
 * @property title - Optional title displayed in the header (e.g., filename)
 */
export const CodeBlockType = StructType({
    code: StringType,
    language: OptionType(CodeLanguageType),
    showLineNumbers: OptionType(BooleanType),
    highlightLines: OptionType(ArrayType(IntegerType)),
    maxHeight: OptionType(StringType),
    showCopyButton: OptionType(BooleanType),
    wordWrap: OptionType(BooleanType),
    title: OptionType(StringType),
    overflow: OptionType(OverflowType),
    overflowX: OptionType(OverflowType),
    overflowY: OptionType(OverflowType),
    width: OptionType(StringType),
    height: OptionType(StringType),
    minWidth: OptionType(StringType),
    minHeight: OptionType(StringType),
    maxWidth: OptionType(StringType),
    padding: OptionType(PaddingType),
    margin: OptionType(MarginType),
    opacity: OptionType(FloatType),
});

export type CodeBlockType = typeof CodeBlockType;

// ============================================================================
// CodeBlock Style
// ============================================================================

/**
 * Style configuration for CodeBlock components.
 */
export type CodeBlockStyle = {
    /** Programming language for syntax highlighting */
    language?: SubtypeExprOrValue<CodeLanguageType> | CodeLanguage;
    /** Whether to show line numbers */
    showLineNumbers?: SubtypeExprOrValue<BooleanType> | boolean;
    /** Line numbers to highlight */
    highlightLines?: SubtypeExprOrValue<ArrayType<IntegerType>>;
    /** Maximum height with scroll (e.g., "400px") */
    maxHeight?: SubtypeExprOrValue<StringType>;
    /** Whether to show copy-to-clipboard button */
    showCopyButton?: SubtypeExprOrValue<BooleanType> | boolean;
    /** Whether to enable word wrapping */
    wordWrap?: SubtypeExprOrValue<BooleanType> | boolean;
    /** Optional title displayed in the header (e.g., filename) */
    title?: SubtypeExprOrValue<StringType>;
    /** Overflow behavior */
    overflow?: SubtypeExprOrValue<OverflowType> | OverflowLiteral;
    /** Horizontal overflow */
    overflowX?: SubtypeExprOrValue<OverflowType> | OverflowLiteral;
    /** Vertical overflow */
    overflowY?: SubtypeExprOrValue<OverflowType> | OverflowLiteral;
    /** Width */
    width?: SubtypeExprOrValue<StringType>;
    /** Height */
    height?: SubtypeExprOrValue<StringType>;
    /** Min width */
    minWidth?: SubtypeExprOrValue<StringType>;
    /** Min height */
    minHeight?: SubtypeExprOrValue<StringType>;
    /** Max width */
    maxWidth?: SubtypeExprOrValue<StringType>;
    /** Padding configuration */
    padding?: SubtypeExprOrValue<PaddingType> | string;
    /** Margin configuration */
    margin?: SubtypeExprOrValue<MarginType> | string;
    /** CSS opacity (0-1) */
    opacity?: SubtypeExprOrValue<FloatType>;
};
