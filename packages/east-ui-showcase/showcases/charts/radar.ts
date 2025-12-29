import { East, some } from "@elaraai/east";
import { Chart, UIComponentType, Grid, Box } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Radar Chart showcase - demonstrates radar/spider chart variants.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic radar chart
        const basic = $.let(
            ShowcaseCard(
                "Basic Radar Chart",
                "Single series radar",
                Box.Root([
                    Chart.Radar(
                        [
                            { month: "January", windows: 130 },
                            { month: "February", windows: 120 },
                            { month: "March", windows: 75 },
                            { month: "April", windows: 90 },
                            { month: "May", windows: 110 },
                        ],
                        { windows: { color: "teal.solid" } },
                        {
                            dataKey: "month",
                            grid: { show: true },
                            fillOpacity: 0.5,
                        }
                    ),
                ], { height: "250px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Radar(
                            [
                                { month: "January", windows: 130 },
                                { month: "February", windows: 120 },
                                { month: "March", windows: 75 },
                                { month: "April", windows: 90 },
                                { month: "May", windows: 110 },
                            ],
                            { windows: { color: "teal.solid" } },
                            {
                                dataKey: "month",
                                grid: { show: true },
                                fillOpacity: 0.5,
                            }
                        ),
                    ], { height: "250px", width: "100%" })
                `)
            )
        );

        // Multi-series radar
        const multiSeries = $.let(
            ShowcaseCard(
                "Multi-Series Radar",
                "Compare two data series",
                Box.Root([
                    Chart.Radar(
                        [
                            { month: "January", windows: 30, mac: 100 },
                            { month: "February", windows: 50, mac: 80 },
                            { month: "March", windows: 70, mac: 60 },
                            { month: "April", windows: 90, mac: 70 },
                            { month: "May", windows: 60, mac: 90 },
                        ],
                        {
                            windows: { color: "teal.solid" },
                            mac: { color: "orange.solid" },
                        },
                        {
                            dataKey: "month",
                            grid: { show: true },
                            legend: { show: true },
                            fillOpacity: 0.2,
                        }
                    ),
                ], { height: "280px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Radar(
                            [
                                { month: "January", windows: 30, mac: 100 },
                                { month: "February", windows: 50, mac: 80 },
                                { month: "March", windows: 70, mac: 60 },
                                { month: "April", windows: 90, mac: 70 },
                                { month: "May", windows: 60, mac: 90 },
                            ],
                            {
                                windows: { color: "teal.solid" },
                                mac: { color: "orange.solid" },
                            },
                            {
                                dataKey: "month",
                                grid: { show: true },
                                legend: { show: true },
                                fillOpacity: 0.2,
                            }
                        ),
                    ], { height: "280px", width: "100%" })
                `)
            )
        );

        // Skills comparison
        const skills = $.let(
            ShowcaseCard(
                "Skills Comparison",
                "Current vs target skills",
                Box.Root([
                    Chart.Radar(
                        [
                            { subject: "Math", current: 80, target: 90 },
                            { subject: "Science", current: 95, target: 85 },
                            { subject: "English", current: 70, target: 80 },
                            { subject: "History", current: 85, target: 75 },
                            { subject: "Art", current: 60, target: 70 },
                        ],
                        {
                            current: { color: "blue.solid" },
                            target: { color: "green.solid" },
                        },
                        {
                            dataKey: "subject",
                            grid: { show: true },
                            legend: { show: true },
                            tooltip: { show: true },
                            fillOpacity: 0.3,
                        }
                    ),
                ], { height: "280px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Radar(
                            [
                                { subject: "Math", current: 80, target: 90 },
                                { subject: "Science", current: 95, target: 85 },
                                { subject: "English", current: 70, target: 80 },
                                { subject: "History", current: 85, target: 75 },
                                { subject: "Art", current: 60, target: 70 },
                            ],
                            {
                                current: { color: "blue.solid" },
                                target: { color: "green.solid" },
                            },
                            {
                                dataKey: "subject",
                                grid: { show: true },
                                legend: { show: true },
                                tooltip: { show: true },
                                fillOpacity: 0.3,
                            }
                        ),
                    ], { height: "280px", width: "100%" })
                `)
            )
        );

        // High opacity
        const highOpacity = $.let(
            ShowcaseCard(
                "High Fill Opacity",
                "More solid fill appearance",
                Box.Root([
                    Chart.Radar(
                        [
                            { skill: "Speed", value: 85 },
                            { skill: "Power", value: 90 },
                            { skill: "Defense", value: 70 },
                            { skill: "Stamina", value: 80 },
                            { skill: "Technique", value: 95 },
                        ],
                        { value: { color: "purple.solid" } },
                        {
                            dataKey: "skill",
                            grid: { show: true },
                            fillOpacity: 0.7,
                        }
                    ),
                ], { height: "250px", width: "100%" }),
                some(`
                    Box.Root([
                        Chart.Radar(
                            [
                                { skill: "Speed", value: 85 },
                                { skill: "Power", value: 90 },
                                { skill: "Defense", value: 70 },
                                { skill: "Stamina", value: 80 },
                                { skill: "Technique", value: 95 },
                            ],
                            { value: { color: "purple.solid" } },
                            {
                                dataKey: "skill",
                                grid: { show: true },
                                fillOpacity: 0.7,
                            }
                        ),
                    ], { height: "250px", width: "100%" })
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(multiSeries),
                Grid.Item(skills, { colSpan: "2" }),
                Grid.Item(highOpacity),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
