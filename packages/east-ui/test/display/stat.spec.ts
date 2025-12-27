/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { Stat } from "../../src/index.js";

describeEast("Stat", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates stat with label and value", $ => {
        const stat = $.let(Stat.Root("Revenue", "$45,231"));

        $(assertEast.equal(stat.unwrap().unwrap("Stat").label, "Revenue"));
        $(assertEast.equal(stat.unwrap().unwrap("Stat").value, "$45,231"));
        $(assertEast.equal(stat.unwrap().unwrap("Stat").helpText.hasTag("none"), true));
        $(assertEast.equal(stat.unwrap().unwrap("Stat").indicator.hasTag("none"), true));
    });

    test("creates stat with expression values", $ => {
        const stat = $.let(Stat.Root(
            "Users",
            "1,234"
        ));

        $(assertEast.equal(stat.unwrap().unwrap("Stat").label, "Users"));
        $(assertEast.equal(stat.unwrap().unwrap("Stat").value, "1,234"));
    });

    test("creates stat with numeric-like value", $ => {
        const stat = $.let(Stat.Root("Count", "42"));

        $(assertEast.equal(stat.unwrap().unwrap("Stat").value, "42"));
    });

    // =========================================================================
    // Help Text
    // =========================================================================

    test("creates stat with help text", $ => {
        const stat = $.let(Stat.Root("Total Users", "1,234", {
            helpText: "From last month",
        }));

        $(assertEast.equal(stat.unwrap().unwrap("Stat").helpText.hasTag("some"), true));
        $(assertEast.equal(stat.unwrap().unwrap("Stat").helpText.unwrap("some"), "From last month"));
    });

    test("creates stat with trend help text", $ => {
        const stat = $.let(Stat.Root("Growth", "+23.36%", {
            helpText: "Compared to last week",
        }));

        $(assertEast.equal(stat.unwrap().unwrap("Stat").value, "+23.36%"));
        $(assertEast.equal(stat.unwrap().unwrap("Stat").helpText.unwrap("some"), "Compared to last week"));
    });

    // =========================================================================
    // Indicator
    // =========================================================================

    test("creates stat with up indicator", $ => {
        const stat = $.let(Stat.Root("Revenue", "$45,231", {
            indicator: "up",
        }));

        $(assertEast.equal(stat.unwrap().unwrap("Stat").indicator.hasTag("some"), true));
        $(assertEast.equal(stat.unwrap().unwrap("Stat").indicator.unwrap("some").hasTag("up"), true));
    });

    test("creates stat with down indicator", $ => {
        const stat = $.let(Stat.Root("Bounce Rate", "32.5%", {
            indicator: "down",
        }));

        $(assertEast.equal(stat.unwrap().unwrap("Stat").indicator.unwrap("some").hasTag("down"), true));
    });

    test("creates stat with StatIndicator helper", $ => {
        const stat = $.let(Stat.Root("Growth", "+15%", {
            indicator: "up",
        }));

        $(assertEast.equal(stat.unwrap().unwrap("Stat").indicator.unwrap("some").hasTag("up"), true));
    });

    // =========================================================================
    // Combined Options
    // =========================================================================

    test("creates stat with all options", $ => {
        const stat = $.let(Stat.Root("Revenue", "$45,231", {
            helpText: "+20.1% from last month",
            indicator: "up",
        }));

        $(assertEast.equal(stat.unwrap().unwrap("Stat").label, "Revenue"));
        $(assertEast.equal(stat.unwrap().unwrap("Stat").value, "$45,231"));
        $(assertEast.equal(stat.unwrap().unwrap("Stat").helpText.unwrap("some"), "+20.1% from last month"));
        $(assertEast.equal(stat.unwrap().unwrap("Stat").indicator.unwrap("some").hasTag("up"), true));
    });

    test("creates revenue stat with positive trend", $ => {
        const stat = $.let(Stat.Root("Monthly Revenue", "$123,456", {
            helpText: "+12.5%",
            indicator: "up",
        }));

        $(assertEast.equal(stat.unwrap().unwrap("Stat").label, "Monthly Revenue"));
        $(assertEast.equal(stat.unwrap().unwrap("Stat").helpText.unwrap("some"), "+12.5%"));
    });

    test("creates user stat with negative trend", $ => {
        const stat = $.let(Stat.Root("Active Users", "892", {
            helpText: "-5.2% from yesterday",
            indicator: "down",
        }));

        $(assertEast.equal(stat.unwrap().unwrap("Stat").value, "892"));
        $(assertEast.equal(stat.unwrap().unwrap("Stat").indicator.unwrap("some").hasTag("down"), true));
    });

    test("creates conversion rate stat", $ => {
        const stat = $.let(Stat.Root("Conversion Rate", "3.24%", {
            helpText: "Goal: 4%",
        }));

        $(assertEast.equal(stat.unwrap().unwrap("Stat").label, "Conversion Rate"));
        $(assertEast.equal(stat.unwrap().unwrap("Stat").helpText.unwrap("some"), "Goal: 4%"));
    });

    test("creates simple count stat", $ => {
        const stat = $.let(Stat.Root("Total Orders", "1,567"));

        $(assertEast.equal(stat.unwrap().unwrap("Stat").label, "Total Orders"));
        $(assertEast.equal(stat.unwrap().unwrap("Stat").value, "1,567"));
        $(assertEast.equal(stat.unwrap().unwrap("Stat").helpText.hasTag("none"), true));
    });

    test("creates percentage stat with indicator", $ => {
        const stat = $.let(Stat.Root("Satisfaction", "98.5%", {
            indicator: "up",
        }));

        $(assertEast.equal(stat.unwrap().unwrap("Stat").value, "98.5%"));
        $(assertEast.equal(stat.unwrap().unwrap("Stat").indicator.unwrap("some").hasTag("up"), true));
    });
});
