/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describe, it, expect } from "vitest";
import { variant, some, none } from "@elaraai/east";
import { toChakraGrid, type GridValue } from "./index";

describe("toChakraGrid", () => {
    it("returns empty props for grid with no style", () => {
        const value: GridValue = {
            items: [],
            style: none,
        };

        const result = toChakraGrid(value);

        expect(result).toEqual({
            templateColumns: undefined,
            templateRows: undefined,
            templateAreas: undefined,
            gap: undefined,
            columnGap: undefined,
            rowGap: undefined,
            justifyItems: undefined,
            alignItems: undefined,
            justifyContent: undefined,
            alignContent: undefined,
            autoColumns: undefined,
            autoRows: undefined,
            autoFlow: undefined,
        });
    });

    it("extracts template columns and rows from style", () => {
        const value: GridValue = {
            items: [],
            style: some({
                templateColumns: some("repeat(3, 1fr)"),
                templateRows: some("auto 1fr auto"),
                templateAreas: none,
                gap: none,
                columnGap: none,
                rowGap: none,
                justifyItems: none,
                alignItems: none,
                justifyContent: none,
                alignContent: none,
                autoColumns: none,
                autoRows: none,
                autoFlow: none,
            }),
        };

        const result = toChakraGrid(value);

        expect(result.templateColumns).toBe("repeat(3, 1fr)");
        expect(result.templateRows).toBe("auto 1fr auto");
    });

    it("extracts gap properties from style", () => {
        const value: GridValue = {
            items: [],
            style: some({
                templateColumns: none,
                templateRows: none,
                templateAreas: none,
                gap: some("4"),
                columnGap: some("6"),
                rowGap: some("2"),
                justifyItems: none,
                alignItems: none,
                justifyContent: none,
                alignContent: none,
                autoColumns: none,
                autoRows: none,
                autoFlow: none,
            }),
        };

        const result = toChakraGrid(value);

        expect(result.gap).toBe("4");
        expect(result.columnGap).toBe("6");
        expect(result.rowGap).toBe("2");
    });

    it("extracts alignment properties from style", () => {
        const value: GridValue = {
            items: [],
            style: some({
                templateColumns: none,
                templateRows: none,
                templateAreas: none,
                gap: none,
                columnGap: none,
                rowGap: none,
                justifyItems: some(variant("center", null)),
                alignItems: some(variant("stretch", null)),
                justifyContent: some(variant("space-between", null)),
                alignContent: some(variant("flex-start", null)),
                autoColumns: none,
                autoRows: none,
                autoFlow: none,
            }),
        };

        const result = toChakraGrid(value);

        expect(result.justifyItems).toBe("center");
        expect(result.alignItems).toBe("stretch");
        expect(result.justifyContent).toBe("space-between");
        expect(result.alignContent).toBe("flex-start");
    });

    it("extracts auto properties from style", () => {
        const value: GridValue = {
            items: [],
            style: some({
                templateColumns: none,
                templateRows: none,
                templateAreas: none,
                gap: none,
                columnGap: none,
                rowGap: none,
                justifyItems: none,
                alignItems: none,
                justifyContent: none,
                alignContent: none,
                autoColumns: some("minmax(100px, 1fr)"),
                autoRows: some("auto"),
                autoFlow: some(variant("row", null)),
            }),
        };

        const result = toChakraGrid(value);

        expect(result.autoColumns).toBe("minmax(100px, 1fr)");
        expect(result.autoRows).toBe("auto");
        expect(result.autoFlow).toBe("row");
    });

    it("extracts autoFlow with space value", () => {
        const value: GridValue = {
            items: [],
            style: some({
                templateColumns: none,
                templateRows: none,
                templateAreas: none,
                gap: none,
                columnGap: none,
                rowGap: none,
                justifyItems: none,
                alignItems: none,
                justifyContent: none,
                alignContent: none,
                autoColumns: none,
                autoRows: none,
                autoFlow: some(variant("row dense", null)),
            }),
        };

        const result = toChakraGrid(value);

        expect(result.autoFlow).toBe("row dense");
    });

    it("extracts templateAreas from style", () => {
        const value: GridValue = {
            items: [],
            style: some({
                templateColumns: none,
                templateRows: none,
                templateAreas: some("'header header' 'sidebar main' 'footer footer'"),
                gap: none,
                columnGap: none,
                rowGap: none,
                justifyItems: none,
                alignItems: none,
                justifyContent: none,
                alignContent: none,
                autoColumns: none,
                autoRows: none,
                autoFlow: none,
            }),
        };

        const result = toChakraGrid(value);

        expect(result.templateAreas).toBe("'header header' 'sidebar main' 'footer footer'");
    });

    it("extracts all props when fully styled", () => {
        const value: GridValue = {
            items: [],
            style: some({
                templateColumns: some("1fr 2fr 1fr"),
                templateRows: some("100px auto 50px"),
                templateAreas: some("'a b c'"),
                gap: some("4"),
                columnGap: some("6"),
                rowGap: some("2"),
                justifyItems: some(variant("center", null)),
                alignItems: some(variant("center", null)),
                justifyContent: some(variant("center", null)),
                alignContent: some(variant("center", null)),
                autoColumns: some("1fr"),
                autoRows: some("minmax(50px, auto)"),
                autoFlow: some(variant("column dense", null)),
            }),
        };

        const result = toChakraGrid(value);

        expect(result).toEqual({
            templateColumns: "1fr 2fr 1fr",
            templateRows: "100px auto 50px",
            templateAreas: "'a b c'",
            gap: "4",
            columnGap: "6",
            rowGap: "2",
            justifyItems: "center",
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            autoColumns: "1fr",
            autoRows: "minmax(50px, auto)",
            autoFlow: "column dense",
        });
    });
});
