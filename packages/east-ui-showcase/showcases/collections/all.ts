import { East } from "@elaraai/east";
import { UIComponentType, Accordion } from "@elaraai/east-ui";
import dataListShowcase from "./data-list";
import tableShowcase from "./table";
import treeViewShowcase from "./tree-view";
import ganttShowcase from "./gantt";
import plannerShowcase from "./planner";

/**
 * Combined collections showcase - all collection components organized in an accordion.
 */
export default East.function(
    [],
    UIComponentType,
    (_$) => {
        return Accordion.Root([
            Accordion.Item("data-list", "DataList", [dataListShowcase()]),
            Accordion.Item("table", "Table", [tableShowcase()]),
            Accordion.Item("tree-view", "TreeView", [treeViewShowcase()]),
            Accordion.Item("gantt", "Gantt", [ganttShowcase()]),
            Accordion.Item("planner", "Planner", [plannerShowcase()]),
        ], { multiple: true, collapsible: true });
    }
);
