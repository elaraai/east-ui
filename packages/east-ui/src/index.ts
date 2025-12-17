/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * East UI - UI component library for the East language.
 *
 * @remarks
 * East UI provides typed UI component definitions that return data structures
 * describing UI layouts rather than rendering directly. This enables portability,
 * type safety, composability, and separation of concerns.
 *
 * Components return East data structures (variants/structs) that can be:
 * - Serialized to JSON as East IR
 * - Compiled to executable functions
 * - Rendered in any environment (React with Chakra UI, HTML, etc.)
 *
 * @packageDocumentation
 */

// Re-export variant from East for convenience
export { variant } from "@elaraai/east";

// Style System
export { Style } from "./style.js";

// Typography
export { Text, Code, Heading, Link, Highlight, Mark, List, CodeBlock } from "./typography/index.js";

// Layout
export { Box, Flex, Stack, Separator, Grid, Splitter } from "./layout/index.js";

// Buttons
export { Button, IconButton } from "./buttons/index.js";

// Forms
export { Input, Checkbox, Switch, Select, Slider, Field, FileUpload, Textarea, TagsInput } from "./forms/index.js";

// Feedback
export { Progress, Alert } from "./feedback/index.js";

// Display
export { Badge, Tag, Avatar, Stat, Icon, type IconName } from "./display/index.js";

// Containers
export { Card } from "./container/index.js";

// Collections
export { DataList, Table, TreeView, Gantt, Planner } from "./collections/index.js";

// Charts
export { Chart, Sparkline } from "./charts/index.js";

// Disclosure
export { Accordion, Carousel, Tabs } from "./disclosure/index.js";

// Overlays
export { Tooltip, Menu, Dialog, dialog_open, Drawer, drawer_open, Popover, HoverCard, ActionBar, ToggleTip } from "./overlays/index.js";

// Reactive (selective re-rendering)
export { Reactive } from "./reactive/index.js";

// Component Types
export { UIComponentType } from "./component.js";

// Platform (state management)
export { State } from "./platform/index.js";
export { UIStore, createUIStore } from "./platform/index.js";
export type { UIStoreInterface, UIStoreOptions } from "./platform/index.js";

// Tracking functions for reactive components (used by east-ui-components)
export { enableTracking, disableTracking, isTracking, trackKey } from "./platform/index.js";
