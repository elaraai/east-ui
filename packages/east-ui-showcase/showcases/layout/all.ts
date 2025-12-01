import { East } from "@elaraai/east";
import { UIComponentType, Stack, Text } from "@elaraai/east-ui";
import boxShowcase from "./box";
import stackShowcase from "./stack";
import separatorShowcase from "./separator";
import gridShowcase from "./grid";
import splitterShowcase from "./splitter";

/**
 * Combined layout showcase - all layout components in one East.function.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        return Stack.VStack([
            Text.Root("Box", { fontWeight: "bold", fontSize: "lg" }),
            $(boxShowcase()),
            Text.Root("Stack", { fontWeight: "bold", fontSize: "lg" }),
            $(stackShowcase()),
            Text.Root("Separator", { fontWeight: "bold", fontSize: "lg" }),
            $(separatorShowcase()),
            Text.Root("Grid", { fontWeight: "bold", fontSize: "lg" }),
            $(gridShowcase()),
            Text.Root("Splitter", { fontWeight: "bold", fontSize: "lg" }),
            $(splitterShowcase()),
        ], { gap: "8", align: "stretch" });
    }
);
