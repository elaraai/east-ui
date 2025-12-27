import { East, some } from "@elaraai/east";
import { Highlight, UIComponentType, Grid } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Highlight showcase - demonstrates text highlighting for search results.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Single term
        const singleTerm = $.let(
            ShowcaseCard(
                "Single Term",
                "Highlighting one word",
                Highlight.Root("React is a JavaScript library", ["React"]),
                some(`Highlight.Root("React is a JavaScript library", ["React"])`)
            )
        );

        // Multiple terms
        const multipleTerms = $.let(
            ShowcaseCard(
                "Multiple Terms",
                "Highlighting several words",
                Highlight.Root("The quick brown fox jumps over the lazy dog", ["quick", "fox", "dog"]),
                some(`Highlight.Root("The quick brown fox...", ["quick", "fox", "dog"])`)
            )
        );

        // Custom color
        const customColor = $.let(
            ShowcaseCard(
                "Custom Color",
                "Yellow highlight background",
                Highlight.Root("Important information here", ["Important"], { color: "yellow.200" }),
                some(`
                    Highlight.Root("Important information here", ["Important"], {
                        color: "yellow.200"
                    })
                `)
            )
        );

        // Green highlight
        const greenHighlight = $.let(
            ShowcaseCard(
                "Green Highlight",
                "Success-themed highlight",
                Highlight.Root("Your changes have been saved successfully", ["saved", "successfully"], { color: "green.100" }),
                some(`
                    Highlight.Root("Your changes have been saved...", ["saved", "successfully"], {
                        color: "green.100"
                    })
                `)
            )
        );

        // Blue highlight
        const blueHighlight = $.let(
            ShowcaseCard(
                "Blue Highlight",
                "Info-themed highlight",
                Highlight.Root("Click the submit button to proceed", ["submit", "button"], { color: "blue.100" }),
                some(`
                    Highlight.Root("Click the submit button...", ["submit", "button"], {
                        color: "blue.100"
                    })
                `)
            )
        );

        // Search result example
        const searchResult = $.let(
            ShowcaseCard(
                "Search Result",
                "Typical search result display",
                Highlight.Root(
                    "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript",
                    ["TypeScript", "JavaScript"],
                    { color: "yellow.200" }
                ),
                some(`
                    Highlight.Root(
                        "TypeScript is a typed superset of JavaScript...",
                        ["TypeScript", "JavaScript"],
                        { color: "yellow.200" }
                    )
                `)
            )
        );

        // No matches
        const noMatches = $.let(
            ShowcaseCard(
                "No Matches",
                "When query doesn't match",
                Highlight.Root("This text has no highlighted words", ["xyz"]),
                some(`Highlight.Root("This text has no highlighted words", ["xyz"])`)
            )
        );

        return Grid.Root(
            [
                Grid.Item(singleTerm),
                Grid.Item(multipleTerms),
                Grid.Item(customColor),
                Grid.Item(greenHighlight),
                Grid.Item(blueHighlight),
                Grid.Item(noMatches),
                Grid.Item(searchResult, { colSpan: "2" }),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
