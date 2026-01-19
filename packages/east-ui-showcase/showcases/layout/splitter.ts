import { East, some, FloatType, NullType } from "@elaraai/east";
import { Splitter, Text, UIComponentType, Stack, Box, State, Reactive, Badge } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Splitter showcase - demonstrates resizable panel layouts.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic horizontal splitter
        const horizontal = $.let(
            ShowcaseCard(
                "Horizontal Splitter",
                "Two panels with horizontal split",
                Box.Root([
                    Splitter.Root([
                        Splitter.Panel(
                            Box.Root([Text.Root("Left Panel")], { padding: "4", background: "blue.50" }),
                            { id: "left" }
                        ),
                        Splitter.Panel(
                            Box.Root([Text.Root("Right Panel")], { padding: "4", background: "green.50" }),
                            { id: "right" }
                        ),
                    ], [50, 50], { orientation: "horizontal" }),
                ], { height: "150px" }),
                some(`
                  Box.Root([
                    Splitter.Root([
                        Splitter.Panel(
                            Box.Root([Text.Root("Left Panel")], { padding: "4", background: "blue.50" }),
                            { id: "left" }
                        ),
                        Splitter.Panel(
                            Box.Root([Text.Root("Right Panel")], { padding: "4", background: "green.50" }),
                            { id: "right" }
                        ),
                    ], [50, 50], { orientation: "horizontal" }),
                ], { height: "150px" })
                `)
            )
        );

        // Vertical splitter
        const vertical = $.let(
            ShowcaseCard(
                "Vertical Splitter",
                "Top and bottom panels",
                Box.Root([
                    Splitter.Root([
                        Splitter.Panel(
                            Box.Root([Text.Root("Top Panel")], { padding: "4", background: "purple.50" }),
                            { id: "top" }
                        ),
                        Splitter.Panel(
                            Box.Root([Text.Root("Bottom Panel")], { padding: "4", background: "orange.50" }),
                            { id: "bottom" }
                        ),
                    ], [40, 60], { orientation: "vertical" }),
                ], { height: "200px" }),
                some(`
                    Box.Root([
                        Splitter.Root([
                            Splitter.Panel(
                                Box.Root([Text.Root("Top Panel")], { padding: "4", background: "purple.50" }),
                                { id: "top" }
                            ),
                            Splitter.Panel(
                                Box.Root([Text.Root("Bottom Panel")], { padding: "4", background: "orange.50" }),
                                { id: "bottom" }
                            ),
                        ], [40, 60], { orientation: "vertical" }),
                    ], { height: "200px" })
                `)
            )
        );

        // Three panel layout
        const threePanel = $.let(
            ShowcaseCard(
                "Three Panel Layout",
                "Sidebar, main, and details",
                Box.Root([
                    Splitter.Root([
                        Splitter.Panel(
                            Box.Root([Text.Root("Sidebar")], { padding: "3", background: "gray.100" }),
                            { id: "sidebar" }
                        ),
                        Splitter.Panel(
                            Box.Root([Text.Root("Main Content")], { padding: "3", background: "gray.50" }),
                            { id: "main" }
                        ),
                        Splitter.Panel(
                            Box.Root([Text.Root("Details")], { padding: "3", background: "gray.100" }),
                            { id: "details" }
                        ),
                    ], [20, 60, 20], { orientation: "horizontal" }),
                ], { height: "150px" }),
                some(`
                    Box.Root([
                        Splitter.Root([
                            Splitter.Panel(
                                Box.Root([Text.Root("Sidebar")], { padding: "3", background: "gray.100" }),
                                { id: "sidebar" }
                            ),
                            Splitter.Panel(
                                Box.Root([Text.Root("Main Content")], { padding: "3", background: "gray.50" }),
                                { id: "main" }
                            ),
                            Splitter.Panel(
                                Box.Root([Text.Root("Details")], { padding: "3", background: "gray.100" }),
                                { id: "details" }
                            ),
                        ], [20, 60, 20], { orientation: "horizontal" }),
                    ], { height: "150px" }),
                `)
            )
        );

        // With size constraints
        const constrained = $.let(
            ShowcaseCard(
                "Size Constraints",
                "Panel with min/max sizes",
                Box.Root([
                    Splitter.Root([
                        Splitter.Panel(
                            Box.Root([Text.Root("Nav (min 15%, max 30%)")], { padding: "3", background: "teal.50" }),
                            { id: "nav", minSize: 15, maxSize: 30 }
                        ),
                        Splitter.Panel(
                            Box.Root([Text.Root("Content (min 50%)")], { padding: "3", background: "teal.100" }),
                            { id: "content", minSize: 50 }
                        ),
                    ], [25, 75], { orientation: "horizontal" }),
                ], { height: "120px" }),
                some(`
                    Box.Root([
                        Splitter.Root([
                            Splitter.Panel(
                                Box.Root([Text.Root("Nav (min 15%, max 30%)")], { padding: "3", background: "teal.50" }),
                                { id: "nav", minSize: 15, maxSize: 30 }
                            ),
                            Splitter.Panel(
                                Box.Root([Text.Root("Content (min 50%)")], { padding: "3", background: "teal.100" }),
                                { id: "content", minSize: 50 }
                            ),
                        ], [25, 75], { orientation: "horizontal" }),
                    ], { height: "120px" })
                `)
            )
        );

        // Asymmetric split
        const asymmetric = $.let(
            ShowcaseCard(
                "70/30 Split",
                "Asymmetric default sizes",
                Box.Root([
                    Splitter.Root([
                        Splitter.Panel(
                            Box.Root([Text.Root("Primary (70%)")], { padding: "3", background: "cyan.50" }),
                            { id: "primary" }
                        ),
                        Splitter.Panel(
                            Box.Root([Text.Root("Secondary (30%)")], { padding: "3", background: "cyan.100" }),
                            { id: "secondary" }
                        ),
                    ], [70, 30], { orientation: "horizontal" }),
                ], { height: "120px" }),
                some(`
                    Box.Root([
                        Splitter.Root([
                            Splitter.Panel(
                                Box.Root([Text.Root("Primary (70%)")], { padding: "3", background: "cyan.50" }),
                                { id: "primary" }
                            ),
                            Splitter.Panel(
                                Box.Root([Text.Root("Secondary (30%)")], { padding: "3", background: "cyan.100" }),
                                { id: "secondary" }
                            ),
                        ], [70, 30], { orientation: "horizontal" }),
                    ], { height: "120px" })    
                `)
            )
        );

        // Editor layout
        const editor = $.let(
            ShowcaseCard(
                "Editor Layout",
                "Code editor with terminal",
                Box.Root([
                    Splitter.Root([
                        Splitter.Panel(
                            Box.Root([Text.Root("Code Editor")], { padding: "4", background: "gray.800", color: "white" }),
                            { id: "editor", minSize: 30 }
                        ),
                        Splitter.Panel(
                            Box.Root([Text.Root("Terminal")], { padding: "4", background: "gray.900", color: "green.400" }),
                            { id: "terminal", minSize: 10 }
                        ),
                    ], [70, 30], { orientation: "vertical" }),
                ], { height: "200px" }),
                some(`
                    Box.Root([
                        Splitter.Root([
                            Splitter.Panel(
                                Box.Root([Text.Root("Code Editor")], { padding: "4", background: "gray.800", color: "white" }),
                                { id: "editor", minSize: 30 }
                            ),
                            Splitter.Panel(
                                Box.Root([Text.Root("Terminal")], { padding: "4", background: "gray.900", color: "green.400" }),
                                { id: "terminal", minSize: 10 }
                            ),
                        ], [70, 30], { orientation: "vertical" }),
                    ], { height: "200px" })
                `)
            )
        );

        // =====================================================================
        // INTERACTIVE EXAMPLES - Demonstrate callbacks with Reactive.Root
        // =====================================================================

        // Initialize state for interactive example
        $.if(State.has("splitter_left_size").not(), $ => {
            $(State.write([FloatType], "splitter_left_size", 50.0));
        });
        $.if(State.has("splitter_right_size").not(), $ => {
            $(State.write([FloatType], "splitter_right_size", 50.0));
        });

        // Interactive Splitter with onResize
        const interactiveSplitter = $.let(
            ShowcaseCard(
                "Interactive Splitter",
                "Drag to see onResize callback",
                Reactive.Root(East.function([], UIComponentType, $ => {
                    const leftSize = $.let(State.read([FloatType], "splitter_left_size"));
                    const rightSize = $.let(State.read([FloatType], "splitter_right_size"));

                    const onResize = East.function(
                        [Splitter.Types.ResizeDetails],
                        NullType,
                        ($, details) => {
                            // Update state with new sizes
                            const sizes = $.let(details.size);
                            $(State.write([FloatType], "splitter_left_size", sizes.get(0n)));
                            $(State.write([FloatType], "splitter_right_size", sizes.get(1n)));
                        }
                    );

                    return Stack.VStack([
                        Box.Root([
                            Splitter.Root([
                                Splitter.Panel(
                                    Box.Root([Text.Root("Left Panel")], { padding: "4", background: "blue.100" }),
                                    { id: "left" }
                                ),
                                Splitter.Panel(
                                    Box.Root([Text.Root("Right Panel")], { padding: "4", background: "green.100" }),
                                    { id: "right" }
                                ),
                            ], [50, 50], { orientation: "horizontal", onResize }),
                        ], { height: "150px" }),
                        Stack.HStack([
                            Badge.Root(
                                East.str`Left: ${East.print(leftSize)}%`,
                                { colorPalette: "blue", variant: "solid" }
                            ),
                            Badge.Root(
                                East.str`Right: ${East.print(rightSize)}%`,
                                { colorPalette: "green", variant: "solid" }
                            ),
                        ], { gap: "2" }),
                    ], { gap: "3", align: "stretch" });
                })),
                some(`
                    Reactive.Root(East.function([], UIComponentType, $ => {
                        const leftSize = $.let(State.readTyped("splitter_left_size", FloatType)());
                        const rightSize = $.let(State.readTyped("splitter_right_size", FloatType)());

                        const onResize = East.function(
                            [Splitter.Types.ResizeDetails],
                            NullType,
                            ($, details) => {
                                // Update state with new sizes
                                const sizes = $.let(details.size);
                                $(State.writeTyped("splitter_left_size", some(sizes.get(0n)), FloatType)());
                                $(State.writeTyped("splitter_right_size", some(sizes.get(1n)), FloatType)());
                            }
                        );

                        return Stack.VStack([
                            Box.Root([
                                Splitter.Root([
                                    Splitter.Panel(
                                        Box.Root([Text.Root("Left Panel")], { padding: "4", background: "blue.100" }),
                                        { id: "left" }
                                    ),
                                    Splitter.Panel(
                                        Box.Root([Text.Root("Right Panel")], { padding: "4", background: "green.100" }),
                                        { id: "right" }
                                    ),
                                ], [50, 50], { orientation: "horizontal", onResize }),
                            ], { height: "150px" }),
                            Stack.HStack([
                                Badge.Root(
                                    East.str\`Left: \${East.print(leftSize.unwrap('some'))}%\`,
                                    { colorPalette: "blue", variant: "solid" }
                                ),
                                Badge.Root(
                                    East.str\`Right: \${East.print(rightSize.unwrap('some'))}%\`,
                                    { colorPalette: "green", variant: "solid" }
                                ),
                            ], { gap: "2" }),
                        ], { gap: "3", align: "stretch" });
                    })
                `)
            )
        );

        return Stack.VStack([
            horizontal,
            vertical,
            threePanel,
            constrained,
            asymmetric,
            editor,
            interactiveSplitter,
        ], { gap: "4", width: "100%" });
    }
);
