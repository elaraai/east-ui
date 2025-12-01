/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describe, it, expect } from "vitest";
import { variant, some, none } from "@elaraai/east";
import { toChakraButton, type ButtonValue } from "./index";

describe("toChakraButton", () => {
    it("returns empty props for basic button with no style", () => {
        const value: ButtonValue = {
            label: "Click Me",
            style: none,
        };

        const result = toChakraButton(value);

        expect(result).toEqual({
            variant: undefined,
            colorPalette: undefined,
            size: undefined,
            loading: undefined,
            disabled: undefined,
        });
    });

    it("extracts variant from style", () => {
        const value: ButtonValue = {
            label: "Solid Button",
            style: some({
                variant: some(variant("solid", null)),
                colorPalette: none,
                size: none,
                loading: none,
                disabled: none,
            }),
        };

        const result = toChakraButton(value);

        expect(result.variant).toBe("solid");
    });

    it("extracts colorPalette from style", () => {
        const value: ButtonValue = {
            label: "Blue Button",
            style: some({
                variant: none,
                colorPalette: some(variant("blue", null)),
                size: none,
                loading: none,
                disabled: none,
            }),
        };

        const result = toChakraButton(value);

        expect(result.colorPalette).toBe("blue");
    });

    it("extracts size from style", () => {
        const value: ButtonValue = {
            label: "Large Button",
            style: some({
                variant: none,
                colorPalette: none,
                size: some(variant("lg", null)),
                loading: none,
                disabled: none,
            }),
        };

        const result = toChakraButton(value);

        expect(result.size).toBe("lg");
    });

    it("extracts loading state from style", () => {
        const value: ButtonValue = {
            label: "Loading...",
            style: some({
                variant: none,
                colorPalette: none,
                size: none,
                loading: some(true),
                disabled: none,
            }),
        };

        const result = toChakraButton(value);

        expect(result.loading).toBe(true);
    });

    it("extracts disabled state from style", () => {
        const value: ButtonValue = {
            label: "Disabled",
            style: some({
                variant: none,
                colorPalette: none,
                size: none,
                loading: none,
                disabled: some(true),
            }),
        };

        const result = toChakraButton(value);

        expect(result.disabled).toBe(true);
    });

    it("extracts all props when fully styled", () => {
        const value: ButtonValue = {
            label: "Fully Styled",
            style: some({
                variant: some(variant("outline", null)),
                colorPalette: some(variant("teal", null)),
                size: some(variant("md", null)),
                loading: some(false),
                disabled: some(false),
            }),
        };

        const result = toChakraButton(value);

        expect(result).toEqual({
            variant: "outline",
            colorPalette: "teal",
            size: "md",
            loading: false,
            disabled: false,
        });
    });
});
