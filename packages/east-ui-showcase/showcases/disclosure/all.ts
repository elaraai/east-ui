import { East } from "@elaraai/east";
import { UIComponentType, Accordion } from "@elaraai/east-ui";
import accordionShowcase from "./accordion";
import carouselShowcase from "./carousel";
import tabsShowcase from "./tabs";

/**
 * Combined disclosure showcase - all disclosure components organized in an accordion.
 */
export default East.function(
    [],
    UIComponentType,
    () => {
        return Accordion.Root([
            Accordion.Item("accordion", "Accordion", [accordionShowcase()]),
            Accordion.Item("carousel", "Carousel", [carouselShowcase()]),
            Accordion.Item("tabs", "Tabs", [tabsShowcase()]),
        ], { multiple: true, collapsible: true });
    }
);
