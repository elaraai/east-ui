/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * East UI React - React components for rendering East UI types with Chakra UI.
 *
 * @packageDocumentation
 */

// Top-level component that renders any East UI component
export { EastChakraComponent, type EastChakraComponentProps } from "./component.js";

// Typography
export {
    toChakraText,
    EastChakraText,
    type TextValue,
    type EastChakraTextProps,
} from "./typography/index.js";

// Buttons
export {
    toChakraButton,
    EastChakraButton,
    type ButtonValue,
    type EastChakraButtonProps,
    toChakraIconButton,
    EastChakraIconButton,
    type IconButtonValue,
    type EastChakraIconButtonProps,
} from "./buttons/index.js";

// Layout
export {
    toChakraBox,
    EastChakraBox,
    type BoxValue,
    type EastChakraBoxProps,
    toChakraStack,
    EastChakraStack,
    type StackValue,
    type EastChakraStackProps,
    toChakraSeparator,
    EastChakraSeparator,
    type SeparatorValue,
    type EastChakraSeparatorProps,
    toChakraGrid,
    EastChakraGrid,
    type GridValue,
    type EastChakraGridProps,
    toChakraSplitter,
    EastChakraSplitter,
    type SplitterValue,
    type EastChakraSplitterProps,
} from "./layout/index.js";

// Charts
export {
    EastChakraSparkline,
    type EastChakraSparklineProps,
    EastChakraAreaChart,
    type EastChakraAreaChartProps,
} from "./charts/index.js";

// Disclosure
export {
    EastChakraAccordion,
    EastChakraAccordionItem,
    toChakraAccordionRoot,
    toChakraAccordionItem,
    type AccordionRootValue,
    type AccordionItemValue,
    type EastChakraAccordionProps,
    type EastChakraAccordionItemProps,
    EastChakraCarousel,
    toChakraCarousel,
    type CarouselValue,
    type EastChakraCarouselProps,
    EastChakraTabs,
    EastChakraTabsTrigger,
    EastChakraTabsContent,
    toChakraTabsRoot,
    toChakraTabsTrigger,
    toChakraTabsContent,
    type TabsRootValue,
    type TabsItemValue,
    type EastChakraTabsProps,
    type EastChakraTabsItemProps,
} from "./disclosure/index.js";

// Collections
export {
    EastChakraDataList,
    toChakraDataListRoot,
    type DataListRootValue,
    type DataListItemValue,
    type EastChakraDataListProps,
    EastChakraTable,
    toChakraTableRoot,
    type TableRootValue,
    type TableColumnValue,
    type EastChakraTableProps,
    EastChakraTreeView,
    toChakraTreeViewRoot,
    type TreeViewRootValue,
    type TreeNodeValue,
    type EastChakraTreeViewProps,
    EastChakraPlanner,
    toChakraPlannerRoot,
    type PlannerRootValue,
    type PlannerEventValue,
    type EastChakraPlannerProps,
} from "./collections/index.js";

// Display
export {
    EastChakraIcon,
    toFontAwesomeIcon,
    type IconValue,
    type EastChakraIconProps,
    EastChakraBadge,
    toChakraBadge,
    type BadgeValue,
    type EastChakraBadgeProps,
    EastChakraTag,
    toChakraTag,
    type TagValue,
    type EastChakraTagProps,
    EastChakraAvatar,
    toChakraAvatar,
    type AvatarValue,
    type EastChakraAvatarProps,
    EastChakraStat,
    type StatValue,
    type EastChakraStatProps,
} from "./display/index.js";

