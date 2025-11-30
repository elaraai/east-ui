/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
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
export { Text } from "./typography/index.js";

// Layout
export { Box, Stack, HStack, VStack, Separator, Grid, Splitter } from "./layout/index.js";

// Buttons
export { Button } from "./buttons/index.js";

// Forms
export { Input, Checkbox, Switch, Select, Slider, Field, FileUpload, Fieldset, Textarea, TagsInput } from "./forms/index.js";

// Feedback
export { Progress, Alert } from "./feedback/index.js";

// Display
export { Badge, Tag, Avatar, Stat } from "./display/index.js";

// Containers
export { Card } from "./container/index.js";

// Collections
export { DataList, Table, TreeView } from "./collections/index.js";

// Charts
export { Chart, Sparkline } from "./charts/index.js";

// Disclosure
export { Accordion, Carousel, Tabs } from "./disclosure/index.js";

// Overlays
export { Tooltip, Menu } from "./overlays/index.js";

// Component Types
export { UIComponentType } from "./component.js";
