/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describe, it, expect } from "vitest";
import { variant, some, none } from "@elaraai/east";
import { toChakraText, type TextValue } from "./index";

describe("toChakraText", () => {
    it("returns empty props for basic text with no styling", () => {
        const value: TextValue = {
            value: "Hello World",
            color: none,
            background: none,
            fontWeight: none,
            fontStyle: none,
            fontSize: none,
            textTransform: none,
            textAlign: none,
            borderWidth: none,
            borderStyle: none,
            borderColor: none,
        };

        const result = toChakraText(value);

        expect(result).toEqual({
            color: undefined,
            background: undefined,
            fontWeight: undefined,
            fontStyle: undefined,
            fontSize: undefined,
            textTransform: undefined,
            textAlign: undefined,
            borderWidth: undefined,
            borderStyle: undefined,
            borderColor: undefined,
        });
    });

    it("extracts color from value", () => {
        const value: TextValue = {
            value: "Colored text",
            color: some("blue.500"),
            background: none,
            fontWeight: none,
            fontStyle: none,
            fontSize: none,
            textTransform: none,
            textAlign: none,
            borderWidth: none,
            borderStyle: none,
            borderColor: none,
        };

        const result = toChakraText(value);

        expect(result.color).toBe("blue.500");
    });

    it("extracts background from value", () => {
        const value: TextValue = {
            value: "With background",
            color: none,
            background: some("gray.100"),
            fontWeight: none,
            fontStyle: none,
            fontSize: none,
            textTransform: none,
            textAlign: none,
            borderWidth: none,
            borderStyle: none,
            borderColor: none,
        };

        const result = toChakraText(value);

        expect(result.background).toBe("gray.100");
    });

    it("extracts fontWeight from value", () => {
        const value: TextValue = {
            value: "Bold text",
            color: none,
            background: none,
            fontWeight: some(variant("bold", null)),
            fontStyle: none,
            fontSize: none,
            textTransform: none,
            textAlign: none,
            borderWidth: none,
            borderStyle: none,
            borderColor: none,
        };

        const result = toChakraText(value);

        expect(result.fontWeight).toBe("bold");
    });

    it("extracts fontStyle from value", () => {
        const value: TextValue = {
            value: "Italic text",
            color: none,
            background: none,
            fontWeight: none,
            fontStyle: some(variant("italic", null)),
            fontSize: none,
            textTransform: none,
            textAlign: none,
            borderWidth: none,
            borderStyle: none,
            borderColor: none,
        };

        const result = toChakraText(value);

        expect(result.fontStyle).toBe("italic");
    });

    it("extracts textTransform from value", () => {
        const value: TextValue = {
            value: "uppercase text",
            color: none,
            background: none,
            fontWeight: none,
            fontStyle: none,
            fontSize: none,
            textTransform: some(variant("uppercase", null)),
            textAlign: none,
            borderWidth: none,
            borderStyle: none,
            borderColor: none,
        };

        const result = toChakraText(value);

        expect(result.textTransform).toBe("uppercase");
    });

    it("extracts textAlign from value", () => {
        const value: TextValue = {
            value: "Centered text",
            color: none,
            background: none,
            fontWeight: none,
            fontStyle: none,
            fontSize: none,
            textTransform: none,
            textAlign: some(variant("center", null)),
            borderWidth: none,
            borderStyle: none,
            borderColor: none,
        };

        const result = toChakraText(value);

        expect(result.textAlign).toBe("center");
    });

    it("extracts border properties from value", () => {
        const value: TextValue = {
            value: "Bordered text",
            color: none,
            background: none,
            fontWeight: none,
            fontStyle: none,
            fontSize: none,
            textTransform: none,
            textAlign: none,
            borderWidth: some(variant("thin", null)),
            borderStyle: some(variant("solid", null)),
            borderColor: some("gray.300"),
        };

        const result = toChakraText(value);

        expect(result.borderWidth).toBe("thin");
        expect(result.borderStyle).toBe("solid");
        expect(result.borderColor).toBe("gray.300");
    });

    it("extracts all props when fully styled", () => {
        const value: TextValue = {
            value: "Fully Styled",
            color: some("white"),
            background: some("purple.600"),
            fontWeight: some(variant("semibold", null)),
            fontStyle: some(variant("italic", null)),
            fontSize: some(variant("md", null)),
            textTransform: some(variant("uppercase", null)),
            textAlign: some(variant("center", null)),
            borderWidth: some(variant("medium", null)),
            borderStyle: some(variant("dashed", null)),
            borderColor: some("purple.800"),
        };

        const result = toChakraText(value);

        expect(result).toEqual({
            color: "white",
            background: "purple.600",
            fontWeight: "semibold",
            fontStyle: "italic",
            fontSize: "md",
            textTransform: "uppercase",
            textAlign: "center",
            borderWidth: "medium",
            borderStyle: "dashed",
            borderColor: "purple.800",
        });
    });
});
