/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { East, some } from "@elaraai/east";
import { TreeView, UIComponentType, Grid } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * TreeView showcase - demonstrates TreeView variants, sizes, and features.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic file tree
        const fileTree = $.let(
            ShowcaseCard(
                "File Tree",
                "Basic hierarchical file structure",
                TreeView.Root([
                    TreeView.Branch("src", "src", [
                        TreeView.Branch("src-components", "components", [
                            TreeView.Item("src-components-button", "Button.tsx"),
                            TreeView.Item("src-components-input", "Input.tsx"),
                        ]),
                        TreeView.Branch("src-pages", "pages", [
                            TreeView.Item("src-pages-home", "Home.tsx"),
                            TreeView.Item("src-pages-about", "About.tsx"),
                        ]),
                        TreeView.Item("src-index", "index.ts"),
                    ]),
                    TreeView.Branch("public", "public", [
                        TreeView.Item("public-favicon", "favicon.ico"),
                    ]),
                    TreeView.Item("package-json", "package.json"),
                ]),
                some(`
                    TreeView.Root([
                        TreeView.Branch("src", "src", [
                            TreeView.Branch("src-components", "components", [
                                TreeView.Item("src-components-button", "Button.tsx"),
                                TreeView.Item("src-components-input", "Input.tsx"),
                            ]),
                            TreeView.Branch("src-pages", "pages", [
                                TreeView.Item("src-pages-home", "Home.tsx"),
                                TreeView.Item("src-pages-about", "About.tsx"),
                            ]),
                            TreeView.Item("src-index", "index.ts"),
                        ]),
                        TreeView.Branch("public", "public", [
                            TreeView.Item("public-favicon", "favicon.ico"),
                        ]),
                        TreeView.Item("package-json", "package.json"),
                    ])
                `)
            )
        );

        // File tree with icons
        const iconTree = $.let(
            ShowcaseCard(
                "With Icons",
                "Tree nodes with indicator icons",
                TreeView.Root([
                    TreeView.Branch("src", "src", [
                        TreeView.Item("index", "index.ts", { prefix: "fas", name: "file-code", color: "blue.500" }),
                        TreeView.Item("utils", "utils.ts", { prefix: "fas", name: "file-code", color: "blue.500" }),
                    ], { prefix: "fas", name: "folder", color: "yellow.500" }),
                    TreeView.Branch("docs", "docs", [
                        TreeView.Item("readme", "README.md", { prefix: "far", name: "file" }),
                    ], { prefix: "fas", name: "folder", color: "yellow.500" }),
                    TreeView.Item("package", "package.json", { prefix: "far", name: "file" }),
                ]),
                some(`
                    TreeView.Root([
                        TreeView.Branch("src", "src", [
                            TreeView.Item("index", "index.ts", { prefix: "fas", name: "file-code", color: "blue.500" }),
                            TreeView.Item("utils", "utils.ts", { prefix: "fas", name: "file-code", color: "blue.500" }),
                        ], { prefix: "fas", name: "folder", color: "yellow.500" }),
                        TreeView.Branch("docs", "docs", [
                            TreeView.Item("readme", "README.md", { prefix: "far", name: "file" }),
                        ], { prefix: "fas", name: "folder", color: "yellow.500" }),
                        TreeView.Item("package", "package.json", { prefix: "far", name: "file" }),
                    ])
                `)
            )
        );

        // Organization tree with user icons
        const orgTree = $.let(
            ShowcaseCard(
                "Organization Tree",
                "Company hierarchy with user icons",
                TreeView.Root([
                    TreeView.Branch("ceo", "CEO", [
                        TreeView.Branch("cto", "CTO", [
                            TreeView.Branch("eng-lead", "Engineering Lead", [
                                TreeView.Item("dev1", "Senior Developer", { prefix: "fas", name: "user", color: "blue.500" }),
                                TreeView.Item("dev2", "Junior Developer", { prefix: "fas", name: "user", color: "blue.400" }),
                            ], { prefix: "fas", name: "users", color: "purple.500" }),
                            TreeView.Item("qa-lead", "QA Lead", { prefix: "fas", name: "user-check", color: "green.500" }),
                        ], { prefix: "fas", name: "user-tie", color: "teal.500" }),
                        TreeView.Branch("cfo", "CFO", [
                            TreeView.Item("finance", "Finance Manager", { prefix: "fas", name: "user", color: "green.500" }),
                        ], { prefix: "fas", name: "user-tie", color: "teal.500" }),
                        TreeView.Branch("cmo", "CMO", [
                            TreeView.Item("marketing", "Marketing Lead", { prefix: "fas", name: "user", color: "pink.500" }),
                        ], { prefix: "fas", name: "user-tie", color: "teal.500" }),
                    ], { prefix: "fas", name: "crown", color: "yellow.500" }),
                ]),
                some(`
                    TreeView.Root([
                        TreeView.Branch("ceo", "CEO", [
                            TreeView.Branch("cto", "CTO", [
                                TreeView.Branch("eng-lead", "Engineering Lead", [
                                    TreeView.Item("dev1", "Senior Developer", { prefix: "fas", name: "user", color: "blue.500" }),
                                    TreeView.Item("dev2", "Junior Developer", { prefix: "fas", name: "user", color: "blue.400" }),
                                ], { prefix: "fas", name: "users", color: "purple.500" }),
                                TreeView.Item("qa-lead", "QA Lead", { prefix: "fas", name: "user-check", color: "green.500" }),
                            ], { prefix: "fas", name: "user-tie", color: "teal.500" }),
                            TreeView.Branch("cfo", "CFO", [
                                TreeView.Item("finance", "Finance Manager", { prefix: "fas", name: "user", color: "green.500" }),
                            ], { prefix: "fas", name: "user-tie", color: "teal.500" }),
                            TreeView.Branch("cmo", "CMO", [
                                TreeView.Item("marketing", "Marketing Lead", { prefix: "fas", name: "user", color: "pink.500" }),
                            ], { prefix: "fas", name: "user-tie", color: "teal.500" }),
                        ], { prefix: "fas", name: "crown", color: "yellow.500" }),
                    ])
                `)
            )
        );

        // Small variant with book icons
        const smallTree = $.let(
            ShowcaseCard(
                "Small Size",
                "Compact tree with documentation icons",
                TreeView.Root([
                    TreeView.Branch("docs", "Documentation", [
                        TreeView.Item("docs-api", "API Reference", { prefix: "fas", name: "code" }),
                        TreeView.Item("docs-guide", "User Guide", { prefix: "fas", name: "book-open" }),
                        TreeView.Item("docs-faq", "FAQ", { prefix: "fas", name: "circle-question" }),
                    ], { prefix: "fas", name: "book", color: "blue.500" }),
                    TreeView.Branch("support", "Support", [
                        TreeView.Item("support-tickets", "Tickets", { prefix: "fas", name: "ticket" }),
                        TreeView.Item("support-chat", "Live Chat", { prefix: "fas", name: "comments" }),
                    ], { prefix: "fas", name: "headset", color: "green.500" }),
                ], { size: "sm" }),
                some(`
                    TreeView.Root([
                        TreeView.Branch("docs", "Documentation", [
                            TreeView.Item("docs-api", "API Reference", { prefix: "fas", name: "code" }),
                            TreeView.Item("docs-guide", "User Guide", { prefix: "fas", name: "book-open" }),
                            TreeView.Item("docs-faq", "FAQ", { prefix: "fas", name: "circle-question" }),
                        ], { prefix: "fas", name: "book", color: "blue.500" }),
                        TreeView.Branch("support", "Support", [
                            TreeView.Item("support-tickets", "Tickets", { prefix: "fas", name: "ticket" }),
                            TreeView.Item("support-chat", "Live Chat", { prefix: "fas", name: "comments" }),
                        ], { prefix: "fas", name: "headset", color: "green.500" }),
                    ], { size: "sm" })
                `)
            )
        );

        // Solid variant with shopping icons
        const solidTree = $.let(
            ShowcaseCard(
                "Solid Variant",
                "Shopping categories with icons",
                TreeView.Root([
                    TreeView.Branch("category1", "Electronics", [
                        TreeView.Item("cat1-phones", "Phones", { prefix: "fas", name: "mobile-screen" }),
                        TreeView.Item("cat1-laptops", "Laptops", { prefix: "fas", name: "laptop" }),
                        TreeView.Item("cat1-tablets", "Tablets", { prefix: "fas", name: "tablet-screen-button" }),
                    ], { prefix: "fas", name: "microchip", color: "blue.500" }),
                    TreeView.Branch("category2", "Clothing", [
                        TreeView.Item("cat2-mens", "Men's", { prefix: "fas", name: "person" }),
                        TreeView.Item("cat2-womens", "Women's", { prefix: "fas", name: "person-dress" }),
                    ], { prefix: "fas", name: "shirt", color: "purple.500" }),
                ], { variant: "solid" }),
                some(`
                    TreeView.Root([
                        TreeView.Branch("category1", "Electronics", [
                            TreeView.Item("cat1-phones", "Phones", { prefix: "fas", name: "mobile-screen" }),
                            TreeView.Item("cat1-laptops", "Laptops", { prefix: "fas", name: "laptop" }),
                            TreeView.Item("cat1-tablets", "Tablets", { prefix: "fas", name: "tablet-screen-button" }),
                        ], { prefix: "fas", name: "microchip", color: "blue.500" }),
                        TreeView.Branch("category2", "Clothing", [
                            TreeView.Item("cat2-mens", "Men's", { prefix: "fas", name: "person" }),
                            TreeView.Item("cat2-womens", "Women's", { prefix: "fas", name: "person-dress" }),
                        ], { prefix: "fas", name: "shirt", color: "purple.500" }),
                    ], { variant: "solid" })
                `)
            )
        );

        // Default expanded with settings icons
        const expandedTree = $.let(
            ShowcaseCard(
                "Default Expanded",
                "Settings tree with pre-expanded nodes",
                TreeView.Root([
                    TreeView.Branch("settings", "Settings", [
                        TreeView.Branch("settings-general", "General", [
                            TreeView.Item("settings-general-profile", "Profile", { prefix: "fas", name: "id-card" }),
                            TreeView.Item("settings-general-prefs", "Preferences", { prefix: "fas", name: "sliders" }),
                        ], { prefix: "fas", name: "gear" }),
                        TreeView.Branch("settings-security", "Security", [
                            TreeView.Item("settings-security-password", "Password", { prefix: "fas", name: "key" }),
                            TreeView.Item("settings-security-2fa", "Two-Factor Auth", { prefix: "fas", name: "shield-halved" }),
                        ], { prefix: "fas", name: "lock", color: "red.500" }),
                    ], { prefix: "fas", name: "cog", color: "gray.600" }),
                ], { defaultExpandedValue: ["settings", "settings-general"] }),
                some(`
                    TreeView.Root([
                        TreeView.Branch("settings", "Settings", [
                            TreeView.Branch("settings-general", "General", [
                                TreeView.Item("settings-general-profile", "Profile", { prefix: "fas", name: "id-card" }),
                                TreeView.Item("settings-general-prefs", "Preferences", { prefix: "fas", name: "sliders" }),
                            ], { prefix: "fas", name: "gear" }),
                            TreeView.Branch("settings-security", "Security", [
                                TreeView.Item("settings-security-password", "Password", { prefix: "fas", name: "key" }),
                                TreeView.Item("settings-security-2fa", "Two-Factor Auth", { prefix: "fas", name: "shield-halved" }),
                            ], { prefix: "fas", name: "lock", color: "red.500" }),
                        ], { prefix: "fas", name: "cog", color: "gray.600" }),
                    ], { defaultExpandedValue: ["settings", "settings-general"] })
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(fileTree),
                Grid.Item(iconTree),
                Grid.Item(orgTree),
                Grid.Item(smallTree),
                Grid.Item(solidTree),
                Grid.Item(expandedTree),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
