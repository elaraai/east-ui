import { East } from "@elaraai/east";
import { UIComponentType, Accordion } from "@elaraai/east-ui";
import boxShowcase from "./box";
import flexShowcase from "./flex";
import stackShowcase from "./stack";
import separatorShowcase from "./separator";
import gridShowcase from "./grid";
import splitterShowcase from "./splitter";

/**
 * Combined layout showcase - all layout components organized in an accordion.
 */
export default East.function(
    [],
    UIComponentType,
    () => {
        return Accordion.Root([
            Accordion.Item("box", "Box", [boxShowcase()]),
            Accordion.Item("flex", "Flex", [flexShowcase()]),
            Accordion.Item("stack", "Stack", [stackShowcase()]),
            Accordion.Item("separator", "Separator", [separatorShowcase()]),
            Accordion.Item("grid", "Grid", [gridShowcase()]),
            Accordion.Item("splitter", "Splitter", [splitterShowcase()]),
        ], { multiple: true, collapsible: true });
    }
);
