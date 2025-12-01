/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describe, it, expect } from "vitest";
import { variant, some, none } from "@elaraai/east";
import { toChakraSparkline, type SparklineValue } from "./index";

describe("toChakraSparkline", () => {
    it("returns defaults for sparkline with no options", () => {
        const value: SparklineValue = {
            data: [1, 2, 3, 4, 5],
            type: none,
            color: none,
            width: none,
            height: none,
        };

        const result = toChakraSparkline(value);

        expect(result).toEqual({
            chartData: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }],
            chartType: "line",
            color: "teal.solid",
            width: "100px",
            height: "32px",
        });
    });

    it("extracts chart type from value", () => {
        const value: SparklineValue = {
            data: [10, 20, 30],
            type: some(variant("area", null)),
            color: none,
            width: none,
            height: none,
        };

        const result = toChakraSparkline(value);

        expect(result.chartType).toBe("area");
    });

    it("extracts color from value", () => {
        const value: SparklineValue = {
            data: [1, 2, 3],
            type: none,
            color: some("blue.500"),
            width: none,
            height: none,
        };

        const result = toChakraSparkline(value);

        expect(result.color).toBe("blue.500");
    });

    it("extracts dimensions from value", () => {
        const value: SparklineValue = {
            data: [5, 10, 15],
            type: none,
            color: none,
            width: some("200px"),
            height: some("50px"),
        };

        const result = toChakraSparkline(value);

        expect(result.width).toBe("200px");
        expect(result.height).toBe("50px");
    });

    it("converts data to chartData format", () => {
        const value: SparklineValue = {
            data: [100, 200, 150, 300],
            type: none,
            color: none,
            width: none,
            height: none,
        };

        const result = toChakraSparkline(value);

        expect(result.chartData).toEqual([
            { value: 100 },
            { value: 200 },
            { value: 150 },
            { value: 300 },
        ]);
    });

    it("handles empty data array", () => {
        const value: SparklineValue = {
            data: [],
            type: none,
            color: none,
            width: none,
            height: none,
        };

        const result = toChakraSparkline(value);

        expect(result.chartData).toEqual([]);
    });

    it("extracts all props when fully configured", () => {
        const value: SparklineValue = {
            data: [1, 2, 3, 4, 5],
            type: some(variant("area", null)),
            color: some("red.400"),
            width: some("150px"),
            height: some("40px"),
        };

        const result = toChakraSparkline(value);

        expect(result).toEqual({
            chartData: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }],
            chartType: "area",
            color: "red.400",
            width: "150px",
            height: "40px",
        });
    });

    it("handles line type explicitly", () => {
        const value: SparklineValue = {
            data: [1, 2, 3],
            type: some(variant("line", null)),
            color: none,
            width: none,
            height: none,
        };

        const result = toChakraSparkline(value);

        expect(result.chartType).toBe("line");
    });
});
