import { East, some } from "@elaraai/east";
import { Link, UIComponentType, Stack, Grid, Text } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Link showcase - demonstrates hyperlink styles and variants.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic link
        const basic = $.let(
            ShowcaseCard(
                "Basic Link",
                "Simple hyperlink",
                Link.Root("Click here", "/home"),
                some(`Link.Root("Click here", "/home")`)
            )
        );

        // External link
        const external = $.let(
            ShowcaseCard(
                "External Link",
                "Opens in new tab",
                Link.Root("Visit GitHub", "https://github.com", { external: true }),
                some(`Link.Root("Visit GitHub", "https://github.com", { external: true })`)
            )
        );

        // Underline variant
        const underline = $.let(
            ShowcaseCard(
                "Underline Variant",
                "Link with underline decoration",
                Link.Root("Underlined Link", "/about", { variant: "underline" }),
                some(`Link.Root("Underlined Link", "/about", { variant: "underline" })`)
            )
        );

        // Plain variant
        const plain = $.let(
            ShowcaseCard(
                "Plain Variant",
                "Link without decoration",
                Link.Root("Plain Link", "/contact", { variant: "plain" }),
                some(`Link.Root("Plain Link", "/contact", { variant: "plain" })`)
            )
        );

        // Color palettes
        const colors = $.let(
            ShowcaseCard(
                "Color Palettes",
                "Links with different colors",
                Stack.HStack([
                    Link.Root("Blue", "/page", { colorPalette: "blue" }),
                    Link.Root("Teal", "/page", { colorPalette: "teal" }),
                    Link.Root("Purple", "/page", { colorPalette: "purple" }),
                    Link.Root("Red", "/page", { colorPalette: "red" }),
                ], { gap: "4" }),
                some(`Link.Root("Blue", "/page", { colorPalette: "blue" })`)
            )
        );

        // In context
        const inContext = $.let(
            ShowcaseCard(
                "In Context",
                "Link within text flow",
                Stack.HStack([
                    Text.Root("Read the "),
                    Link.Root("documentation", "/docs", { colorPalette: "blue" }),
                    Text.Root(" for more info."),
                ], { gap: "1" }),
                some(`
                    Stack.HStack([
                        Text.Root("Read the "),
                        Link.Root("documentation", "/docs", { colorPalette: "blue" }),
                        Text.Root(" for more info."),
                    ], { gap: "1" })
                `)
            )
        );

        // Combined styles
        const combined = $.let(
            ShowcaseCard(
                "Combined Styles",
                "External link with all options",
                Link.Root("View Documentation", "https://docs.example.com", {
                    external: true,
                    variant: "underline",
                    colorPalette: "blue",
                }),
                some(`
                    Link.Root("View Documentation", "https://docs.example.com", {
                        external: true,
                        variant: "underline",
                        colorPalette: "blue",
                    })
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(external),
                Grid.Item(underline),
                Grid.Item(plain),
                Grid.Item(colors, { colSpan: "2" }),
                Grid.Item(inContext),
                Grid.Item(combined),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
