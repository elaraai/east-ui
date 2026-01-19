import { East, some, IntegerType, NullType } from "@elaraai/east";
import { Carousel, UIComponentType, Grid, Text, Box, Stack, State, Reactive, Badge } from "@elaraai/east-ui";
import { ShowcaseCard } from "../components";

/**
 * Carousel showcase - demonstrates slideshow components.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        // Basic carousel
        const basic = $.let(
            ShowcaseCard(
                "Basic Carousel",
                "Simple slideshow with controls",
                Box.Root([
                    Carousel.Root([
                        Box.Root([Text.Root("Slide 1")], { padding: "8", background: "teal.100", borderRadius: "md" }),
                        Box.Root([Text.Root("Slide 2")], { padding: "8", background: "blue.100", borderRadius: "md" }),
                        Box.Root([Text.Root("Slide 3")], { padding: "8", background: "purple.100", borderRadius: "md" }),
                    ], {
                        showControls: true,
                        showIndicators: true,
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Carousel.Root([
                            Box.Root([Text.Root("Slide 1")], { padding: "8", background: "teal.100", borderRadius: "md" }),
                            Box.Root([Text.Root("Slide 2")], { padding: "8", background: "blue.100", borderRadius: "md" }),
                            Box.Root([Text.Root("Slide 3")], { padding: "8", background: "purple.100", borderRadius: "md" }),
                        ], {
                            showControls: true,
                            showIndicators: true,
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // Loop enabled
        const loop = $.let(
            ShowcaseCard(
                "Loop Enabled",
                "Infinite scrolling carousel",
                Box.Root([
                    Carousel.Root([
                        Box.Root([Text.Root("First")], { padding: "8", background: "green.100", borderRadius: "md" }),
                        Box.Root([Text.Root("Second")], { padding: "8", background: "orange.100", borderRadius: "md" }),
                        Box.Root([Text.Root("Third")], { padding: "8", background: "pink.100", borderRadius: "md" }),
                        Box.Root([Text.Root("Fourth")], { padding: "8", background: "cyan.100", borderRadius: "md" }),
                    ], {
                        loop: true,
                        showControls: true,
                        showIndicators: true,
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Carousel.Root([
                            Box.Root([Text.Root("First")], { padding: "8", background: "green.100", borderRadius: "md" }),
                            Box.Root([Text.Root("Second")], { padding: "8", background: "orange.100", borderRadius: "md" }),
                            Box.Root([Text.Root("Third")], { padding: "8", background: "pink.100", borderRadius: "md" }),
                            Box.Root([Text.Root("Fourth")], { padding: "8", background: "cyan.100", borderRadius: "md" }),
                        ], {
                            loop: true,
                            showControls: true,
                            showIndicators: true,
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // Multiple slides per view
        const multiSlide = $.let(
            ShowcaseCard(
                "Multiple Slides",
                "Show multiple slides at once",
                Box.Root([
                    Carousel.Root([
                        Box.Root([Text.Root("1")], { padding: "4", background: "red.100", borderRadius: "md" }),
                        Box.Root([Text.Root("2")], { padding: "4", background: "orange.100", borderRadius: "md" }),
                        Box.Root([Text.Root("3")], { padding: "4", background: "yellow.100", borderRadius: "md" }),
                        Box.Root([Text.Root("4")], { padding: "4", background: "green.100", borderRadius: "md" }),
                        Box.Root([Text.Root("5")], { padding: "4", background: "blue.100", borderRadius: "md" }),
                    ], {
                        slidesPerView: 3n,
                        spacing: "4",
                        showControls: true,
                        showIndicators: true,
                    }),
                ], { width: "100%", background: "gray.50", padding: "4", borderRadius: "md" }),
                some(`
                    Box.Root([
                        Carousel.Root([
                            Box.Root([Text.Root("1")], { padding: "4", background: "red.100", borderRadius: "md" }),
                            Box.Root([Text.Root("2")], { padding: "4", background: "orange.100", borderRadius: "md" }),
                            Box.Root([Text.Root("3")], { padding: "4", background: "yellow.100", borderRadius: "md" }),
                            Box.Root([Text.Root("4")], { padding: "4", background: "green.100", borderRadius: "md" }),
                            Box.Root([Text.Root("5")], { padding: "4", background: "blue.100", borderRadius: "md" }),
                        ], {
                            slidesPerView: 3n,
                            spacing: "4",
                            showControls: true,
                            showIndicators: true,
                        }),
                    ], { width: "100%", background: "gray.50", padding: "4", borderRadius: "md" })
                `)
            )
        );

        // No controls
        const noControls = $.let(
            ShowcaseCard(
                "Indicators Only",
                "Hide navigation controls",
                Box.Root([
                    Carousel.Root([
                        Box.Root([Text.Root("Panel A")], { padding: "8", background: "gray.100", borderRadius: "md" }),
                        Box.Root([Text.Root("Panel B")], { padding: "8", background: "gray.200", borderRadius: "md" }),
                        Box.Root([Text.Root("Panel C")], { padding: "8", background: "gray.300", borderRadius: "md" }),
                    ], {
                        showControls: false,
                        showIndicators: true,
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Carousel.Root([
                            Box.Root([Text.Root("Panel A")], { padding: "8", background: "gray.100", borderRadius: "md" }),
                            Box.Root([Text.Root("Panel B")], { padding: "8", background: "gray.200", borderRadius: "md" }),
                            Box.Root([Text.Root("Panel C")], { padding: "8", background: "gray.300", borderRadius: "md" }),
                        ], {
                            showControls: false,
                            showIndicators: true,
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // Mouse drag enabled
        const draggable = $.let(
            ShowcaseCard(
                "Mouse Drag",
                "Drag to navigate slides",
                Box.Root([
                    Carousel.Root([
                        Box.Root([Text.Root("Drag me!")], { padding: "8", background: "teal.200", borderRadius: "md" }),
                        Box.Root([Text.Root("Swipe left")], { padding: "8", background: "teal.300", borderRadius: "md" }),
                        Box.Root([Text.Root("Or right")], { padding: "8", background: "teal.400", borderRadius: "md" }),
                    ], {
                        allowMouseDrag: true,
                        showControls: true,
                        showIndicators: true,
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Carousel.Root([
                            Box.Root([Text.Root("Drag me!")], { padding: "8", background: "teal.200", borderRadius: "md" }),
                            Box.Root([Text.Root("Swipe left")], { padding: "8", background: "teal.300", borderRadius: "md" }),
                            Box.Root([Text.Root("Or right")], { padding: "8", background: "teal.400", borderRadius: "md" }),
                        ], {
                            allowMouseDrag: true,
                            showControls: true,
                            showIndicators: true,
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // Minimal (no indicators)
        const minimal = $.let(
            ShowcaseCard(
                "Minimal Style",
                "Controls only, no indicators",
                Box.Root([
                    Carousel.Root([
                        Box.Root([Text.Root("Image 1")], { padding: "8", background: "purple.100", borderRadius: "md" }),
                        Box.Root([Text.Root("Image 2")], { padding: "8", background: "purple.200", borderRadius: "md" }),
                        Box.Root([Text.Root("Image 3")], { padding: "8", background: "purple.300", borderRadius: "md" }),
                    ], {
                        showControls: true,
                        showIndicators: false,
                    }),
                ], { width: "100%" }),
                some(`
                    Box.Root([
                        Carousel.Root([
                            Box.Root([Text.Root("Image 1")], { padding: "8", background: "purple.100", borderRadius: "md" }),
                            Box.Root([Text.Root("Image 2")], { padding: "8", background: "purple.200", borderRadius: "md" }),
                            Box.Root([Text.Root("Image 3")], { padding: "8", background: "purple.300", borderRadius: "md" }),
                        ], {
                            showControls: true,
                            showIndicators: false,
                        }),
                    ], { width: "100%" })
                `)
            )
        );

        // =====================================================================
        // INTERACTIVE EXAMPLES - Demonstrate callbacks with Reactive.Root
        // =====================================================================

        // Initialize state for interactive examples
        $.if(State.has("carousel_index").not(), $ => {
            $(State.write([IntegerType], "carousel_index", 0n));
        });

        // Interactive Carousel with onIndexChange
        const interactiveCarousel = $.let(
            ShowcaseCard(
                "Interactive Carousel",
                "Navigate to see onIndexChange callback",
                Reactive.Root(East.function([], UIComponentType, $ => {
                    const currentIndex = $.let(State.read([IntegerType], "carousel_index"));

                    const onIndexChange = East.function(
                        [IntegerType],
                        NullType,
                        ($, newIndex) => {
                            $(State.write([IntegerType], "carousel_index", newIndex));
                        }
                    );

                    return Stack.VStack([
                        Box.Root([
                            Carousel.Root([
                                Box.Root([Text.Root("Welcome!")], { padding: "8", background: "blue.100", borderRadius: "md" }),
                                Box.Root([Text.Root("Features")], { padding: "8", background: "green.100", borderRadius: "md" }),
                                Box.Root([Text.Root("Pricing")], { padding: "8", background: "purple.100", borderRadius: "md" }),
                                Box.Root([Text.Root("Contact")], { padding: "8", background: "orange.100", borderRadius: "md" }),
                            ], {
                                showControls: true,
                                showIndicators: true,
                                onIndexChange,
                            }),
                        ], { width: "100%" }),
                        Badge.Root(
                            East.str`Current slide: ${currentIndex.add(1n)} of 4`,
                            { colorPalette: "blue", variant: "solid" }
                        ),
                    ], { gap: "3", align: "stretch" });
                })),
                some(`
                    Reactive.Root($ => {
                        const currentIndex = $.let(State.readTyped("carousel_index", IntegerType)());

                        const onIndexChange = East.function(
                            [IntegerType],
                            NullType,
                            ($, newIndex) => {
                                $(State.writeTyped("carousel_index", some(newIndex), IntegerType)());
                            }
                        );

                        return Stack.VStack([
                            Box.Root([
                                Carousel.Root([
                                    Box.Root([Text.Root("Welcome!")], { padding: "8", background: "blue.100", borderRadius: "md" }),
                                    Box.Root([Text.Root("Features")], { padding: "8", background: "green.100", borderRadius: "md" }),
                                    Box.Root([Text.Root("Pricing")], { padding: "8", background: "purple.100", borderRadius: "md" }),
                                    Box.Root([Text.Root("Contact")], { padding: "8", background: "orange.100", borderRadius: "md" }),
                                ], {
                                    showControls: true,
                                    showIndicators: true,
                                    onIndexChange,
                                }),
                            ], { width: "100%" }),
                            Badge.Root(
                                East.str\`Current slide: \${currentIndex.unwrap('some').add(1n)} of 4\`,
                                { colorPalette: "blue", variant: "solid" }
                            ),
                        ], { gap: "3", align: "stretch" });
                    })
                `)
            )
        );

        return Grid.Root(
            [
                Grid.Item(basic),
                Grid.Item(loop),
                Grid.Item(multiSlide),
                Grid.Item(noControls),
                Grid.Item(draggable),
                Grid.Item(minimal),
                Grid.Item(interactiveCarousel, { colSpan: "2" }),
            ],
            {
                templateColumns: "repeat(2, 1fr)",
                gap: "4",
            }
        );
    }
);
