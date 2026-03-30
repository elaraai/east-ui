/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

/**
 * Page type for East UI dashboards with module support.
 *
 * A UIPageType wraps a component tree with a shared module symbol table.
 * Module symbols are compiled once on the client and shared across all
 * embedded functions (onClick handlers, Reactive.Root renders, etc.)
 * via late-binding SymbolIR resolution.
 *
 * @remarks
 * The `modules` field is a flat symbol table mapping fully-qualified
 * symbol names to their IR definitions. This is the same format as
 * `EastModuleType.symbols` — a merged map from all modules the page depends on.
 *
 * Client-side decode flow:
 * 1. Create empty `symbolValues` map
 * 2. Decode UIPageType with `{ symbols: symbolValues }` in Beast2 options
 *    (functions are compiled with a reference to this map — late-binding)
 * 3. Compile module IRs from `page.modules` → populate `symbolValues`
 * 4. All embedded functions now resolve symbols correctly when called
 */

import { StructType, DictType, StringType, IRType } from "@elaraai/east";
import { UIComponentType } from "./component.js";

/**
 * A UI page: a component tree bundled with its module dependencies.
 *
 * @property modules - Flat symbol table mapping symbol names to IR definitions
 * @property root - The root UI component tree
 */
export const UIPageType = StructType({
    modules: DictType(StringType, IRType),
    root: UIComponentType,
});
