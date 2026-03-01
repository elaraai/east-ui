/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, Assert, TestImpl } from "@elaraai/east-node-std";
import { East, OptionType, StringType, variant } from "@elaraai/east";
import { DataList, Text, UIComponentType } from "../../src/index.js";

describeEast("DataList", (test) => {
    // =========================================================================
    // DataList.Root - Basic Creation
    // =========================================================================

    test("creates data list with items", $ => {
        const list = $.let(DataList.Root([
            { label: "Name", value: Text.Root("Alice") },
            { label: "Email", value: Text.Root("alice@example.com") },
        ]));

        $(Assert.equal(list.unwrap().unwrap("DataList").orientation.hasTag("none"), true));
        $(Assert.equal(list.unwrap().unwrap("DataList").size.hasTag("none"), true));
        $(Assert.equal(list.unwrap().unwrap("DataList").variant.hasTag("none"), true));
    });

    test("creates data list with single item", $ => {
        const list = $.let(DataList.Root([
            { label: "Status", value: Text.Root("Active") },
        ]));

        $(Assert.equal(list.unwrap().unwrap("DataList").orientation.hasTag("none"), true));
    });

    test("creates empty data list", $ => {
        const list = $.let(DataList.Root([]));

        $(Assert.equal(list.unwrap().unwrap("DataList").orientation.hasTag("none"), true));
        $(Assert.equal(list.unwrap().unwrap("DataList").size.hasTag("none"), true));
    });

    // =========================================================================
    // DataList.Root - Orientation
    // =========================================================================

    test("creates horizontal data list", $ => {
        const list = $.let(DataList.Root([
            { label: "Name", value: Text.Root("Bob") },
        ], {
            orientation: "horizontal",
        }));

        $(Assert.equal(list.unwrap().unwrap("DataList").orientation.hasTag("some"), true));
        $(Assert.equal(list.unwrap().unwrap("DataList").orientation.unwrap("some").hasTag("horizontal"), true));
    });

    test("creates vertical data list", $ => {
        const list = $.let(DataList.Root([
            { label: "Status", value: Text.Root("Active") },
        ], {
            orientation: "vertical",
        }));

        $(Assert.equal(list.unwrap().unwrap("DataList").orientation.unwrap("some").hasTag("vertical"), true));
    });

    // =========================================================================
    // DataList.Root - Size
    // =========================================================================

    test("creates data list with sm size", $ => {
        const list = $.let(DataList.Root([
            { label: "Label", value: Text.Root("Value") },
        ], {
            size: "sm",
        }));

        $(Assert.equal(list.unwrap().unwrap("DataList").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates data list with md size", $ => {
        const list = $.let(DataList.Root([
            { label: "Label", value: Text.Root("Value") },
        ], {
            size: "md",
        }));

        $(Assert.equal(list.unwrap().unwrap("DataList").size.unwrap("some").hasTag("md"), true));
    });

    test("creates data list with lg size", $ => {
        const list = $.let(DataList.Root([
            { label: "Label", value: Text.Root("Value") },
        ], {
            size: "lg",
        }));

        $(Assert.equal(list.unwrap().unwrap("DataList").size.unwrap("some").hasTag("lg"), true));
    });

    // =========================================================================
    // DataList.Root - Variant
    // =========================================================================

    test("creates data list with subtle variant", $ => {
        const list = $.let(DataList.Root([
            { label: "Label", value: Text.Root("Value") },
        ], {
            variant: "subtle",
        }));

        $(Assert.equal(list.unwrap().unwrap("DataList").variant.hasTag("some"), true));
        $(Assert.equal(list.unwrap().unwrap("DataList").variant.unwrap("some").hasTag("subtle"), true));
    });

    test("creates data list with bold variant", $ => {
        const list = $.let(DataList.Root([
            { label: "Label", value: Text.Root("Value") },
        ], {
            variant: "bold",
        }));

        $(Assert.equal(list.unwrap().unwrap("DataList").variant.unwrap("some").hasTag("bold"), true));
    });

    test("creates data list with DataListVariant helper", $ => {
        const list = $.let(DataList.Root([
            { label: "Label", value: Text.Root("Value") },
        ], {
            variant: "bold",
        }));

        $(Assert.equal(list.unwrap().unwrap("DataList").variant.unwrap("some").hasTag("bold"), true));
    });

    // =========================================================================
    // DataList.Root - Combined Options
    // =========================================================================

    test("creates data list with all options", $ => {
        const list = $.let(DataList.Root([
            { label: "Name", value: Text.Root("Alice") },
            { label: "Role", value: Text.Root("Admin") },
        ], {
            orientation: "horizontal",
            size: "md",
            variant: "bold",
        }));

        $(Assert.equal(list.unwrap().unwrap("DataList").orientation.unwrap("some").hasTag("horizontal"), true));
        $(Assert.equal(list.unwrap().unwrap("DataList").size.unwrap("some").hasTag("md"), true));
        $(Assert.equal(list.unwrap().unwrap("DataList").variant.unwrap("some").hasTag("bold"), true));
    });

    test("creates user details data list", $ => {
        const list = $.let(DataList.Root([
            { label: "Username", value: Text.Root("alice_smith") },
            { label: "Email", value: Text.Root("alice@example.com") },
            { label: "Status", value: Text.Root("Active") },
            { label: "Role", value: Text.Root("Administrator") },
        ], {
            orientation: "vertical",
            variant: "subtle",
        }));

        $(Assert.equal(list.unwrap().unwrap("DataList").orientation.unwrap("some").hasTag("vertical"), true));
        $(Assert.equal(list.unwrap().unwrap("DataList").variant.unwrap("some").hasTag("subtle"), true));
    });

    test("creates product info data list", $ => {
        const list = $.let(DataList.Root([
            { label: "SKU", value: Text.Root("PRD-12345") },
            { label: "Price", value: Text.Root("$99.99") },
            { label: "Stock", value: Text.Root("In Stock") },
        ], {
            size: "sm",
        }));

        $(Assert.equal(list.unwrap().unwrap("DataList").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates order summary data list", $ => {
        const list = $.let(DataList.Root([
            { label: "Order ID", value: Text.Root("#ORD-2024-001") },
            { label: "Date", value: Text.Root("Dec 15, 2024") },
            { label: "Total", value: Text.Root("$245.00") },
            { label: "Status", value: Text.Root("Shipped") },
        ], {
            orientation: "horizontal",
            size: "lg",
            variant: "bold",
        }));

        $(Assert.equal(list.unwrap().unwrap("DataList").orientation.unwrap("some").hasTag("horizontal"), true));
        $(Assert.equal(list.unwrap().unwrap("DataList").size.unwrap("some").hasTag("lg"), true));
        $(Assert.equal(list.unwrap().unwrap("DataList").variant.unwrap("some").hasTag("bold"), true));
    });

    test("creates metadata data list", $ => {
        const list = $.let(DataList.Root([
            { label: "Created", value: Text.Root("Jan 1, 2024") },
            { label: "Modified", value: Text.Root("Dec 20, 2024") },
            { label: "Version", value: Text.Root("1.2.3") },
        ]));

        $(Assert.equal(list.unwrap().unwrap("DataList").orientation.hasTag("none"), true));
        $(Assert.equal(list.unwrap().unwrap("DataList").size.hasTag("none"), true));
        $(Assert.equal(list.unwrap().unwrap("DataList").variant.hasTag("none"), true));
    });
    // =========================================================================
    // DataList.Root - Match with different item counts
    // =========================================================================

    test("handles match branches with different item counts as items arg", $ => {
        const opt = $.let(East.value(variant("some", "predicted"), OptionType(StringType)));

        const list = $.let(DataList.Root(
            opt.match({
                some: ($, pred) => East.value([
                    { label: "Flag", value: Text.Root("A") },
                    { label: "Predicted", value: Text.Root(pred) },
                    { label: "Range", value: Text.Root("1-5") },
                ]),
                none: ($) => East.value([
                    { label: "Flag", value: Text.Root("A") },
                ]),
            }),
            { size: "sm", orientation: "horizontal" }
        ));

        $(Assert.equal(list.unwrap().unwrap("DataList").size.unwrap("some").hasTag("sm"), true));
    });

    test("handles match branches returning whole DataList components", $ => {
        const opt = $.let(East.value(variant("some", "predicted"), OptionType(StringType)));

        const list = $.let(
            opt.match({
                some: ($, pred) => DataList.Root([
                    { label: "Flag", value: Text.Root("A") },
                    { label: "Predicted", value: Text.Root(pred) },
                    { label: "Range", value: Text.Root("1-5") },
                ], { size: "sm", orientation: "horizontal" }),
                none: ($) => DataList.Root([
                    { label: "Flag", value: Text.Root("A") },
                ], { size: "sm", orientation: "horizontal" }),
            })
        );

        $(Assert.equal(list.unwrap().unwrap("DataList").size.unwrap("some").hasTag("sm"), true));
    });

}, {   platformFns: TestImpl,});
