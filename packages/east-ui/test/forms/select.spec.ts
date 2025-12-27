/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Select, Style } from "../../src/index.js";

describeEast("Select", (test) => {
    // =========================================================================
    // Select.Item
    // =========================================================================

    test("creates select item with value and label", $ => {
        const item = $.let(Select.Item("us", "United States"));

        $(assertEast.equal(item.value, "us"));
        $(assertEast.equal(item.label, "United States"));
        $(assertEast.equal(item.disabled.hasTag("none"), true));
    });

    test("creates select item with string expressions", $ => {
        const item = $.let(Select.Item(
            "uk",
            "United Kingdom"
        ));

        $(assertEast.equal(item.value, "uk"));
        $(assertEast.equal(item.label, "United Kingdom"));
    });

    test("creates disabled select item", $ => {
        const item = $.let(Select.Item("restricted", "Restricted Option", {
            disabled: true,
        }));

        $(assertEast.equal(item.value, "restricted"));
        $(assertEast.equal(item.disabled.hasTag("some"), true));
        $(assertEast.equal(item.disabled.unwrap("some"), true));
    });

    test("creates enabled select item explicitly", $ => {
        const item = $.let(Select.Item("enabled", "Enabled Option", {
            disabled: false,
        }));

        $(assertEast.equal(item.disabled.unwrap("some"), false));
    });

    // =========================================================================
    // Select.Root - Basic Creation
    // =========================================================================

    test("creates select with no initial value", $ => {
        const select = $.let(Select.Root("", [
            Select.Item("us", "United States"),
        ]));

        $(assertEast.equal(select.unwrap().unwrap("Select").value.hasTag("none"), true));
    });

    test("creates select with string initial value", $ => {
        const select = $.let(Select.Root("us", [
            Select.Item("us", "United States"),
            Select.Item("uk", "United Kingdom"),
        ]));

        $(assertEast.equal(select.unwrap().unwrap("Select").value.hasTag("some"), true));
        $(assertEast.equal(select.unwrap().unwrap("Select").value.unwrap("some"), "us"));
    });

    test("creates select with expression initial value", $ => {
        const select = $.let(Select.Root("ca", [
            Select.Item("us", "United States"),
            Select.Item("ca", "Canada"),
        ]));

        $(assertEast.equal(select.unwrap().unwrap("Select").value.unwrap("some"), "ca"));
    });

    test("creates select with multiple items", $ => {
        const select = $.let(Select.Root("", [
            Select.Item("us", "United States"),
            Select.Item("uk", "United Kingdom"),
            Select.Item("ca", "Canada"),
            Select.Item("au", "Australia"),
        ]));

        // Verify select was created with items (items array is embedded in East value)
        $(assertEast.equal(select.unwrap().unwrap("Select").value.hasTag("none"), true));
    });

    // =========================================================================
    // Placeholder
    // =========================================================================

    test("creates select with placeholder", $ => {
        const select = $.let(Select.Root("", [
            Select.Item("us", "United States"),
        ], {
            placeholder: "Select a country",
        }));

        $(assertEast.equal(select.unwrap().unwrap("Select").placeholder.hasTag("some"), true));
        $(assertEast.equal(select.unwrap().unwrap("Select").placeholder.unwrap("some"), "Select a country"));
    });

    test("creates select without placeholder", $ => {
        const select = $.let(Select.Root("", [
            Select.Item("us", "United States"),
        ]));

        $(assertEast.equal(select.unwrap().unwrap("Select").placeholder.hasTag("none"), true));
    });

    // =========================================================================
    // Multiple Selection
    // =========================================================================

    test("creates multiple selection select", $ => {
        const select = $.let(Select.Root("", [
            Select.Item("red", "Red"),
            Select.Item("green", "Green"),
            Select.Item("blue", "Blue"),
        ], {
            multiple: true,
        }));

        $(assertEast.equal(select.unwrap().unwrap("Select").multiple.hasTag("some"), true));
        $(assertEast.equal(select.unwrap().unwrap("Select").multiple.unwrap("some"), true));
    });

    test("creates single selection select explicitly", $ => {
        const select = $.let(Select.Root("", [
            Select.Item("a", "Option A"),
        ], {
            multiple: false,
        }));

        $(assertEast.equal(select.unwrap().unwrap("Select").multiple.unwrap("some"), false));
    });

    // =========================================================================
    // Disabled State
    // =========================================================================

    test("creates disabled select", $ => {
        const select = $.let(Select.Root("", [
            Select.Item("us", "United States"),
        ], {
            disabled: true,
        }));

        $(assertEast.equal(select.unwrap().unwrap("Select").disabled.hasTag("some"), true));
        $(assertEast.equal(select.unwrap().unwrap("Select").disabled.unwrap("some"), true));
    });

    test("creates enabled select explicitly", $ => {
        const select = $.let(Select.Root("", [
            Select.Item("us", "United States"),
        ], {
            disabled: false,
        }));

        $(assertEast.equal(select.unwrap().unwrap("Select").disabled.unwrap("some"), false));
    });

    // =========================================================================
    // Size
    // =========================================================================

    test("creates small select", $ => {
        const select = $.let(Select.Root("", [
            Select.Item("us", "United States"),
        ], {
            size: "sm",
        }));

        $(assertEast.equal(select.unwrap().unwrap("Select").size.hasTag("some"), true));
        $(assertEast.equal(select.unwrap().unwrap("Select").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates medium select", $ => {
        const select = $.let(Select.Root("", [
            Select.Item("us", "United States"),
        ], {
            size: "md",
        }));

        $(assertEast.equal(select.unwrap().unwrap("Select").size.unwrap("some").hasTag("md"), true));
    });

    test("creates large select", $ => {
        const select = $.let(Select.Root("", [
            Select.Item("us", "United States"),
        ], {
            size: "lg",
        }));

        $(assertEast.equal(select.unwrap().unwrap("Select").size.unwrap("some").hasTag("lg"), true));
    });

    test("creates select with Style.Size helper", $ => {
        const select = $.let(Select.Root("", [
            Select.Item("us", "United States"),
        ], {
            size: Style.Size("md"),
        }));

        $(assertEast.equal(select.unwrap().unwrap("Select").size.unwrap("some").hasTag("md"), true));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates select with all options", $ => {
        const select = $.let(Select.Root("us", [
            Select.Item("us", "United States"),
            Select.Item("uk", "United Kingdom"),
            Select.Item("ca", "Canada"),
        ], {
            placeholder: "Select a country",
            multiple: false,
            disabled: false,
            size: "md",
        }));

        $(assertEast.equal(select.unwrap().unwrap("Select").value.unwrap("some"), "us"));
        $(assertEast.equal(select.unwrap().unwrap("Select").placeholder.unwrap("some"), "Select a country"));
        $(assertEast.equal(select.unwrap().unwrap("Select").multiple.unwrap("some"), false));
        $(assertEast.equal(select.unwrap().unwrap("Select").disabled.unwrap("some"), false));
        $(assertEast.equal(select.unwrap().unwrap("Select").size.unwrap("some").hasTag("md"), true));
    });

    test("creates country selector", $ => {
        const select = $.let(Select.Root("", [
            Select.Item("us", "United States"),
            Select.Item("uk", "United Kingdom"),
            Select.Item("ca", "Canada"),
            Select.Item("au", "Australia"),
            Select.Item("de", "Germany"),
        ], {
            placeholder: "Select your country",
            size: "md",
        }));

        $(assertEast.equal(select.unwrap().unwrap("Select").placeholder.unwrap("some"), "Select your country"));
        $(assertEast.equal(select.unwrap().unwrap("Select").size.unwrap("some").hasTag("md"), true));
    });

    test("creates color picker select", $ => {
        const select = $.let(Select.Root("", [
            Select.Item("red", "Red"),
            Select.Item("green", "Green"),
            Select.Item("blue", "Blue"),
            Select.Item("yellow", "Yellow"),
        ], {
            multiple: true,
            placeholder: "Select colors",
        }));

        $(assertEast.equal(select.unwrap().unwrap("Select").multiple.unwrap("some"), true));
        $(assertEast.equal(select.unwrap().unwrap("Select").placeholder.unwrap("some"), "Select colors"));
    });

    test("creates select with disabled item", $ => {
        // Test the disabled item directly before adding to select
        const disabledItem = $.let(Select.Item("enterprise", "Enterprise Plan", { disabled: true }));
        $(assertEast.equal(disabledItem.disabled.unwrap("some"), true));

        // Then create the select with the items
        const select = $.let(Select.Root("", [
            Select.Item("free", "Free Plan"),
            Select.Item("pro", "Pro Plan"),
            Select.Item("enterprise", "Enterprise Plan", { disabled: true }),
        ], {
            placeholder: "Select a plan",
        }));

        $(assertEast.equal(select.unwrap().unwrap("Select").placeholder.unwrap("some"), "Select a plan"));
    });

    test("creates disabled readonly select", $ => {
        const select = $.let(Select.Root("current", [
            Select.Item("current", "Current Selection"),
        ], {
            disabled: true,
            size: "sm",
        }));

        $(assertEast.equal(select.unwrap().unwrap("Select").value.unwrap("some"), "current"));
        $(assertEast.equal(select.unwrap().unwrap("Select").disabled.unwrap("some"), true));
    });
});
