import { East, IntegerType, NullType, some } from "@elaraai/east";
import { Text, UIComponentType, Stack, Grid, Style, Reactive, State } from "@elaraai/east-ui";
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

        // Text decoration
        const decoration = $.let(
            ShowcaseCard(
                "Text Decoration",
                "Underline, line-through, and overline",
                Stack.HStack([
                    Text.Root("Underline", { textDecoration: "underline" }),
                    Text.Root("Line-through", { textDecoration: "line-through" }),
                    Text.Root("Overline", { textDecoration: "overline" }),
                ], { gap: "4" }),
                some(`
                    Stack.HStack([
                        Text.Root("Underline", { textDecoration: "underline" }),
                        Text.Root("Line-through", { textDecoration: "line-through" }),
                        Text.Root("Overline", { textDecoration: "overline" }),
                    ], { gap: "4" })
                `)
            )
        );

        // Line height & letter spacing
        const spacing = $.let(
            ShowcaseCard(
                "Line Height & Letter Spacing",
                "Fine-tune text spacing",
                Stack.VStack([
                    Text.Root("Tight letter spacing", { letterSpacing: "tighter" }),
                    Text.Root("Wide letter spacing", { letterSpacing: "wider" }),
                    Text.Root("Tall line height - wraps to show multi-line effect when the text is long enough", { lineHeight: "tall", maxWidth: "250px" }),
                    Text.Root("Short line height - compact multi-line text when the content wraps", { lineHeight: "short", maxWidth: "250px" }),
                ], { gap: "2", align: "flex-start" }),
                some(`
                    Text.Root("Tight", { letterSpacing: "tighter" })
                    Text.Root("Wide", { letterSpacing: "wider" })
                    Text.Root("Tall line", { lineHeight: "tall" })
                `)
            )
        );

        // Opacity
        const opacity = $.let(
            ShowcaseCard(
                "Opacity",
                "Text with varying opacity",
                Stack.HStack([
                    Text.Root("100%", { color: "blue.600", fontWeight: "bold" }),
                    Text.Root("75%", { color: "blue.600", fontWeight: "bold", opacity: 0.75 }),
                    Text.Root("50%", { color: "blue.600", fontWeight: "bold", opacity: 0.5 }),
                    Text.Root("25%", { color: "blue.600", fontWeight: "bold", opacity: 0.25 }),
                ], { gap: "4" }),
                some(`
                    Text.Root("75%", { color: "blue.600", opacity: 0.75 })
                `)
            )
        );

        // Padding & Margin
        const paddingMargin = $.let(
            ShowcaseCard(
                "Padding & Margin",
                "Text with padding and margin",
                Stack.VStack([
                    Text.Root("Padding: 4", {
                        padding: "4",
                        background: "blue.50",
                        borderWidth: "thin",
                        borderStyle: "solid",
                        borderColor: "blue.200",
                    }),
                    Text.Root("Padding: 2, Margin: 4", {
                        padding: "2",
                        margin: "4",
                        background: "green.50",
                        borderWidth: "thin",
                        borderStyle: "solid",
                        borderColor: "green.200",
                    }),
                ], { gap: "2", align: "flex-start" }),
                some(`
                    Text.Root("Padding: 4", {
                        padding: "4",
                        background: "blue.50",
                        borderWidth: "thin",
                        borderStyle: "solid",
                        borderColor: "blue.200",
                    })
                `)
            )
        );

        // Dimensions & overflow
        const overflow = $.let(
            ShowcaseCard(
                "Dimensions & Overflow",
                "Text with constrained size and overflow",
                Stack.VStack([
                    Text.Root("This text is constrained to 200px width and will clip overflow content.", {
                        width: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        background: "orange.50",
                        padding: "2",
                    }),
                    Text.Root("Fixed width and height box", {
                        width: "150px",
                        height: "40px",
                        background: "purple.50",
                        padding: "2",
                        overflow: "hidden",
                    }),
                ], { gap: "2", align: "flex-start" }),
                some(`
                    Text.Root("Clipped text...", {
                        width: "200px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    })
                `)
            )
        );

        // Clickable Text
        const clickableText = $.let(
            ShowcaseCard(
                "Clickable Text",
                "Text with onClick handler",
                Reactive.Root(East.function([], UIComponentType, $ => {
                    $.if(State.has("text_clicks").not(), $ => {
                        $(State.write([IntegerType], "text_clicks", 0n));
                    });
                    const count = $.let(State.read([IntegerType], "text_clicks"), IntegerType);
                    const increment = $.const(East.function([], NullType, $ => {
                        const current = $.let(State.read([IntegerType], "text_clicks"), IntegerType);
                        $(State.write([IntegerType], "text_clicks", current.add(1n)));
                    }));
                    return Stack.VStack([
                        Text.Root("Click me!", { color: "blue.500", onClick: increment }),
                        Text.Root(East.str`Clicked ${count} times`),
                    ], { gap: "2", align: "flex-start" });
                })),
                some(`
                    Reactive.Root(East.function([], UIComponentType, $ => {
                        $.if(State.has("text_clicks").not(), $ => {
                            $(State.write([IntegerType], "text_clicks", 0n));
                        });
                        const count = $.let(State.read([IntegerType], "text_clicks"), IntegerType);
                        const increment = $.const(East.function([], NullType, $ => {
                            const current = $.let(State.read([IntegerType], "text_clicks"), IntegerType);
                            $(State.write([IntegerType], "text_clicks", current.add(1n)));
                        }));
                        Text.Root("Click me!", { color: "blue.500", onClick: increment })
                    }))
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
                Grid.Item(decoration, { colSpan: "2" }),
                Grid.Item(spacing),
                Grid.Item(opacity),
                Grid.Item(paddingMargin),
                Grid.Item(overflow),
                Grid.Item(clickableText),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
