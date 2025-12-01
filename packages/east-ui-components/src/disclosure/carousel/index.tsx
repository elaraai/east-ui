/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import {
    Carousel as ChakraCarousel,
    type CarouselRootProps,
    IconButton,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { Carousel } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";
import { EastChakraComponent } from "../../component";

// Pre-define equality function at module level
const carouselRootEqual = equalFor(Carousel.Types.Root);

/** East Carousel value type */
export type CarouselValue = ValueTypeOf<typeof Carousel.Types.Root>;

/**
 * Converts an East UI Carousel value to Chakra UI CarouselRoot props.
 * Pure function - easy to test independently.
 */
export function toChakraCarousel(value: CarouselValue): CarouselRootProps {
    const style = getSomeorUndefined(value.style);
    const slidesPerView = getSomeorUndefined(value.slidesPerView);
    const slidesPerMove = getSomeorUndefined(value.slidesPerMove);
    const defaultIndex = getSomeorUndefined(value.defaultIndex);
    const index = getSomeorUndefined(value.index);

    return {
        slideCount: value.items.length,
        orientation: style ? getSomeorUndefined(style.orientation)?.type : undefined,
        gap: style ? getSomeorUndefined(style.spacing) : undefined,
        padding: style ? getSomeorUndefined(style.padding) : undefined,
        loop: getSomeorUndefined(value.loop),
        autoplay: getSomeorUndefined(value.autoplay),
        allowMouseDrag: getSomeorUndefined(value.allowMouseDrag),
        ...(slidesPerView !== undefined && { slidesPerPage: Number(slidesPerView) }),
        ...(slidesPerMove !== undefined && { slidesPerMove: Number(slidesPerMove) }),
        ...(defaultIndex !== undefined && { defaultPage: Number(defaultIndex) }),
        ...(index !== undefined && { page: Number(index) }),
    };
}

export interface EastChakraCarouselProps {
    value: CarouselValue;
}

/**
 * Renders an East UI Carousel value using Chakra UI Carousel components.
 */
export const EastChakraCarousel = memo(function EastChakraCarousel({ value }: EastChakraCarouselProps) {
    const props = useMemo(() => toChakraCarousel(value), [value]);
    const showControls = getSomeorUndefined(value.showControls) ?? true;
    const showIndicators = getSomeorUndefined(value.showIndicators) ?? true;

    return (
        <ChakraCarousel.Root {...props}>
            <ChakraCarousel.ItemGroup>
                {value.items.map((item, index) => (
                    <ChakraCarousel.Item key={index} index={index}>
                        <EastChakraComponent value={item} />
                    </ChakraCarousel.Item>
                ))}
            </ChakraCarousel.ItemGroup>
            {showControls && (
                <ChakraCarousel.Control>
                    <ChakraCarousel.PrevTrigger asChild>
                        <IconButton
                            aria-label="Previous slide"
                            variant="outline"
                            size="sm"
                            rounded="full"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </IconButton>
                    </ChakraCarousel.PrevTrigger>
                    <ChakraCarousel.NextTrigger asChild>
                        <IconButton
                            aria-label="Next slide"
                            variant="outline"
                            size="sm"
                            rounded="full"
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </IconButton>
                    </ChakraCarousel.NextTrigger>
                </ChakraCarousel.Control>
            )}
            {showIndicators && (
                <ChakraCarousel.IndicatorGroup>
                    {value.items.map((_, index) => (
                        <ChakraCarousel.Indicator key={index} index={index} />
                    ))}
                </ChakraCarousel.IndicatorGroup>
            )}
        </ChakraCarousel.Root>
    );
}, (prev, next) => carouselRootEqual(prev.value, next.value));
