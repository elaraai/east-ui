/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describe, it, expect } from "vitest";
import { variant, some, none } from "@elaraai/east";
import { toChakraBox, type BoxValue } from "./index";

describe("toChakraBox", () => {
    it("returns empty props for box with no style", () => {
        const value: BoxValue = {
            children: [],
            style: none,
        };

        const result = toChakraBox(value);

        expect(result).toEqual({
            display: undefined,
            width: undefined,
            height: undefined,
            padding: undefined,
            margin: undefined,
            background: undefined,
            color: undefined,
            borderRadius: undefined,
            flexDirection: undefined,
            justifyContent: undefined,
            alignItems: undefined,
            gap: undefined,
        });
    });

    it("extracts display from style", () => {
        const value: BoxValue = {
            children: [],
            style: some({
                display: some(variant("flex", null)),
                width: none,
                height: none,
                padding: none,
                margin: none,
                background: none,
                color: none,
                borderRadius: none,
                flexDirection: none,
                justifyContent: none,
                alignItems: none,
                gap: none,
            }),
        };

        const result = toChakraBox(value);

        expect(result.display).toBe("flex");
    });

    it("extracts dimensions from style", () => {
        const value: BoxValue = {
            children: [],
            style: some({
                display: none,
                width: some("100%"),
                height: some("200px"),
                padding: none,
                margin: none,
                background: none,
                color: none,
                borderRadius: none,
                flexDirection: none,
                justifyContent: none,
                alignItems: none,
                gap: none,
            }),
        };

        const result = toChakraBox(value);

        expect(result.width).toBe("100%");
        expect(result.height).toBe("200px");
    });

    it("extracts spacing from style", () => {
        const value: BoxValue = {
            children: [],
            style: some({
                display: none,
                width: none,
                height: none,
                padding: some("4"),
                margin: some("2"),
                background: none,
                color: none,
                borderRadius: none,
                flexDirection: none,
                justifyContent: none,
                alignItems: none,
                gap: some("3"),
            }),
        };

        const result = toChakraBox(value);

        expect(result.padding).toBe("4");
        expect(result.margin).toBe("2");
        expect(result.gap).toBe("3");
    });

    it("extracts colors from style", () => {
        const value: BoxValue = {
            children: [],
            style: some({
                display: none,
                width: none,
                height: none,
                padding: none,
                margin: none,
                background: some("gray.100"),
                color: some("gray.800"),
                borderRadius: none,
                flexDirection: none,
                justifyContent: none,
                alignItems: none,
                gap: none,
            }),
        };

        const result = toChakraBox(value);

        expect(result.background).toBe("gray.100");
        expect(result.color).toBe("gray.800");
    });

    it("extracts flex properties from style", () => {
        const value: BoxValue = {
            children: [],
            style: some({
                display: some(variant("flex", null)),
                width: none,
                height: none,
                padding: none,
                margin: none,
                background: none,
                color: none,
                borderRadius: none,
                flexDirection: some(variant("column", null)),
                justifyContent: some(variant("center", null)),
                alignItems: some(variant("stretch", null)),
                gap: none,
            }),
        };

        const result = toChakraBox(value);

        expect(result.flexDirection).toBe("column");
        expect(result.justifyContent).toBe("center");
        expect(result.alignItems).toBe("stretch");
    });

    it("extracts borderRadius from style", () => {
        const value: BoxValue = {
            children: [],
            style: some({
                display: none,
                width: none,
                height: none,
                padding: none,
                margin: none,
                background: none,
                color: none,
                borderRadius: some("md"),
                flexDirection: none,
                justifyContent: none,
                alignItems: none,
                gap: none,
            }),
        };

        const result = toChakraBox(value);

        expect(result.borderRadius).toBe("md");
    });

    it("extracts all props when fully styled", () => {
        const value: BoxValue = {
            children: [],
            style: some({
                display: some(variant("flex", null)),
                width: some("400px"),
                height: some("300px"),
                padding: some("6"),
                margin: some("4"),
                background: some("blue.50"),
                color: some("blue.900"),
                borderRadius: some("lg"),
                flexDirection: some(variant("row", null)),
                justifyContent: some(variant("space-between", null)),
                alignItems: some(variant("center", null)),
                gap: some("4"),
            }),
        };

        const result = toChakraBox(value);

        expect(result).toEqual({
            display: "flex",
            width: "400px",
            height: "300px",
            padding: "6",
            margin: "4",
            background: "blue.50",
            color: "blue.900",
            borderRadius: "lg",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "4",
        });
    });
});
