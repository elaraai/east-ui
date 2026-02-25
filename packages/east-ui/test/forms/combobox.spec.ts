/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, Assert, TestImpl } from "@elaraai/east-node-std";
import { Combobox, Style } from "../../src/index.js";

describeEast("Combobox", (test) => {
    // =========================================================================
    // Combobox.Item
    // =========================================================================

    test("creates combobox item with value and label", $ => {
        const item = $.let(Combobox.Item("us", "United States"));

        $(Assert.equal(item.value, "us"));
        $(Assert.equal(item.label, "United States"));
        $(Assert.equal(item.disabled.hasTag("none"), true));
    });

    test("creates combobox item with string expressions", $ => {
        const item = $.let(Combobox.Item(
            "uk",
            "United Kingdom"
        ));

        $(Assert.equal(item.value, "uk"));
        $(Assert.equal(item.label, "United Kingdom"));
    });

    test("creates disabled combobox item", $ => {
        const item = $.let(Combobox.Item("restricted", "Restricted Option", {
            disabled: true,
        }));

        $(Assert.equal(item.value, "restricted"));
        $(Assert.equal(item.disabled.hasTag("some"), true));
        $(Assert.equal(item.disabled.unwrap("some"), true));
    });

    test("creates enabled combobox item explicitly", $ => {
        const item = $.let(Combobox.Item("enabled", "Enabled Option", {
            disabled: false,
        }));

        $(Assert.equal(item.disabled.unwrap("some"), false));
    });

    // =========================================================================
    // Combobox.Root - Basic Creation
    // =========================================================================

    test("creates combobox with no initial value", $ => {
        const combobox = $.let(Combobox.Root("", [
            Combobox.Item("us", "United States"),
        ]));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").value.hasTag("none"), true));
    });

    test("creates combobox with string initial value", $ => {
        const combobox = $.let(Combobox.Root("us", [
            Combobox.Item("us", "United States"),
            Combobox.Item("uk", "United Kingdom"),
        ]));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").value.hasTag("some"), true));
        $(Assert.equal(combobox.unwrap().unwrap("Combobox").value.unwrap("some"), "us"));
    });

    test("creates combobox with multiple items", $ => {
        const combobox = $.let(Combobox.Root("", [
            Combobox.Item("us", "United States"),
            Combobox.Item("uk", "United Kingdom"),
            Combobox.Item("ca", "Canada"),
            Combobox.Item("au", "Australia"),
        ]));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").value.hasTag("none"), true));
    });

    // =========================================================================
    // Placeholder
    // =========================================================================

    test("creates combobox with placeholder", $ => {
        const combobox = $.let(Combobox.Root("", [
            Combobox.Item("us", "United States"),
        ], {
            placeholder: "Search countries...",
        }));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").placeholder.hasTag("some"), true));
        $(Assert.equal(combobox.unwrap().unwrap("Combobox").placeholder.unwrap("some"), "Search countries..."));
    });

    test("creates combobox without placeholder", $ => {
        const combobox = $.let(Combobox.Root("", [
            Combobox.Item("us", "United States"),
        ]));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").placeholder.hasTag("none"), true));
    });

    // =========================================================================
    // Multiple Selection
    // =========================================================================

    test("creates multiple selection combobox", $ => {
        const combobox = $.let(Combobox.Root("", [
            Combobox.Item("red", "Red"),
            Combobox.Item("green", "Green"),
            Combobox.Item("blue", "Blue"),
        ], {
            multiple: true,
        }));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").multiple.hasTag("some"), true));
        $(Assert.equal(combobox.unwrap().unwrap("Combobox").multiple.unwrap("some"), true));
    });

    test("creates single selection combobox explicitly", $ => {
        const combobox = $.let(Combobox.Root("", [
            Combobox.Item("a", "Option A"),
        ], {
            multiple: false,
        }));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").multiple.unwrap("some"), false));
    });

    // =========================================================================
    // Disabled State
    // =========================================================================

    test("creates disabled combobox", $ => {
        const combobox = $.let(Combobox.Root("", [
            Combobox.Item("us", "United States"),
        ], {
            disabled: true,
        }));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").disabled.hasTag("some"), true));
        $(Assert.equal(combobox.unwrap().unwrap("Combobox").disabled.unwrap("some"), true));
    });

    test("creates enabled combobox explicitly", $ => {
        const combobox = $.let(Combobox.Root("", [
            Combobox.Item("us", "United States"),
        ], {
            disabled: false,
        }));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").disabled.unwrap("some"), false));
    });

    // =========================================================================
    // Size
    // =========================================================================

    test("creates small combobox", $ => {
        const combobox = $.let(Combobox.Root("", [
            Combobox.Item("us", "United States"),
        ], {
            size: "sm",
        }));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").size.hasTag("some"), true));
        $(Assert.equal(combobox.unwrap().unwrap("Combobox").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates medium combobox", $ => {
        const combobox = $.let(Combobox.Root("", [
            Combobox.Item("us", "United States"),
        ], {
            size: "md",
        }));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").size.unwrap("some").hasTag("md"), true));
    });

    test("creates large combobox", $ => {
        const combobox = $.let(Combobox.Root("", [
            Combobox.Item("us", "United States"),
        ], {
            size: "lg",
        }));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").size.unwrap("some").hasTag("lg"), true));
    });

    test("creates combobox with Style.Size helper", $ => {
        const combobox = $.let(Combobox.Root("", [
            Combobox.Item("us", "United States"),
        ], {
            size: Style.Size("md"),
        }));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").size.unwrap("some").hasTag("md"), true));
    });

    // =========================================================================
    // Allow Custom Value
    // =========================================================================

    test("creates combobox with allowCustomValue", $ => {
        const combobox = $.let(Combobox.Root("", [
            Combobox.Item("us", "United States"),
        ], {
            allowCustomValue: true,
        }));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").allowCustomValue.hasTag("some"), true));
        $(Assert.equal(combobox.unwrap().unwrap("Combobox").allowCustomValue.unwrap("some"), true));
    });

    test("creates combobox without allowCustomValue", $ => {
        const combobox = $.let(Combobox.Root("", [
            Combobox.Item("us", "United States"),
        ]));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").allowCustomValue.hasTag("none"), true));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates combobox with all options", $ => {
        const combobox = $.let(Combobox.Root("us", [
            Combobox.Item("us", "United States"),
            Combobox.Item("uk", "United Kingdom"),
            Combobox.Item("ca", "Canada"),
        ], {
            placeholder: "Search countries...",
            multiple: false,
            disabled: false,
            size: "md",
            allowCustomValue: false,
        }));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").value.unwrap("some"), "us"));
        $(Assert.equal(combobox.unwrap().unwrap("Combobox").placeholder.unwrap("some"), "Search countries..."));
        $(Assert.equal(combobox.unwrap().unwrap("Combobox").multiple.unwrap("some"), false));
        $(Assert.equal(combobox.unwrap().unwrap("Combobox").disabled.unwrap("some"), false));
        $(Assert.equal(combobox.unwrap().unwrap("Combobox").size.unwrap("some").hasTag("md"), true));
        $(Assert.equal(combobox.unwrap().unwrap("Combobox").allowCustomValue.unwrap("some"), false));
    });

    test("creates country search combobox", $ => {
        const combobox = $.let(Combobox.Root("", [
            Combobox.Item("us", "United States"),
            Combobox.Item("uk", "United Kingdom"),
            Combobox.Item("ca", "Canada"),
            Combobox.Item("au", "Australia"),
            Combobox.Item("de", "Germany"),
        ], {
            placeholder: "Search your country",
            size: "md",
        }));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").placeholder.unwrap("some"), "Search your country"));
        $(Assert.equal(combobox.unwrap().unwrap("Combobox").size.unwrap("some").hasTag("md"), true));
    });

    test("creates combobox with disabled item", $ => {
        const disabledItem = $.let(Combobox.Item("enterprise", "Enterprise Plan", { disabled: true }));
        $(Assert.equal(disabledItem.disabled.unwrap("some"), true));

        const combobox = $.let(Combobox.Root("", [
            Combobox.Item("free", "Free Plan"),
            Combobox.Item("pro", "Pro Plan"),
            Combobox.Item("enterprise", "Enterprise Plan", { disabled: true }),
        ], {
            placeholder: "Search plans",
        }));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").placeholder.unwrap("some"), "Search plans"));
    });

    test("creates disabled readonly combobox", $ => {
        const combobox = $.let(Combobox.Root("current", [
            Combobox.Item("current", "Current Selection"),
        ], {
            disabled: true,
            size: "sm",
        }));

        $(Assert.equal(combobox.unwrap().unwrap("Combobox").value.unwrap("some"), "current"));
        $(Assert.equal(combobox.unwrap().unwrap("Combobox").disabled.unwrap("some"), true));
    });
}, {   platformFns: TestImpl,});
