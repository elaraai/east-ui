import { East } from "@elaraai/east";
import { UIComponentType, Stack, Text } from "@elaraai/east-ui";
import accordionShowcase from "./accordion";
import carouselShowcase from "./carousel";
import tabsShowcase from "./tabs";

/**
 * Combined disclosure showcase - all disclosure components in one East.function.
 */
export default East.function(
    [],
    UIComponentType,
    () => {
        return Stack.VStack([
            Text.Root("Accordion", { fontWeight: "bold", fontSize: "lg" }),
            accordionShowcase(),
            Text.Root("Carousel", { fontWeight: "bold", fontSize: "lg" }),
            carouselShowcase(),
            Text.Root("Tabs", { fontWeight: "bold", fontSize: "lg" }),
            tabsShowcase(),
        ], { gap: "8", align: "stretch" });
    }
);
