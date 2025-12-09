/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo } from "react";
import { match, equalFor, type ValueTypeOf } from "@elaraai/east";
import { UIComponentType } from "@elaraai/east-ui";

// Import implemented components
import { EastChakraText } from "./typography/text";
import { EastChakraCode } from "./typography/code";
import { EastChakraHeading } from "./typography/heading";
import { EastChakraLink } from "./typography/link";
import { EastChakraHighlight } from "./typography/highlight";
import { EastChakraMark } from "./typography/mark";
import { EastChakraList } from "./typography/list";
import { EastChakraCodeBlock } from "./typography/code-block";
import { EastChakraButton } from "./buttons/button";
import { EastChakraIconButton } from "./buttons/icon-button";
import { EastChakraSparkline } from "./charts/sparkline";
import { EastChakraAreaChart } from "./charts/area";
import { EastChakraBarChart } from "./charts/bar";
import { EastChakraLineChart } from "./charts/line";
import { EastChakraScatterChart } from "./charts/scatter";
import { EastChakraPieChart } from "./charts/pie";
import { EastChakraRadarChart } from "./charts/radar";
import { EastChakraBarList } from "./charts/bar-list";
import { EastChakraBarSegment } from "./charts/bar-segment";
import { EastChakraBox } from "./layout/box";
import { EastChakraStack } from "./layout/stack";
import { EastChakraSeparator } from "./layout/separator";
import { EastChakraGrid } from "./layout/grid";
import { EastChakraSplitter } from "./layout/splitter";
import { EastChakraAccordion } from "./disclosure/accordion";
import { EastChakraCarousel } from "./disclosure/carousel";
import { EastChakraTabs } from "./disclosure/tabs";
import { EastChakraDataList } from "./collections/data-list";
import { EastChakraTable } from "./collections/table";
import { EastChakraTreeView } from "./collections/tree-view";
import { EastChakraGantt } from "./collections/gantt";
import { EastChakraIcon } from "./display/icon";
import { EastChakraBadge } from "./display/badge";
import { EastChakraTag } from "./display/tag";
import { EastChakraAvatar } from "./display/avatar";
import { EastChakraStat } from "./display/stat";
import {
    EastChakraStringInput,
    EastChakraIntegerInput,
    EastChakraFloatInput,
    EastChakraDateTimeInput,
    EastChakraCheckbox,
    EastChakraSwitch,
    EastChakraSelect,
    EastChakraSlider,
    EastChakraField,
    EastChakraFieldset,
    EastChakraTextarea,
    EastChakraTagsInput,
    EastChakraFileUpload,
} from "./forms";
import { EastChakraAlert, EastChakraProgress } from "./feedback";
import { EastChakraCard } from "./container";
import {
    EastChakraTooltip,
    EastChakraMenu,
    EastChakraPopover,
    EastChakraHoverCard,
    EastChakraDialog,
    EastChakraDrawer,
    EastChakraActionBar,
    EastChakraToggleTip,
} from "./overlays";
import { EastReactiveComponent } from "./reactive";

// Pre-define the equality function at module level
const uiComponentEqual = equalFor(UIComponentType);

export interface EastChakraComponentProps {
    value: ValueTypeOf<UIComponentType>;
}

/**
 * Top-level component that renders any East UI component.
 * Matches on the variant type and delegates to the appropriate React component.
 */
