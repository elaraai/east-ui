import { East, some } from "@elaraai/east";
import { Chart, UIComponentType, Grid, Box } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * BarSegment showcase - demonstrates proportional segment bars.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic bar segment
        const basic = $.let(
            ShowcaseCard(
                "Basic Bar Segment",
                "Traffic source distribution",
                Box.Root([
                    Chart.BarSegment([
                        { name: "Google", value: 500000, color: some("teal.solid") },
                        { name: "Direct", value: 100000, color: some("blue.solid") },
                        { name: "Bing", value: 200000, color: some("orange.solid") },
                        { name: "Yandex", value: 100000, color: some("purple.solid") },
                    ], {
                        sort: { by: "value", direction: "desc" },
                        showLabel: true,
                    }),
                ], { width: "100%" })
            )
        );

        // With values
        const withValues = $.let(
            ShowcaseCard(
                "With Values",
                "Show percentages in legend",
                Box.Root([
                    Chart.BarSegment([
                        { name: "Google", value: 500000, color: some("teal.solid") },
                        { name: "Direct", value: 100000, color: some("blue.solid") },
                        { name: "Bing", value: 200000, color: some("orange.solid") },
                        { name: "Yandex", value: 100000, color: some("purple.solid") },
                    ], {
                        sort: { by: "value", direction: "desc" },
                        showValue: true,
                        showLabel: true,
                    }),
                ], { width: "100%" })
            )
        );

        // Traffic sources
        const traffic = $.let(
            ShowcaseCard(
                "Traffic Sources",
                "Website traffic breakdown",
                Box.Root([
                    Chart.BarSegment([
                        { name: "Search", value: 450000, color: some("green.solid") },
                        { name: "Social", value: 250000, color: some("blue.solid") },
                        { name: "Email", value: 150000, color: some("orange.solid") },
                        { name: "Direct", value: 100000, color: some("gray.solid") },
                        { name: "Referral", value: 50000, color: some("purple.solid") },
                    ], {
                        sort: { by: "value", direction: "desc" },
                        showValue: true,
                        showLabel: true,
                    }),
                ], { width: "100%" })
            )
        );

        // Budget allocation
        const budget = $.let(
            ShowcaseCard(
                "Budget Allocation",
                "Department budget split",
                Box.Root([
                    Chart.BarSegment([
                        { name: "Development", value: 40, color: some("blue.solid") },
                        { name: "Marketing", value: 35, color: some("teal.solid") },
                        { name: "Operations", value: 15, color: some("orange.solid") },
                        { name: "Other", value: 10, color: some("gray.solid") },
                    ], {
                        showLabel: true,
                        showValue: true,
                    }),
                ], { width: "100%" })
            )
        );

        // Without labels
        const noLabels = $.let(
            ShowcaseCard(
                "Minimal Style",
                "Bar only, no legend",
                Box.Root([
                    Chart.BarSegment([
                        { name: "A", value: 40, color: some("teal.solid") },
                        { name: "B", value: 30, color: some("blue.solid") },
                        { name: "C", value: 20, color: some("orange.solid") },
                        { name: "D", value: 10, color: some("purple.solid") },
                    ], {
                        showLabel: false,
                        showValue: false,
                    }),
                ], { width: "100%" })
            )
        );

        // Sorted ascending
        const ascending = $.let(
            ShowcaseCard(
                "Ascending Sort",
                "Smallest to largest",
                Box.Root([
                    Chart.BarSegment([
                        { name: "Tiny", value: 5, color: some("pink.solid") },
                        { name: "Small", value: 15, color: some("orange.solid") },
                        { name: "Medium", value: 30, color: some("yellow.solid") },
                        { name: "Large", value: 50, color: some("green.solid") },
                    ], {
                        sort: { by: "value", direction: "asc" },
                        showLabel: true,
                        showValue: true,
                    }),
                ], { width: "100%" })
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(withValues),
                Grid.Item(traffic),
                Grid.Item(budget),
                Grid.Item(noLabels),
                Grid.Item(ascending),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
