import { East } from "@elaraai/east";
import { UIComponentType, Stack, Text } from "@elaraai/east-ui";
import dataListShowcase from "./data-list";
import tableShowcase from "./table";
import treeViewShowcase from "./tree-view";

/**
 * Combined collections showcase - all collection components in one East.function.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        return Stack.VStack([
            Text.Root("DataList", { fontWeight: "bold", fontSize: "lg" }),
            $(dataListShowcase()),
            Text.Root("Table", { fontWeight: "bold", fontSize: "lg" }),
            $(tableShowcase()),
            Text.Root("TreeView", { fontWeight: "bold", fontSize: "lg" }),
            $(treeViewShowcase()),
        ], { gap: "8", align: "stretch" });
    }
);
