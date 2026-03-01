/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, some } from "@elaraai/east";
import { DataList, UIComponentType, Grid, Text, Badge, HoverCard, Stack, Highlight } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * DataList showcase - demonstrates DataList variants, sizes, and orientations.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic DataList
        const basic = $.let(
            ShowcaseCard(
                "Basic DataList",
                "Default vertical data list",
                DataList.Root([
                    { label: "Status", value: Text.Root("Active") },
                    { label: "User", value: Text.Root("john.doe@example.com") },
                    { label: "Created", value: Text.Root("2024-01-15") },
                ]),
                some(`
                    DataList.Root([
                        { label: "Status", value: Text.Root("Active") },
                        { label: "User", value: Text.Root("john.doe@example.com") },
                        { label: "Created", value: Text.Root("2024-01-15") },
                    ])
                `)
            )
        );

        // Horizontal orientation
        const horizontal = $.let(
            ShowcaseCard(
                "Horizontal Orientation",
                "Data list with horizontal layout",
                DataList.Root([
                    { label: "Price", value: Text.Root("$99.00") },
                    { label: "Quantity", value: Text.Root("5") },
                    { label: "Total", value: Text.Root("$495.00") },
                ], { orientation: "horizontal" }),
                some(`
                    DataList.Root([
                        { label: "Price", value: Text.Root("$99.00") },
                        { label: "Quantity", value: Text.Root("5") },
                        { label: "Total", value: Text.Root("$495.00") },
                    ], { orientation: "horizontal" })
                `)
            )
        );

        // Bold variant
        const bold = $.let(
            ShowcaseCard(
                "Bold Variant",
                "Data list with bold styling",
                DataList.Root([
                    { label: "CPU", value: Text.Root("Intel i9-14900K") },
                    { label: "RAM", value: Text.Root("64GB DDR5") },
                    { label: "Storage", value: Text.Root("2TB NVMe SSD") },
                ], { variant: "bold" }),
                some(`
                    DataList.Root([
                        { label: "CPU", value: Text.Root("Intel i9-14900K") },
                        { label: "RAM", value: Text.Root("64GB DDR5") },
                        { label: "Storage", value: Text.Root("2TB NVMe SSD") },
                    ], { variant: "bold" })
                `)
            )
        );

        // Small size
        const small = $.let(
            ShowcaseCard(
                "Small Size",
                "Compact data list",
                DataList.Root([
                    { label: "ID", value: Text.Root("#12345") },
                    { label: "Type", value: Text.Root("Premium") },
                    { label: "Status", value: Text.Root("Verified") },
                ], { size: "sm" }),
                some(`
                    DataList.Root([
                        { label: "ID", value: Text.Root("#12345") },
                        { label: "Type", value: Text.Root("Premium") },
                        { label: "Status", value: Text.Root("Verified") },
                    ], { size: "sm" })
                `)
            )
        );

        // Large size
        const large = $.let(
            ShowcaseCard(
                "Large Size",
                "Larger data list for emphasis",
                DataList.Root([
                    { label: "Revenue", value: Text.Root("$1,234,567") },
                    { label: "Growth", value: Text.Root("+15.2%") },
                    { label: "Customers", value: Text.Root("10,432") },
                ], { size: "lg" }),
                some(`
                    DataList.Root([
                        { label: "Revenue", value: Text.Root("$1,234,567") },
                        { label: "Growth", value: Text.Root("+15.2%") },
                        { label: "Customers", value: Text.Root("10,432") },
                    ], { size: "lg" })
                `)
            )
        );

        // Profile example
        const profile = $.let(
            ShowcaseCard(
                "User Profile",
                "Real-world data list example",
                DataList.Root([
                    { label: "Full Name", value: Text.Root("Jane Smith") },
                    { label: "Email", value: Text.Root("jane.smith@company.com") },
                    { label: "Department", value: Text.Root("Engineering") },
                    { label: "Role", value: Text.Root("Senior Developer") },
                    { label: "Location", value: Text.Root("San Francisco, CA") },
                ]),
                some(`
                    DataList.Root([
                        { label: "Full Name", value: Text.Root("Jane Smith") },
                        { label: "Email", value: Text.Root("jane.smith@company.com") },
                        { label: "Department", value: Text.Root("Engineering") },
                        { label: "Role", value: Text.Root("Senior Developer") },
                        { label: "Location", value: Text.Root("San Francisco, CA") },
                    ])
                `)
            )
        );

        // Rich values
        const richValues = $.let(
            ShowcaseCard(
                "Rich Values",
                "Values can be any UI component — badges, hover cards, highlighted text",
                DataList.Root([
                    { label: "Status", value: Badge.Root("Active", { variant: "solid", colorPalette: "green" }) },
                    { label: "Assigned To", value: HoverCard.Root(
                        Text.Root("@alice", { color: "blue.500" }),
                        [
                            Stack.VStack([
                                Text.Root("Alice Johnson", { fontWeight: "bold" }),
                                Text.Root("Lead Designer — UX Team", { fontSize: "sm" }),
                            ], { gap: "1" }),
                        ],
                    ) },
                    { label: "Filter", value: Highlight.Root("name LIKE '%smith%'", ["LIKE"]) },
                    { label: "Priority", value: Badge.Root("Urgent", { variant: "subtle", colorPalette: "red" }) },
                ]),
                some(`
                    DataList.Root([
                        { label: "Status", value: Badge.Root("Active", { variant: "solid", colorPalette: "green" }) },
                        { label: "Assigned To", value: HoverCard.Root(
                            Text.Root("@alice", { color: "blue.500" }),
                            [
                                Stack.VStack([
                                    Text.Root("Alice Johnson", { fontWeight: "bold" }),
                                    Text.Root("Lead Designer — UX Team", { fontSize: "sm" }),
                                ], { gap: "1" }),
                            ],
                        ) },
                        { label: "Filter", value: Highlight.Root("name LIKE '%smith%'", ["LIKE"]) },
                        { label: "Priority", value: Badge.Root("Urgent", { variant: "subtle", colorPalette: "red" }) },
                    ])
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(horizontal),
                Grid.Item(bold),
                Grid.Item(small),
                Grid.Item(large),
                Grid.Item(profile),
                Grid.Item(richValues, { colSpan: "2" }),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
