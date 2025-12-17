import { East } from "@elaraai/east";
import { UIComponentType, Stack, Text } from "@elaraai/east-ui";
import dataListShowcase from "./data-list";
import tableShowcase from "./table";
import treeViewShowcase from "./tree-view";
import ganttShowcase from "./gantt";
import plannerShowcase from "./planner";

/**
 * Combined collections showcase - all collection components in one East.function.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        return Stack.VStack([
            Text.Root("DataList", { fontWeight: "bold", fontSize: "lg" }),
            dataListShowcase(),
            Text.Root("Table", { fontWeight: "bold", fontSize: "lg" }),
            tableShowcase(),
            Text.Root("TreeView", { fontWeight: "bold", fontSize: "lg" }),
            treeViewShowcase(),
            Text.Root("Gantt", { fontWeight: "bold", fontSize: "lg" }),
            ganttShowcase(),
            Text.Root("Planner", { fontWeight: "bold", fontSize: "lg" }),
            plannerShowcase(),
        ], { gap: "8", align: "stretch" });
    }
);