export const EastChakraComponent = memo(function EastChakraComponent({ value }: EastChakraComponentProps) {
    const rendered = useMemo(() => {
        return match(value, {
            // Typography
            Text: (v) => <EastChakraText value={v} />,
            Code: (v) => <EastChakraCode value={v} />,
            Heading: (v) => <EastChakraHeading value={v} />,
            Link: (v) => <EastChakraLink value={v} />,
            Highlight: (v) => <EastChakraHighlight value={v} />,
            Mark: (v) => <EastChakraMark value={v} />,
            List: (v) => <EastChakraList value={v} />,
            CodeBlock: (v) => <EastChakraCodeBlock value={v} />,

            // Buttons
            Button: (v) => <EastChakraButton value={v} />,
            IconButton: (v) => <EastChakraIconButton value={v} />,

            // Layout
            Box: (v) => <EastChakraBox value={v} />,
            Stack: (v) => <EastChakraStack value={v} />,
            Separator: (v) => <EastChakraSeparator value={v} />,
            Grid: (v) => <EastChakraGrid value={v} />,
            Splitter: (v) => <EastChakraSplitter value={v} />,

            // Forms
            StringInput: (v) => <EastChakraStringInput value={v} />,
            IntegerInput: (v) => <EastChakraIntegerInput value={v} />,
            FloatInput: (v) => <EastChakraFloatInput value={v} />,
            DateTimeInput: (v) => <EastChakraDateTimeInput value={v} />,
            Checkbox: (v) => <EastChakraCheckbox value={v} />,
            Switch: (v) => <EastChakraSwitch value={v} />,
            Select: (v) => <EastChakraSelect value={v} />,
            Slider: (v) => <EastChakraSlider value={v} />,
            FileUpload: (v) => <EastChakraFileUpload value={v} />,
            Field: (v) => <EastChakraField value={v} />,
            Fieldset: (v) => <EastChakraFieldset value={v} />,
            Textarea: (v) => <EastChakraTextarea value={v} />,
            TagsInput: (v) => <EastChakraTagsInput value={v} />,

            // Feedback
            Progress: (v) => <EastChakraProgress value={v} />,
            Alert: (v) => <EastChakraAlert value={v} />,

            // Display
            Icon: (v) => <EastChakraIcon value={v} />,
            Badge: (v) => <EastChakraBadge value={v} />,
            Tag: (v) => <EastChakraTag value={v} />,
            Avatar: (v) => <EastChakraAvatar value={v} />,
            Stat: (v) => <EastChakraStat value={v} />,

            // Container
            Card: (v) => <EastChakraCard value={v} />,

            // Collections
            DataList: (v) => <EastChakraDataList value={v} />,
            Table: (v) => <EastChakraTable value={v} />,
            Gantt: (v) => <EastChakraGantt value={v} />,

            // Charts
            Sparkline: (v) => <EastChakraSparkline value={v} />,
            AreaChart: (v) => <EastChakraAreaChart value={v} />,
            BarChart: (v) => <EastChakraBarChart value={v} />,
            LineChart: (v) => <EastChakraLineChart value={v} />,
            ScatterChart: (v) => <EastChakraScatterChart value={v} />,
            PieChart: (v) => <EastChakraPieChart value={v} />,
            RadarChart: (v) => <EastChakraRadarChart value={v} />,
            BarList: (v) => <EastChakraBarList value={v} />,
            BarSegment: (v) => <EastChakraBarSegment value={v} />,

            TreeView: (v) => <EastChakraTreeView value={v} />,

            // Disclosure
            Accordion: (v) => <EastChakraAccordion value={v} />,
            Carousel: (v) => <EastChakraCarousel value={v} />,
            Tabs: (v) => <EastChakraTabs value={v} />,

            // Overlays
            Tooltip: (v) => <EastChakraTooltip value={v} />,
            Menu: (v) => <EastChakraMenu value={v} />,
            Popover: (v) => <EastChakraPopover value={v} />,
            HoverCard: (v) => <EastChakraHoverCard value={v} />,
            Dialog: (v) => <EastChakraDialog value={v} />,
            Drawer: (v) => <EastChakraDrawer value={v} />,
            ActionBar: (v) => <EastChakraActionBar value={v} />,
            ToggleTip: (v) => <EastChakraToggleTip value={v} />,

            // Reactive
            ReactiveComponent: (v) => <EastReactiveComponent value={v} />,
        });
    }, [value]);

    return <>{rendered}</>;
}, (prev, next) => uiComponentEqual(prev.value, next.value));
