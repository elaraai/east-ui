/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type SubtypeExprOrValue,
    type ExprType,
    East,
    StringType,
    variant,
    some,
} from "@elaraai/east";

import { OverflowType } from "../../style.js";
import { UIComponentType } from "../../component.js";
import { PaddingType, MarginType } from "../../layout/style.js";
import { CodeBlockType, CodeLanguageType, type CodeBlockStyle, type CodeLanguage } from "./types.js";

// Re-export types
export { CodeBlockType, CodeLanguageType, type CodeBlockStyle, type CodeLanguage } from "./types.js";

// ============================================================================
// CodeBlock Component
// ============================================================================

/**
 * Creates a CodeBlock component for displaying code with syntax highlighting.
 *
 * @param code - The code content to display
 * @param style - Optional styling configuration
 * @returns An East expression representing the code block component
 */
function createCodeBlock(
    code: SubtypeExprOrValue<StringType>,
    style?: CodeBlockStyle
): ExprType<UIComponentType> {
    const showLineNumbersValue = style?.showLineNumbers !== undefined
        ? (typeof style.showLineNumbers === "boolean"
            ? style.showLineNumbers
            : style.showLineNumbers)
        : undefined;

    const showCopyButtonValue = style?.showCopyButton !== undefined
        ? (typeof style.showCopyButton === "boolean"
            ? style.showCopyButton
            : style.showCopyButton)
        : undefined;

    // Convert string language to variant
    const languageValue = style?.language !== undefined
        ? (typeof style.language === "string"
            ? East.value(variant(style.language as CodeLanguage, null), CodeLanguageType)
            : style.language)
        : undefined;

    const overflowValue = style?.overflow
        ? (typeof style.overflow === "string"
            ? East.value(variant(style.overflow, null), OverflowType)
            : style.overflow)
        : undefined;

    const overflowXValue = style?.overflowX
        ? (typeof style.overflowX === "string"
            ? East.value(variant(style.overflowX, null), OverflowType)
            : style.overflowX)
        : undefined;

    const overflowYValue = style?.overflowY
        ? (typeof style.overflowY === "string"
            ? East.value(variant(style.overflowY, null), OverflowType)
            : style.overflowY)
        : undefined;

    const paddingValue = style?.padding
        ? (typeof style.padding === "string"
            ? East.value({
                top: some(style.padding),
                right: some(style.padding),
                bottom: some(style.padding),
                left: some(style.padding)
            }, PaddingType)
            : style.padding)
        : undefined;

    const marginValue = style?.margin
        ? (typeof style.margin === "string"
            ? East.value({
                top: some(style.margin),
                right: some(style.margin),
                bottom: some(style.margin),
                left: some(style.margin)
            }, MarginType)
            : style.margin)
        : undefined;

    return East.value(variant("CodeBlock", {
        code: code,
        language: languageValue !== undefined ? variant("some", languageValue) : variant("none", null),
        showLineNumbers: showLineNumbersValue !== undefined ? variant("some", showLineNumbersValue) : variant("none", null),
        highlightLines: style?.highlightLines ? variant("some", style.highlightLines) : variant("none", null),
        maxHeight: style?.maxHeight ? variant("some", style.maxHeight) : variant("none", null),
        showCopyButton: showCopyButtonValue !== undefined ? variant("some", showCopyButtonValue) : variant("none", null),
        wordWrap: style?.wordWrap !== undefined ? variant("some", style.wordWrap) : variant("none", null),
        title: style?.title ? variant("some", style.title) : variant("none", null),
        overflow: overflowValue ? variant("some", overflowValue) : variant("none", null),
        overflowX: overflowXValue ? variant("some", overflowXValue) : variant("none", null),
        overflowY: overflowYValue ? variant("some", overflowYValue) : variant("none", null),
        width: style?.width ? variant("some", style.width) : variant("none", null),
        height: style?.height ? variant("some", style.height) : variant("none", null),
        minWidth: style?.minWidth ? variant("some", style.minWidth) : variant("none", null),
        minHeight: style?.minHeight ? variant("some", style.minHeight) : variant("none", null),
        maxWidth: style?.maxWidth ? variant("some", style.maxWidth) : variant("none", null),
        padding: paddingValue ? variant("some", paddingValue) : variant("none", null),
        margin: marginValue ? variant("some", marginValue) : variant("none", null),
        opacity: style?.opacity !== undefined ? variant("some", style.opacity) : variant("none", null),
    }), UIComponentType);
}

/**
 * CodeBlock component for displaying code blocks with syntax highlighting.
 *
 * @remarks
 * Use `CodeBlock.Root(code, style)` to create code blocks with optional
 * syntax highlighting, line numbers, and line highlighting.
 *
 * @example
 * ```ts
 * import { East } from "@elaraai/east";
 * import { CodeBlock, UIComponentType } from "@elaraai/east-ui";
 *
 * const example = East.function([], UIComponentType, $ => {
 *     return CodeBlock.Root(
 *         `function hello() {\n  console.log("Hello!");\n}`,
 *         {
 *             language: "typescript",
 *             showLineNumbers: true,
 *             highlightLines: [2n],
 *         }
 *     );
 * });
 * ```
 */
export const CodeBlock = {
    Root: createCodeBlock,
    Types: {
        CodeBlock: CodeBlockType,
        Language: CodeLanguageType,
    },
} as const;
