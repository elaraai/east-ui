import { East } from "@elaraai/east";
import { UIComponentType, Stack, Text } from "@elaraai/east-ui";
import textShowcase from "./text";
import codeShowcase from "./code";
import headingShowcase from "./heading";
import linkShowcase from "./link";
import highlightShowcase from "./highlight";
import markShowcase from "./mark";
import listShowcase from "./list";
import codeBlockShowcase from "./code-block";

/**
 * Combined typography showcase - all typography components in one East.function.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        return Stack.VStack([
            Text.Root("Text", { fontWeight: "bold", fontSize: "lg" }),
            $(textShowcase()),
            Text.Root("Code", { fontWeight: "bold", fontSize: "lg" }),
            $(codeShowcase()),
            Text.Root("Heading", { fontWeight: "bold", fontSize: "lg" }),
            $(headingShowcase()),
            Text.Root("Link", { fontWeight: "bold", fontSize: "lg" }),
            $(linkShowcase()),
            Text.Root("Highlight", { fontWeight: "bold", fontSize: "lg" }),
            $(highlightShowcase()),
            Text.Root("Mark", { fontWeight: "bold", fontSize: "lg" }),
            $(markShowcase()),
            Text.Root("List", { fontWeight: "bold", fontSize: "lg" }),
            $(listShowcase()),
            Text.Root("CodeBlock", { fontWeight: "bold", fontSize: "lg" }),
            $(codeBlockShowcase()),
        ], { gap: "8", align: "stretch" });
    }
);
