/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import {
    type ExprType,
    type SubtypeExprOrValue,
    East,
    variant,
    ArrayType,
    StructType,
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import { OrientationType } from "../../style.js";
import {
    CarouselStyleType,
    type CarouselStyle,
} from "./types.js";

// Re-export types
export {
    CarouselStyleType,
    OrientationType,
    type CarouselStyle,
    type OrientationLiteral,
} from "./types.js";

// ============================================================================
// Carousel Item Type
// ============================================================================

/**
 * Type for a single carousel item/slide.
 *
 * @remarks
 * Each item contains UI component children.
 *
 * @property content - The UI component content for this slide
 */
export const CarouselItemType = StructType({
    /** The UI component content for this slide */
    content: UIComponentType,
});

/**
 * Type representing the CarouselItem structure.
 */
export type CarouselItemType = typeof CarouselItemType;

// ============================================================================
// Carousel Item Factory
// ============================================================================

/**
 * Creates a carousel item/slide.
 *
 * @param content - The UI component content for this slide
 * @returns An East expression representing the carousel item
 *
 * @example
 * ```ts
 * Carousel.Item(Image.Root({ src: "/slide1.jpg" }))
 * ```
 */
function createCarouselItem(
    content: SubtypeExprOrValue<UIComponentType>
): ExprType<CarouselItemType> {
    return East.value({
        content: content,
    }, CarouselItemType);
}

// ============================================================================
// Carousel Factory
// ============================================================================

/**
 * Creates a Carousel component.
 *
 * @param items - Array of carousel items/slides
 * @param style - Optional style and configuration options
 * @returns An East expression representing the Carousel component
 *
 * @example
 * ```ts
 * import { Carousel, Box, Text } from "@elaraai/east-ui";
 *
 * // Simple image carousel
 * const carousel = Carousel.Root([
 *   Carousel.Item(Box.Root([Text.Root("Slide 1")])),
 *   Carousel.Item(Box.Root([Text.Root("Slide 2")])),
 *   Carousel.Item(Box.Root([Text.Root("Slide 3")])),
 * ], {
 *   loop: true,
 *   showIndicators: true,
 *   showControls: true,
 * });
 *
 * // Multi-slide carousel
 * const multiSlide = Carousel.Root(items, {
 *   slidesPerView: 3n,
 *   slidesPerMove: 1n,
 *   spacing: "4",
 * });
 *
 * // Autoplay carousel
 * const autoplay = Carousel.Root(banners, {
 *   autoplay: true,
 *   loop: true,
 *   allowMouseDrag: true,
 * });
 * ```
 */
function createCarousel(
    items: SubtypeExprOrValue<ArrayType<CarouselItemType>>,
    style?: CarouselStyle
): ExprType<UIComponentType> {
    // Convert string literal orientation to East value
    const orientationValue = style?.orientation
        ? (typeof style.orientation === "string"
            ? East.value(variant(style.orientation, null), OrientationType)
            : style.orientation)
        : undefined;

    // Build style object if any style properties are provided
    const styleValue = (orientationValue || style?.spacing || style?.padding)
        ? variant("some", East.value({
            orientation: orientationValue ? variant("some", orientationValue) : variant("none", null),
            spacing: style?.spacing !== undefined ? variant("some", style.spacing) : variant("none", null),
            padding: style?.padding !== undefined ? variant("some", style.padding) : variant("none", null),
        }, CarouselStyleType))
        : variant("none", null);

    return East.value(variant("Carousel", {
        items: items,
        index: style?.index !== undefined ? variant("some", style.index) : variant("none", null),
        defaultIndex: style?.defaultIndex !== undefined ? variant("some", style.defaultIndex) : variant("none", null),
        slidesPerView: style?.slidesPerView !== undefined ? variant("some", style.slidesPerView) : variant("none", null),
        slidesPerMove: style?.slidesPerMove !== undefined ? variant("some", style.slidesPerMove) : variant("none", null),
        loop: style?.loop !== undefined ? variant("some", style.loop) : variant("none", null),
        autoplay: style?.autoplay !== undefined ? variant("some", style.autoplay) : variant("none", null),
        allowMouseDrag: style?.allowMouseDrag !== undefined ? variant("some", style.allowMouseDrag) : variant("none", null),
        showIndicators: style?.showIndicators !== undefined ? variant("some", style.showIndicators) : variant("none", null),
        showControls: style?.showControls !== undefined ? variant("some", style.showControls) : variant("none", null),
        style: styleValue,
    }), UIComponentType);
}

// ============================================================================
// Carousel Namespace Export
// ============================================================================

/**
 * Carousel component namespace.
 *
 * @remarks
 * Carousel provides a slideshow component for cycling through content.
 *
 * @example
 * ```ts
 * import { Carousel, Box, Text } from "@elaraai/east-ui";
 *
 * // Basic carousel with indicators
 * const carousel = Carousel.Root([
 *   Carousel.Item(Box.Root([Text.Root("Slide 1")])),
 *   Carousel.Item(Box.Root([Text.Root("Slide 2")])),
 * ], {
 *   showIndicators: true,
 *   showControls: true,
 *   loop: true,
 * });
 *
 * // Vertical carousel
 * const vertical = Carousel.Root(items, {
 *   orientation: "vertical",
 *   slidesPerView: 1n,
 * });
 * ```
 */
export const Carousel = {
    /** Creates a Carousel component */
    Root: createCarousel,
    /** Creates a carousel item/slide */
    Item: createCarouselItem,
    /** Type definitions */
    Types: {
        /** Carousel item struct type */
        Item: CarouselItemType,
        /** Carousel style struct type */
        Style: CarouselStyleType,
    },
} as const;
