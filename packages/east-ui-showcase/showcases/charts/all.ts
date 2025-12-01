import { East } from "@elaraai/east";
import { UIComponentType, Stack, Text } from "@elaraai/east-ui";
import sparklineShowcase from "./sparkline";
import areaShowcase from "./area";
import barShowcase from "./bar";
import lineShowcase from "./line";
import scatterShowcase from "./scatter";
import pieShowcase from "./pie";
import radarShowcase from "./radar";
import barListShowcase from "./bar-list";
import barSegmentShowcase from "./bar-segment";

/**
 * Combined charts showcase - all chart components in one East.function.
 */
export default East.function(
    [],
    UIComponentType,
    ($) => {
        return Stack.VStack([
            Text.Root("Sparkline", { fontWeight: "bold", fontSize: "lg" }),
            $(sparklineShowcase()),
            Text.Root("Area Chart", { fontWeight: "bold", fontSize: "lg" }),
            $(areaShowcase()),
            Text.Root("Bar Chart", { fontWeight: "bold", fontSize: "lg" }),
            $(barShowcase()),
            Text.Root("Line Chart", { fontWeight: "bold", fontSize: "lg" }),
            $(lineShowcase()),
            Text.Root("Scatter Chart", { fontWeight: "bold", fontSize: "lg" }),
            $(scatterShowcase()),
            Text.Root("Pie Chart", { fontWeight: "bold", fontSize: "lg" }),
            $(pieShowcase()),
            Text.Root("Radar Chart", { fontWeight: "bold", fontSize: "lg" }),
            $(radarShowcase()),
            Text.Root("Bar List", { fontWeight: "bold", fontSize: "lg" }),
            $(barListShowcase()),
            Text.Root("Bar Segment", { fontWeight: "bold", fontSize: "lg" }),
            $(barSegmentShowcase()),
        ], { gap: "8", align: "stretch" });
    }
);
