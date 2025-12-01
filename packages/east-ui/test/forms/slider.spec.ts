/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Slider, Style } from "../../src/index.js";

describeEast("Slider", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates slider with value only", $ => {
        const slider = $.let(Slider.Root(50.0));

        $(assertEast.equal(slider.unwrap("Slider").value, 50.0));
        $(assertEast.equal(slider.unwrap("Slider").min.hasTag("none"), true));
        $(assertEast.equal(slider.unwrap("Slider").max.hasTag("none"), true));
        $(assertEast.equal(slider.unwrap("Slider").step.hasTag("none"), true));
    });

    test("creates slider with different value", $ => {
        const slider = $.let(Slider.Root(75.5));

        $(assertEast.equal(slider.unwrap("Slider").value, 75.5));
    });

    // =========================================================================
    // Min/Max Range
    // =========================================================================

    test("creates slider with min", $ => {
        const slider = $.let(Slider.Root(25.0, {
            min: 0,
        }));

        $(assertEast.equal(slider.unwrap("Slider").min.hasTag("some"), true));
        $(assertEast.equal(slider.unwrap("Slider").min.unwrap("some"), 0.0));
    });

    test("creates slider with max", $ => {
        const slider = $.let(Slider.Root(75.0, {
            max: 100,
        }));

        $(assertEast.equal(slider.unwrap("Slider").max.hasTag("some"), true));
        $(assertEast.equal(slider.unwrap("Slider").max.unwrap("some"), 100.0));
    });

    test("creates slider with min and max", $ => {
        const slider = $.let(Slider.Root(50.0, {
            min: 0,
            max: 100,
        }));

        $(assertEast.equal(slider.unwrap("Slider").min.unwrap("some"), 0.0));
        $(assertEast.equal(slider.unwrap("Slider").max.unwrap("some"), 100.0));
    });

    test("creates slider with custom range", $ => {
        const slider = $.let(Slider.Root(500.0, {
            min: 100,
            max: 1000,
        }));

        $(assertEast.equal(slider.unwrap("Slider").value, 500.0));
        $(assertEast.equal(slider.unwrap("Slider").min.unwrap("some"), 100.0));
        $(assertEast.equal(slider.unwrap("Slider").max.unwrap("some"), 1000.0));
    });

    // =========================================================================
    // Step
    // =========================================================================

    test("creates slider with step", $ => {
        const slider = $.let(Slider.Root(50.0, {
            step: 5,
        }));

        $(assertEast.equal(slider.unwrap("Slider").step.hasTag("some"), true));
        $(assertEast.equal(slider.unwrap("Slider").step.unwrap("some"), 5.0));
    });

    test("creates slider with decimal step", $ => {
        const slider = $.let(Slider.Root(0.5, {
            min: 0,
            max: 1,
            step: 0.1,
        }));

        $(assertEast.equal(slider.unwrap("Slider").step.unwrap("some"), 0.1));
    });

    // =========================================================================
    // Orientation
    // =========================================================================

    test("creates horizontal slider", $ => {
        const slider = $.let(Slider.Root(50.0, {
            orientation: "horizontal",
        }));

        $(assertEast.equal(slider.unwrap("Slider").orientation.hasTag("some"), true));
        $(assertEast.equal(slider.unwrap("Slider").orientation.unwrap("some").hasTag("horizontal"), true));
    });

    test("creates vertical slider", $ => {
        const slider = $.let(Slider.Root(50.0, {
            orientation: "vertical",
        }));

        $(assertEast.equal(slider.unwrap("Slider").orientation.unwrap("some").hasTag("vertical"), true));
    });

    test("creates slider with Style.Orientation helper", $ => {
        const slider = $.let(Slider.Root(50.0, {
            orientation: Style.Orientation("vertical"),
        }));

        $(assertEast.equal(slider.unwrap("Slider").orientation.unwrap("some").hasTag("vertical"), true));
    });

    // =========================================================================
    // Color Palettes
    // =========================================================================

    test("creates slider with blue color palette", $ => {
        const slider = $.let(Slider.Root(50.0, {
            colorPalette: "blue",
        }));

        $(assertEast.equal(slider.unwrap("Slider").colorPalette.hasTag("some"), true));
        $(assertEast.equal(slider.unwrap("Slider").colorPalette.unwrap("some").hasTag("blue"), true));
    });

    test("creates slider with green color palette", $ => {
        const slider = $.let(Slider.Root(50.0, {
            colorPalette: "green",
        }));

        $(assertEast.equal(slider.unwrap("Slider").colorPalette.unwrap("some").hasTag("green"), true));
    });

    test("creates slider with Style.ColorScheme helper", $ => {
        const slider = $.let(Slider.Root(50.0, {
            colorPalette: Style.ColorScheme("purple"),
        }));

        $(assertEast.equal(slider.unwrap("Slider").colorPalette.unwrap("some").hasTag("purple"), true));
    });

    // =========================================================================
    // Size
    // =========================================================================

    test("creates small slider", $ => {
        const slider = $.let(Slider.Root(50.0, {
            size: "sm",
        }));

        $(assertEast.equal(slider.unwrap("Slider").size.hasTag("some"), true));
        $(assertEast.equal(slider.unwrap("Slider").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates medium slider", $ => {
        const slider = $.let(Slider.Root(50.0, {
            size: "md",
        }));

        $(assertEast.equal(slider.unwrap("Slider").size.unwrap("some").hasTag("md"), true));
    });

    test("creates large slider", $ => {
        const slider = $.let(Slider.Root(50.0, {
            size: "lg",
        }));

        $(assertEast.equal(slider.unwrap("Slider").size.unwrap("some").hasTag("lg"), true));
    });

    test("creates slider with Style.Size helper", $ => {
        const slider = $.let(Slider.Root(50.0, {
            size: Style.Size("md"),
        }));

        $(assertEast.equal(slider.unwrap("Slider").size.unwrap("some").hasTag("md"), true));
    });

    // =========================================================================
    // Variant
    // =========================================================================

    test("creates outline variant slider", $ => {
        const slider = $.let(Slider.Root(50.0, {
            variant: "outline",
        }));

        $(assertEast.equal(slider.unwrap("Slider").variant.hasTag("some"), true));
        $(assertEast.equal(slider.unwrap("Slider").variant.unwrap("some").hasTag("outline"), true));
    });

    test("creates subtle variant slider", $ => {
        const slider = $.let(Slider.Root(50.0, {
            variant: "subtle",
        }));

        $(assertEast.equal(slider.unwrap("Slider").variant.unwrap("some").hasTag("subtle"), true));
    });

    test("creates slider with SliderVariant helper", $ => {
        const slider = $.let(Slider.Root(50.0, {
            variant: "subtle",
        }));

        $(assertEast.equal(slider.unwrap("Slider").variant.unwrap("some").hasTag("subtle"), true));
    });

    // =========================================================================
    // Disabled State
    // =========================================================================

    test("creates disabled slider", $ => {
        const slider = $.let(Slider.Root(50.0, {
            disabled: true,
        }));

        $(assertEast.equal(slider.unwrap("Slider").disabled.hasTag("some"), true));
        $(assertEast.equal(slider.unwrap("Slider").disabled.unwrap("some"), true));
    });

    test("creates enabled slider explicitly", $ => {
        const slider = $.let(Slider.Root(50.0, {
            disabled: false,
        }));

        $(assertEast.equal(slider.unwrap("Slider").disabled.unwrap("some"), false));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates slider with all options", $ => {
        const slider = $.let(Slider.Root(50.0, {
            min: 0,
            max: 100,
            step: 5,
            orientation: "horizontal",
            colorPalette: "blue",
            size: "md",
            variant: "subtle",
            disabled: false,
        }));

        $(assertEast.equal(slider.unwrap("Slider").value, 50.0));
        $(assertEast.equal(slider.unwrap("Slider").min.unwrap("some"), 0.0));
        $(assertEast.equal(slider.unwrap("Slider").max.unwrap("some"), 100.0));
        $(assertEast.equal(slider.unwrap("Slider").step.unwrap("some"), 5.0));
        $(assertEast.equal(slider.unwrap("Slider").orientation.unwrap("some").hasTag("horizontal"), true));
        $(assertEast.equal(slider.unwrap("Slider").colorPalette.unwrap("some").hasTag("blue"), true));
        $(assertEast.equal(slider.unwrap("Slider").size.unwrap("some").hasTag("md"), true));
        $(assertEast.equal(slider.unwrap("Slider").variant.unwrap("some").hasTag("subtle"), true));
        $(assertEast.equal(slider.unwrap("Slider").disabled.unwrap("some"), false));
    });

    test("creates volume slider", $ => {
        const slider = $.let(Slider.Root(75.0, {
            min: 0,
            max: 100,
            colorPalette: "blue",
            size: "sm",
        }));

        $(assertEast.equal(slider.unwrap("Slider").value, 75.0));
        $(assertEast.equal(slider.unwrap("Slider").min.unwrap("some"), 0.0));
        $(assertEast.equal(slider.unwrap("Slider").max.unwrap("some"), 100.0));
    });

    test("creates percentage slider", $ => {
        const slider = $.let(Slider.Root(0.5, {
            min: 0,
            max: 1,
            step: 0.01,
        }));

        $(assertEast.equal(slider.unwrap("Slider").value, 0.5));
        $(assertEast.equal(slider.unwrap("Slider").step.unwrap("some"), 0.01));
    });

    test("creates vertical progress slider", $ => {
        const slider = $.let(Slider.Root(30.0, {
            orientation: "vertical",
            min: 0,
            max: 100,
            colorPalette: "green",
        }));

        $(assertEast.equal(slider.unwrap("Slider").orientation.unwrap("some").hasTag("vertical"), true));
        $(assertEast.equal(slider.unwrap("Slider").colorPalette.unwrap("some").hasTag("green"), true));
    });

    test("creates disabled readonly slider", $ => {
        const slider = $.let(Slider.Root(50.0, {
            disabled: true,
            colorPalette: "gray",
        }));

        $(assertEast.equal(slider.unwrap("Slider").disabled.unwrap("some"), true));
        $(assertEast.equal(slider.unwrap("Slider").colorPalette.unwrap("some").hasTag("gray"), true));
    });
});
