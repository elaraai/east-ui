import { East, some, none } from "@elaraai/east";
import { Chart, UIComponentType, Grid, Box } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * BarList showcase - demonstrates horizontal bar list for rankings.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic bar list
        const basic = $.let(
            ShowcaseCard(
                "Basic Bar List",
                "Traffic sources ranking",
                Box.Root([
                    Chart.BarList([
                        { name: "Google", value: 1200000, color: none },
                        { name: "Direct", value: 100000, color: none },
                        { name: "Bing", value: 200000, color: none },
                        { name: "Yahoo", value: 20000, color: none },
                        { name: "ChatGPT", value: 1345000, color: none },
                        { name: "Github", value: 100000, color: none },
                        { name: "Yandex", value: 100000, color: none },
                    ], {
                        sort: { by: "value", direction: "desc" },
                        showValue: true,
                        color: "teal.subtle",
                    }),
                ], { width: "100%" })
            )
        );

        // Compact value format
        const compact = $.let(
            ShowcaseCard(
                "Compact Values",
                "Large numbers abbreviated",
                Box.Root([
                    Chart.BarList([
                        { name: "ChatGPT", value: 1345000, color: none },
                        { name: "Google", value: 1200000, color: none },
                        { name: "Bing", value: 200000, color: none },
                        { name: "Direct", value: 100000, color: none },
                    ], {
                        sort: { by: "value", direction: "desc" },
                        showValue: true,
                        valueFormat: "compact",
                        color: "blue.subtle",
                    }),
                ], { width: "100%" })
            )
        );

        // Funnel style with percent
        const funnel = $.let(
            ShowcaseCard(
                "Funnel Chart",
                "Sales funnel with percentages",
                Box.Root([
                    Chart.BarList([
                        { name: "Created", value: 120, color: none },
                        { name: "Initial Contact", value: 90, color: none },
                        { name: "Booked Demo", value: 45, color: none },
                        { name: "Closed", value: 10, color: none },
                    ], {
                        sort: { by: "value", direction: "desc" },
                        showValue: true,
                        valueFormat: "percent",
                        color: "pink.subtle",
                    }),
                ], { width: "100%" })
            )
        );

        // Currency format
        const currency = $.let(
            ShowcaseCard(
                "Currency Values",
                "Sales by product",
                Box.Root([
                    Chart.BarList([
                        { name: "Product A", value: 50000, color: none },
                        { name: "Product B", value: 35000, color: none },
                        { name: "Product C", value: 28000, color: none },
                        { name: "Product D", value: 15000, color: none },
                    ], {
                        sort: { by: "value", direction: "desc" },
                        showValue: true,
                        valueFormat: Chart.TickFormat.Currency({ currency: "USD" }),
                        color: "green.subtle",
                    }),
                ], { width: "100%" })
            )
        );

        // Custom item colors
        const customColors = $.let(
            ShowcaseCard(
                "Custom Item Colors",
                "Individual bar colors",
                Box.Root([
                    Chart.BarList([
                        { name: "Google", value: 1200000, color: some("teal.solid") },
                        { name: "Facebook", value: 800000, color: some("blue.solid") },
                        { name: "Twitter", value: 500000, color: some("cyan.solid") },
                        { name: "LinkedIn", value: 300000, color: some("purple.solid") },
                    ], {
                        sort: { by: "value", direction: "desc" },
                        showValue: true,
                        valueFormat: "compact",
                    }),
                ], { width: "100%" })
            )
        );

        // Without values
        const noValues = $.let(
            ShowcaseCard(
                "Without Values",
                "Labels only",
                Box.Root([
                    Chart.BarList([
                        { name: "Very High", value: 95, color: none },
                        { name: "High", value: 75, color: none },
                        { name: "Medium", value: 50, color: none },
                        { name: "Low", value: 25, color: none },
                    ], {
                        sort: { by: "value", direction: "desc" },
                        showValue: false,
                        color: "orange.subtle",
                    }),
                ], { width: "100%" })
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(compact),
                Grid.Item(funnel),
                Grid.Item(currency),
                Grid.Item(customColors),
                Grid.Item(noValues),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