// Forms
export {
    // Input
    EastChakraStringInput,
    EastChakraIntegerInput,
    EastChakraFloatInput,
    EastChakraDateTimeInput,
    toChakraStringInput,
    toChakraIntegerInput,
    toChakraFloatInput,
    toChakraDateTimeInput,
    type StringInputValue,
    type IntegerInputValue,
    type FloatInputValue,
    type DateTimeInputValue,
    type EastChakraStringInputProps,
    type EastChakraIntegerInputProps,
    type EastChakraFloatInputProps,
    type EastChakraDateTimeInputProps,
    type ChakraDateTimeInputProps,
    // Checkbox
    EastChakraCheckbox,
    toChakraCheckbox,
    type CheckboxValue,
    type EastChakraCheckboxProps,
    // Switch
    EastChakraSwitch,
    toChakraSwitch,
    type SwitchValue,
    type EastChakraSwitchProps,
    // Select
    EastChakraSelect,
    toChakraSelect,
    type SelectRootValue,
    type SelectItemValue,
    type EastChakraSelectProps,
    // Slider
    EastChakraSlider,
    toChakraSlider,
    type SliderValue,
    type EastChakraSliderProps,
    // Field
    EastChakraField,
    toChakraField,
    type FieldValue,
    type EastChakraFieldProps,
    // Textarea
    EastChakraTextarea,
    toChakraTextarea,
    type TextareaValue,
    type EastChakraTextareaProps,
    // TagsInput
    EastChakraTagsInput,
    toChakraTagsInput,
    type TagsInputValue,
    type EastChakraTagsInputProps,
    // FileUpload
    EastChakraFileUpload,
    toChakraFileUpload,
    type FileUploadValue,
    type EastChakraFileUploadProps,
} from "./forms/index.js";

// Feedback
export {
    EastChakraAlert,
    toChakraAlert,
    type AlertValue,
    type EastChakraAlertProps,
    EastChakraProgress,
    toChakraProgress,
    type ProgressValue,
    type EastChakraProgressProps,
} from "./feedback/index.js";

// Container
export {
    EastChakraCard,
    toChakraCard,
    type CardValue,
    type EastChakraCardProps,
} from "./container/index.js";

// Overlays
export {
    EastChakraTooltip,
    type TooltipValue,
    type EastChakraTooltipProps,
    EastChakraMenu,
    type MenuValue,
    type MenuItemValue,
    type EastChakraMenuProps,
    EastChakraPopover,
    type PopoverValue,
    type EastChakraPopoverProps,
    EastChakraHoverCard,
    type HoverCardValue,
    type EastChakraHoverCardProps,
    EastChakraDialog,
    type DialogValue,
    type EastChakraDialogProps,
    EastChakraDrawer,
    type DrawerValue,
    type EastChakraDrawerProps,
    EastChakraActionBar,
    type ActionBarValue,
    type ActionBarItemValue,
    type EastChakraActionBarProps,
    EastChakraToggleTip,
    type ToggleTipValue,
    type EastChakraToggleTipProps,
    // Programmatic overlay management
    OverlayManagerProvider,
    type OverlayManagerProviderProps,
    DialogOpenImpl,
    DrawerOpenImpl,
    OverlayImpl,
} from "./overlays/index.js";

// Platform (State Management)
export {
    // State namespace (main API)
    State,

    // State implementation (for compilation)
    StateImpl,
    StateRuntime,

    // Store
    UIStore,
    createUIStore,
    type UIStoreInterface,
    type UIStoreOptions,
    PersistentUIStore,
    createPersistentUIStore,

    // React Provider and Hooks
    UIStoreProvider,
    type UIStoreProviderProps,
    useUIStore,
    useUIStoreSubscription,
    useUIState,
    useUIKey,
    useUIWrite,
    useUIBatch,

    // Components
    EastComponent,
    type EastComponentProps,
    EastFunction,
    type EastFunctionProps,

    // Legacy aliases
    EastStoreProvider,
    useEastStore,
    useEastState,
    useEastKey,
    useEastWrite,
    useEastBatch,
    createEastStore,

    // Dataset namespace (main API)
    Dataset,

    // Dataset implementation (for compilation)
    DatasetImpl,
    DatasetRuntime,

    // Dataset Store
    DatasetStore,
    createDatasetStore,
    type DatasetStoreInterface,
    type DatasetStoreConfig,
    type DatasetPath,
    type DatasetPathSegment,
    datasetCacheKey,
    datasetPathToString,

    // Dataset tracking functions
    getDatasetStore,
    initializeDatasetStore,
    clearDatasetStore,
    enableDatasetTracking,
    disableDatasetTracking,
    isDatasetTracking,
    trackDatasetPath,
    preloadDatasetList,
    clearDatasetListCache,

    // Dataset React Provider and Hooks
    DatasetStoreProvider,
    type DatasetStoreProviderProps,
    useDatasetStore,
    useDatasetStoreSubscription,
    useDatasetKey,
    usePreloadDatasets,
    type DatasetToPreload,
    type PreloadDatasetsResult,
    useDatasetWrite,
    useDatasetHas,

    // Dataset Loader Component
    DatasetLoader,
    type DatasetLoaderProps,
} from "./platform/index.js";
