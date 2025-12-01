/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describe, it, expect } from "vitest";
import { variant, some, none } from "@elaraai/east";
import { toChakraSplitter, type SplitterValue } from "./index";

describe("toChakraSplitter", () => {
    it("returns props with defaultSize for splitter with no style", () => {
        const value: SplitterValue = {
            panels: [],
            defaultSize: [50, 50],
            style: none,
        };

        const result = toChakraSplitter(value);

        expect(result).toEqual({
            orientation: undefined,
            defaultSize: [50, 50],
        });
    });

    it("extracts horizontal orientation from style", () => {
        const value: SplitterValue = {
            panels: [],
            defaultSize: [30, 70],
            style: some({
                orientation: some(variant("horizontal", null)),
            }),
        };

        const result = toChakraSplitter(value);

        expect(result.orientation).toBe("horizontal");
    });

    it("extracts vertical orientation from style", () => {
        const value: SplitterValue = {
            panels: [],
            defaultSize: [40, 60],
            style: some({
                orientation: some(variant("vertical", null)),
            }),
        };

        const result = toChakraSplitter(value);

        expect(result.orientation).toBe("vertical");
    });

    it("returns defaultSize directly from value", () => {
        const defaultSize = [
            25,
            50,
            25,
        ];

        const value: SplitterValue = {
            panels: [],
            defaultSize,
            style: none,
        };

        const result = toChakraSplitter(value);

        expect(result.defaultSize).toBe(defaultSize);
    });

    it("extracts all props when fully styled", () => {
        const defaultSize = [70, 30];

        const value: SplitterValue = {
            panels: [],
            defaultSize,
            style: some({
                orientation: some(variant("horizontal", null)),
            }),
        };

        const result = toChakraSplitter(value);

        expect(result).toEqual({
            orientation: "horizontal",
            defaultSize,
        });
    });
});
