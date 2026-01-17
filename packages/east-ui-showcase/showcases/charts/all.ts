import { East } from "@elaraai/east";
import { UIComponentType, Accordion } from "@elaraai/east-ui";
import sparklineShowcase from "./sparkline";
import areaShowcase from "./area";
import barShowcase from "./bar";
import lineShowcase from "./line";
import composedShowcase from "./composed";
import scatterShowcase from "./scatter";
import pieShowcase from "./pie";
import radarShowcase from "./radar";
import barListShowcase from "./bar-list";
import barSegmentShowcase from "./bar-segment";

/**
 * Combined charts showcase - all chart components organized in an accordion.
 */
export default East.function(
    [],
    UIComponentType,
    (_$) => {
        return Accordion.Root([
            Accordion.Item("sparkline", "Sparkline", [sparklineShowcase()]),
            Accordion.Item("area", "Area Chart", [areaShowcase()]),
            Accordion.Item("bar", "Bar Chart", [barShowcase()]),
            Accordion.Item("line", "Line Chart", [lineShowcase()]),
            Accordion.Item("scatter", "Scatter Chart", [scatterShowcase()]),
            Accordion.Item("composed", "Composed Chart", [composedShowcase()]),
            Accordion.Item("pie", "Pie Chart", [pieShowcase()]),
            Accordion.Item("radar", "Radar Chart", [radarShowcase()]),
            Accordion.Item("bar-list", "Bar List", [barListShowcase()]),
            Accordion.Item("bar-segment", "Bar Segment", [barSegmentShowcase()]),
        ], { multiple: true, collapsible: true });
    }
);
