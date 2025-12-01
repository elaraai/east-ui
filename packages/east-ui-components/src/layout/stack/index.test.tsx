/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describe, it, expect } from "vitest";
import { variant, some, none } from "@elaraai/east";
import { toChakraStack, type StackValue } from "./index";

describe("toChakraStack", () => {
    it("returns empty props for stack with no style", () => {
        const value: StackValue = {
            children: [],
            style: none,
        };

        const result = toChakraStack(value);

        expect(result).toEqual({
            direction: undefined,
            gap: undefined,
            align: undefined,
            justify: undefined,
            wrap: undefined,
            pt: undefined,
            pr: undefined,
            pb: undefined,
            pl: undefined,
            mt: undefined,
            mr: undefined,
            mb: undefined,
            ml: undefined,
            background: undefined,
            width: undefined,
            height: undefined,
        });
    });

    it("extracts direction from style", () => {
        const value: StackValue = {
            children: [],
            style: some({
                direction: some(variant("row", null)),
                gap: none,
                align: none,
                justify: none,
                wrap: none,
                padding: none,
                margin: none,
                background: none,
                width: none,
                height: none,
            }),
        };

        const result = toChakraStack(value);

        expect(result.direction).toBe("row");
    });

    it("extracts gap from style", () => {
        const value: StackValue = {
            children: [],
            style: some({
                direction: none,
                gap: some("4"),
                align: none,
                justify: none,
                wrap: none,
                padding: none,
                margin: none,
                background: none,
                width: none,
                height: none,
            }),
        };

        const result = toChakraStack(value);

        expect(result.gap).toBe("4");
    });

    it("extracts alignment props from style", () => {
        const value: StackValue = {
            children: [],
            style: some({
                direction: none,
                gap: none,
                align: some(variant("center", null)),
                justify: some(variant("space-between", null)),
                wrap: some(variant("wrap", null)),
                padding: none,
                margin: none,
                background: none,
                width: none,
                height: none,
            }),
        };

        const result = toChakraStack(value);

        expect(result.align).toBe("center");
        expect(result.justify).toBe("space-between");
        expect(result.wrap).toBe("wrap");
    });

    it("extracts spacing from style", () => {
        const value: StackValue = {
            children: [],
            style: some({
                direction: none,
                gap: none,
                align: none,
                justify: none,
                wrap: none,
                padding: some({
                    top: some("6"),
                    right: some("6"),
                    bottom: some("6"),
                    left: some("6"),
                }),
                margin: some({
                    top: some("2"),
                    right: some("2"),
                    bottom: some("2"),
                    left: some("2"),
                }),
                background: none,
                width: none,
                height: none,
            }),
        };

        const result = toChakraStack(value);

        expect(result.pt).toBe("6");
        expect(result.mt).toBe("2");
    });

    it("extracts dimensions and background from style", () => {
        const value: StackValue = {
            children: [],
            style: some({
                direction: none,
                gap: none,
                align: none,
                justify: none,
                wrap: none,
                padding: none,
                margin: none,
                background: some("gray.50"),
                width: some("100%"),
                height: some("auto"),
            }),
        };

        const result = toChakraStack(value);

        expect(result.background).toBe("gray.50");
        expect(result.width).toBe("100%");
        expect(result.height).toBe("auto");
    });

    it("extracts all props when fully styled", () => {
        const value: StackValue = {
            children: [],
            style: some({
                direction: some(variant("column", null)),
                gap: some("8"),
                align: some(variant("stretch", null)),
                justify: some(variant("flex-start", null)),
                wrap: some(variant("nowrap", null)),
                padding: some({
                    top: some("4"),
                    right: some("4"),
                    bottom: some("4"),
                    left: some("4"),
                }),
                margin: some({
                    top: some("0"),
                    right: some("0"),
                    bottom: some("0"),
                    left: some("0"),
                }),
                background: some("white"),
                width: some("500px"),
                height: some("100vh"),
            }),
        };

        const result = toChakraStack(value);

        expect(result).toEqual({
            direction: "column",
            gap: "8",
            align: "stretch",
            justify: "flex-start",
            wrap: "nowrap",
            pt: "4",
            pr: "4",
            pb: "4",
            pl: "4",
            mt: "0",
            mr: "0",
            mb: "0",
            ml: "0",
            background: "white",
            width: "500px",
            height: "100vh",
        });
    });
});
