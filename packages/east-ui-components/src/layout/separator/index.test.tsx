/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describe, it, expect } from "vitest";
import { variant, some, none } from "@elaraai/east";
import { toChakraSeparator, type SeparatorValue } from "./index";

describe("toChakraSeparator", () => {
    it("returns empty props for separator with no styling", () => {
        const value: SeparatorValue = {
            label: none,
            orientation: none,
            variant: none,
            size: none,
            color: none,
        };

        const result = toChakraSeparator(value);

        expect(result).toEqual({
            orientation: undefined,
            variant: undefined,
            size: undefined,
            borderColor: undefined,
        });
    });

    it("extracts orientation from value", () => {
        const value: SeparatorValue = {
            label: none,
            orientation: some(variant("vertical", null)),
            variant: none,
            size: none,
            color: none,
        };

        const result = toChakraSeparator(value);

        expect(result.orientation).toBe("vertical");
    });

    it("extracts variant from value", () => {
        const value: SeparatorValue = {
            label: none,
            orientation: none,
            variant: some(variant("dashed", null)),
            size: none,
            color: none,
        };

        const result = toChakraSeparator(value);

        expect(result.variant).toBe("dashed");
    });

    it("extracts size from value", () => {
        const value: SeparatorValue = {
            label: none,
            orientation: none,
            variant: none,
            size: some(variant("md", null)),
            color: none,
        };

        const result = toChakraSeparator(value);

        expect(result.size).toBe("md");
    });

    it("extracts color as borderColor from value", () => {
        const value: SeparatorValue = {
            label: none,
            orientation: none,
            variant: none,
            size: none,
            color: some("gray.300"),
        };

        const result = toChakraSeparator(value);

        expect(result.borderColor).toBe("gray.300");
    });

    it("extracts all props when fully styled", () => {
        const value: SeparatorValue = {
            label: some("OR"),
            orientation: some(variant("horizontal", null)),
            variant: some(variant("solid", null)),
            size: some(variant("lg", null)),
            color: some("blue.500"),
        };

        const result = toChakraSeparator(value);

        expect(result).toEqual({
            orientation: "horizontal",
            variant: "solid",
            size: "lg",
            borderColor: "blue.500",
        });
    });
});
