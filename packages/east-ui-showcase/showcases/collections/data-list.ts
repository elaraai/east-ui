/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East } from "@elaraai/east";
import { DataList, UIComponentType, Grid } from "@elaraai/east-ui";
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
                    DataList.Item("Status", "Active"),
                    DataList.Item("User", "john.doe@example.com"),
                    DataList.Item("Created", "2024-01-15"),
                ])
            )
        );

        // Horizontal orientation
        const horizontal = $.let(
            ShowcaseCard(
                "Horizontal Orientation",
                "Data list with horizontal layout",
                DataList.Root([
                    DataList.Item("Price", "$99.00"),
                    DataList.Item("Quantity", "5"),
                    DataList.Item("Total", "$495.00"),
                ], { orientation: "horizontal" })
            )
        );

        // Bold variant
        const bold = $.let(
            ShowcaseCard(
                "Bold Variant",
                "Data list with bold styling",
                DataList.Root([
                    DataList.Item("CPU", "Intel i9-14900K"),
                    DataList.Item("RAM", "64GB DDR5"),
                    DataList.Item("Storage", "2TB NVMe SSD"),
                ], { variant: "bold" })
            )
        );

        // Small size
        const small = $.let(
            ShowcaseCard(
                "Small Size",
                "Compact data list",
                DataList.Root([
                    DataList.Item("ID", "#12345"),
                    DataList.Item("Type", "Premium"),
                    DataList.Item("Status", "Verified"),
                ], { size: "sm" })
            )
        );

        // Large size
        const large = $.let(
            ShowcaseCard(
                "Large Size",
                "Larger data list for emphasis",
                DataList.Root([
                    DataList.Item("Revenue", "$1,234,567"),
                    DataList.Item("Growth", "+15.2%"),
                    DataList.Item("Customers", "10,432"),
                ], { size: "lg" })
            )
        );

        // Profile example
        const profile = $.let(
            ShowcaseCard(
                "User Profile",
                "Real-world data list example",
                DataList.Root([
                    DataList.Item("Full Name", "Jane Smith"),
                    DataList.Item("Email", "jane.smith@company.com"),
                    DataList.Item("Department", "Engineering"),
                    DataList.Item("Role", "Senior Developer"),
                    DataList.Item("Location", "San Francisco, CA"),
                ])
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
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
