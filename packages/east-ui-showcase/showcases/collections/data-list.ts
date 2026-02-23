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
                    DataList.Item("Status", Text.Root("Active")),
                    DataList.Item("User", Text.Root("john.doe@example.com")),
                    DataList.Item("Created", Text.Root("2024-01-15")),
                ]),
                some(`
                    DataList.Root([
                        DataList.Item("Status", Text.Root("Active")),
                        DataList.Item("User", Text.Root("john.doe@example.com")),
                        DataList.Item("Created", Text.Root("2024-01-15")),
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
                    DataList.Item("Price", Text.Root("$99.00")),
                    DataList.Item("Quantity", Text.Root("5")),
                    DataList.Item("Total", Text.Root("$495.00")),
                ], { orientation: "horizontal" }),
                some(`
                    DataList.Root([
                        DataList.Item("Price", Text.Root("$99.00")),
                        DataList.Item("Quantity", Text.Root("5")),
                        DataList.Item("Total", Text.Root("$495.00")),
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
                    DataList.Item("CPU", Text.Root("Intel i9-14900K")),
                    DataList.Item("RAM", Text.Root("64GB DDR5")),
                    DataList.Item("Storage", Text.Root("2TB NVMe SSD")),
                ], { variant: "bold" }),
                some(`
                    DataList.Root([
                        DataList.Item("CPU", Text.Root("Intel i9-14900K")),
                        DataList.Item("RAM", Text.Root("64GB DDR5")),
                        DataList.Item("Storage", Text.Root("2TB NVMe SSD")),
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
                    DataList.Item("ID", Text.Root("#12345")),
                    DataList.Item("Type", Text.Root("Premium")),
                    DataList.Item("Status", Text.Root("Verified")),
                ], { size: "sm" }),
                some(`
                    DataList.Root([
                        DataList.Item("ID", Text.Root("#12345")),
                        DataList.Item("Type", Text.Root("Premium")),
                        DataList.Item("Status", Text.Root("Verified")),
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
                    DataList.Item("Revenue", Text.Root("$1,234,567")),
                    DataList.Item("Growth", Text.Root("+15.2%")),
                    DataList.Item("Customers", Text.Root("10,432")),
                ], { size: "lg" }),
                some(`
                    DataList.Root([
                        DataList.Item("Revenue", Text.Root("$1,234,567")),
                        DataList.Item("Growth", Text.Root("+15.2%")),
                        DataList.Item("Customers", Text.Root("10,432")),
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
                    DataList.Item("Full Name", Text.Root("Jane Smith")),
                    DataList.Item("Email", Text.Root("jane.smith@company.com")),
                    DataList.Item("Department", Text.Root("Engineering")),
                    DataList.Item("Role", Text.Root("Senior Developer")),
                    DataList.Item("Location", Text.Root("San Francisco, CA")),
                ]),
                some(`
                    DataList.Root([
                        DataList.Item("Full Name", Text.Root("Jane Smith")),
                        DataList.Item("Email", Text.Root("jane.smith@company.com")),
                        DataList.Item("Department", Text.Root("Engineering")),
                        DataList.Item("Role", Text.Root("Senior Developer")),
                        DataList.Item("Location", Text.Root("San Francisco, CA")),
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
                    DataList.Item("Status", Badge.Root("Active", { variant: "solid", colorPalette: "green" })),
                    DataList.Item("Assigned To", HoverCard.Root(
                        Text.Root("@alice", { color: "blue.500" }),
                        [
                            Stack.VStack([
                                Text.Root("Alice Johnson", { fontWeight: "bold" }),
                                Text.Root("Lead Designer — UX Team", { fontSize: "sm" }),
                            ], { gap: "1" }),
                        ],
                    )),
                    DataList.Item("Filter", Highlight.Root("name LIKE '%smith%'", ["LIKE"])),
                    DataList.Item("Priority", Badge.Root("Urgent", { variant: "subtle", colorPalette: "red" })),
                ]),
                some(`
                    DataList.Root([
                        DataList.Item("Status", Badge.Root("Active", { variant: "solid", colorPalette: "green" })),
                        DataList.Item("Assigned To", HoverCard.Root(
                            Text.Root("@alice", { color: "blue.500" }),
                            [
                                Stack.VStack([
                                    Text.Root("Alice Johnson", { fontWeight: "bold" }),
                                    Text.Root("Lead Designer — UX Team", { fontSize: "sm" }),
                                ], { gap: "1" }),
                            ],
                        )),
                        DataList.Item("Filter", Highlight.Root("name LIKE '%smith%'", ["LIKE"])),
                        DataList.Item("Priority", Badge.Root("Urgent", { variant: "subtle", colorPalette: "red" })),
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
