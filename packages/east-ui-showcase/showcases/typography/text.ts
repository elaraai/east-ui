import { East, some } from "@elaraai/east";
import { Text, UIComponentType, Stack, Grid, Style } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Text showcase - demonstrates all text styles, weights, and formatting options.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic text
        const basic = $.let(
            ShowcaseCard(
                "Basic Text",
                "Plain text with no styling",
                Text.Root("Hello World - Basic Text"),
                some(`Text.Root("Hello World - Basic Text")`)
            )
        );

        // Colored text
        const colored = $.let(
            ShowcaseCard(
                "Colored Text",
                "Text with blue color",
                Text.Root("Blue colored text", { color: "blue.500" }),
                some(`Text.Root("Blue colored text", { color: "blue.500" })`)
            )
        );

        // Bold text
        const bold = $.let(
            ShowcaseCard(
                "Bold Text",
                "Text with bold font weight",
                Text.Root("Bold text", { fontWeight: Style.FontWeight("bold") }),
                some(`Text.Root("Bold text", { fontWeight: Style.FontWeight("bold") })`)
            )
        );

        // Italic text
        const italic = $.let(
            ShowcaseCard(
                "Italic Text",
                "Text with italic font style",
                Text.Root("Italic text", { fontStyle: Style.FontStyle("italic") }),
                some(`Text.Root("Italic text", { fontStyle: Style.FontStyle("italic") })`)
            )
        );

        // Font weights
        const weights = $.let(
            ShowcaseCard(
                "Font Weights",
                "All available font weights",
                Stack.HStack([
                    Text.Root("Light", { fontWeight: Style.FontWeight("light") }),
                    Text.Root("Normal", { fontWeight: Style.FontWeight("normal") }),
                    Text.Root("Medium", { fontWeight: Style.FontWeight("medium") }),
                    Text.Root("Semibold", { fontWeight: Style.FontWeight("semibold") }),
                    Text.Root("Bold", { fontWeight: Style.FontWeight("bold") }),
                ], { gap: "4" }),
                some(`Text.Root("Bold", { fontWeight: Style.FontWeight("bold") })`)
            )
        );

        // Text transforms
        const transforms = $.let(
            ShowcaseCard(
                "Text Transforms",
                "Text transformation options",
                Stack.HStack([
                    Text.Root("uppercase", { textTransform: Style.TextTransform("uppercase") }),
                    Text.Root("LOWERCASE", { textTransform: Style.TextTransform("lowercase") }),
                    Text.Root("capitalize", { textTransform: Style.TextTransform("capitalize") }),
                ], { gap: "4" }),
                some(`Text.Root("uppercase", { textTransform: Style.TextTransform("uppercase") })`)
            )
        );

        // Background color
        const background = $.let(
            ShowcaseCard(
                "Background Color",
                "Text with background highlight",
                Text.Root("Highlighted text", {
                    background: "yellow.200",
                    color: "gray.800"
                }),
                some(`
                    Text.Root("Highlighted text", {
                        background: "yellow.200",
                        color: "gray.800"
                    })
                `)
            )
        );

        // Bordered text
        const bordered = $.let(
            ShowcaseCard(
                "Bordered Text",
                "Text with border styling",
                Text.Root("Bordered text", {
                    borderWidth: Style.BorderWidth("thin"),
                    borderStyle: Style.BorderStyle("solid"),
                    borderColor: "gray.400",
                }),
                some(`
                    Text.Root("Bordered text", {
                        borderWidth: Style.BorderWidth("thin"),
                        borderStyle: Style.BorderStyle("solid"),
                        borderColor: "gray.400",
                    })
                `)
            )
        );

        // Color palette
        const colors = $.let(
            ShowcaseCard(
                "Color Palette",
                "Various text colors",
                Stack.HStack([
                    Text.Root("Red", { color: "red.500" }),
                    Text.Root("Orange", { color: "orange.500" }),
                    Text.Root("Green", { color: "green.500" }),
                    Text.Root("Teal", { color: "teal.500" }),
                    Text.Root("Blue", { color: "blue.500" }),
                    Text.Root("Purple", { color: "purple.500" }),
                ], { gap: "3" }),
                some(`Text.Root("Blue", { color: "blue.500" })`)
            )
        );

        // Combined styles
        const combined = $.let(
            ShowcaseCard(
                "Combined Styles",
                "Multiple styles on one text",
                Text.Root("Styled Text", {
                    color: "blue.600",
                    fontWeight: Style.FontWeight("bold"),
                    fontStyle: Style.FontStyle("italic"),
                    background: "blue.50",
                }),
                some(`
                    Text.Root("Styled Text", {
                        color: "blue.600",
                        fontWeight: Style.FontWeight("bold"),
                        fontStyle: Style.FontStyle("italic"),
                        background: "blue.50",
                    })
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(colored),
                Grid.Item(bold),
                Grid.Item(italic),
                Grid.Item(weights, { colSpan: "2" }),
                Grid.Item(transforms, { colSpan: "2" }),
                Grid.Item(background),
                Grid.Item(bordered),
                Grid.Item(colors, { colSpan: "2" }),
                Grid.Item(combined),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
