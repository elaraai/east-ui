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
            data: [1, 2, 3, 4, 5],
            chartType: "line",
            color: "currentColor",
            width: "100%",
            height: "100%",
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

    it("passes data array through directly", () => {
        const value: SparklineValue = {
            data: [100, 200, 150, 300],
            type: none,
            color: none,
            width: none,
            height: none,
        };

        const result = toChakraSparkline(value);

        expect(result.data).toEqual([100, 200, 150, 300]);
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

        expect(result.data).toEqual([]);
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
            data: [1, 2, 3, 4, 5],
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
