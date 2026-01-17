import { East } from "@elaraai/east";
import { UIComponentType, Accordion } from "@elaraai/east-ui";
import textShowcase from "./text";
import codeShowcase from "./code";
import headingShowcase from "./heading";
import linkShowcase from "./link";
import highlightShowcase from "./highlight";
import markShowcase from "./mark";
import listShowcase from "./list";
import codeBlockShowcase from "./code-block";

/**
 * Combined typography showcase - all typography components organized in an accordion.
 */
export default East.function(
    [],
    UIComponentType,
    () => {
        return Accordion.Root([
            Accordion.Item("text", "Text", [textShowcase()]),
            Accordion.Item("code", "Code", [codeShowcase()]),
            Accordion.Item("heading", "Heading", [headingShowcase()]),
            Accordion.Item("link", "Link", [linkShowcase()]),
            Accordion.Item("highlight", "Highlight", [highlightShowcase()]),
            Accordion.Item("mark", "Mark", [markShowcase()]),
            Accordion.Item("list", "List", [listShowcase()]),
            Accordion.Item("code-block", "CodeBlock", [codeBlockShowcase()]),
        ], { multiple: true, collapsible: true });
    }
);
