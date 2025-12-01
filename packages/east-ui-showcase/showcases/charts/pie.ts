import { East, some, none } from "@elaraai/east";
import { Chart, UIComponentType, Grid, Box } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Pie Chart showcase - demonstrates pie and donut chart variants.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic pie chart
        const basic = $.let(
            ShowcaseCard(
                "Basic Pie Chart",
                "Simple pie chart with colors",
                Box.Root([
                    Chart.Pie([
                        { name: "Windows", value: 400, color: some("blue.solid") },
                        { name: "Mac", value: 300, color: some("orange.solid") },
                        { name: "Linux", value: 300, color: some("pink.solid") },
                        { name: "Other", value: 200, color: some("green.solid") },
                    ]),
                ], { height: "200px", width: "100%" })
            )
        );

        // Donut chart
        const donut = $.let(
            ShowcaseCard(
                "Donut Chart",
                "Pie with inner radius",
                Box.Root([
                    Chart.Pie(
                        [
                            { name: "Windows", value: 400, color: some("blue.solid") },
                            { name: "Mac", value: 300, color: some("orange.solid") },
                            { name: "Linux", value: 300, color: some("pink.solid") },
                            { name: "Other", value: 200, color: some("green.solid") },
                        ],
                        {
                            innerRadius: 60,
                            outerRadius: 80,
                            tooltip: Chart.Tooltip({ show: true }),
                        }
                    ),
                ], { height: "220px", width: "100%" })
            )
        );

        // With legend
        const withLegend = $.let(
            ShowcaseCard(
                "With Legend",
                "Pie chart with legend",
                Box.Root([
                    Chart.Pie(
                        [
                            { name: "Desktop", value: 450, color: some("teal.solid") },
                            { name: "Mobile", value: 350, color: some("purple.solid") },
                            { name: "Tablet", value: 200, color: some("orange.solid") },
                        ],
                        {
                            legend: Chart.Legend({ show: true }),
                        }
                    ),
                ], { height: "220px", width: "100%" })
            )
        );

        // Semi-circle
        const semiCircle = $.let(
            ShowcaseCard(
                "Semi-Circle",
                "Half pie chart",
                Box.Root([
                    Chart.Pie(
                        [
                            { name: "Complete", value: 75, color: some("green.solid") },
                            { name: "Remaining", value: 25, color: some("gray.solid") },
                        ],
                        {
                            startAngle: 180,
                            endAngle: 0,
                            innerRadius: 60,
                            outerRadius: 80,
                        }
                    ),
                ], { height: "200px", width: "100%" })
            )
        );

        // With padding angle
        const withPadding = $.let(
            ShowcaseCard(
                "With Padding",
                "Gaps between slices",
                Box.Root([
                    Chart.Pie(
                        [
                            { name: "Q1", value: 100, color: some("blue.solid") },
                            { name: "Q2", value: 120, color: some("green.solid") },
                            { name: "Q3", value: 80, color: some("orange.solid") },
                            { name: "Q4", value: 150, color: some("purple.solid") },
                        ],
                        {
                            paddingAngle: 5,
                            innerRadius: 40,
                            outerRadius: 80,
                        }
                    ),
                ], { height: "200px", width: "100%" })
            )
        );

        // With labels
        const withLabels = $.let(
            ShowcaseCard(
                "With Labels",
                "Labels on each slice",
                Box.Root([
                    Chart.Pie(
                        [
                            { name: "Chrome", value: 65, color: some("blue.solid") },
                            { name: "Safari", value: 20, color: some("orange.solid") },
                            { name: "Firefox", value: 10, color: some("pink.solid") },
                            { name: "Other", value: 5, color: some("gray.solid") },
                        ],
                        {
                            showLabels: true,
                            outerRadius: 70,
                        }
                    ),
                ], { height: "220px", width: "100%" })
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(donut),
                Grid.Item(withLegend),
                Grid.Item(semiCircle),
                Grid.Item(withPadding),
                Grid.Item(withLabels),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
