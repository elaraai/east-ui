/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    East,
    type ExprType,
    type BlockBuilder,
    variant, printLocation
} from "@elaraai/east";

import { UIComponentType } from "../component.js";
import { OutOfScopeException } from "@elaraai/east/internal";

// ============================================================================
// Reactive Component Builder
// ============================================================================

/**
 * Creates a reactive component that re-renders independently when its dependencies change.
 *
 * @param body - Function body that returns UIComponentType. Must be a free function with no captures.
 * @returns A ReactiveComponent variant of UIComponentType
 *
 * @remarks
 * The body function MUST be a free function - no captures from parent East scope.
 * This is validated at IR creation time. Dependencies are automatically detected
 * at runtime by tracking which state keys are read during execution.
 *
 * **What IS allowed:**
 * - Platform functions (State.readTyped, State.writeTyped, etc.)
 * - Module-level constants and functions (not captures)
 * - Callbacks defined inside the body (East.function)
 *
 * **What is NOT allowed:**
 * - Parent East function scope variables ($.let, parameters, state reads)
 * - Any variable captured from enclosing East function scope
 *
 * @throws Error if the body captures variables from parent scope
 *
 * @example
 * ```ts
 * import { East, IntegerType, NullType, some } from "@elaraai/east";
 * import { Reactive, State, Stat, Button, Stack, UIComponentType } from "@elaraai/east-ui";
 *
 * const app = East.function([], UIComponentType, $ => {
 *     return Stack.VStack([
 *         // This re-renders only when "counter" changes (auto-detected)
 *         Reactive.Root($ => {
 *             const count = $(State.readTyped("counter", IntegerType)());
 *             return Stat.Root("Counter", East.str`${count.unwrap("some")}`);
 *         }),
 *
 *         // This button doesn't re-render when counter changes
 *         Button.Root("Increment", {
 *             onClick: East.function([], NullType, $ => {
 *                 const current = $(State.readTyped("counter", IntegerType)());
 *                 $(State.writeTyped("counter", some(current.unwrap("some").add(1n)), IntegerType)());
 *             })
 *         }),
 *     ]);
 * });
 * ```
 *
 * @example
 * ```ts
 * // Dynamic keys work - detected at runtime
 * Reactive.Root($ => {
 *     const userId = $(State.readTyped("currentUser", StringType)());
 *     const userData = $(State.readTyped(East.str`user_${userId.unwrap("some")}`, UserType)());
 *     return Text.Root(userData.name);
 * })
 * ```
 *
 * @example
 * ```ts
 * // ERROR: This will throw because it captures `multiplier` from parent scope
 * East.function([], UIComponentType, $ => {
 *     const multiplier = $let(5);
 *
 *     return Reactive.Root($ => {
 *         const count = $(State.readTyped("counter", IntegerType)());
 *         // ERROR: `multiplier` is captured from parent!
 *         return Text.Root(East.str`${count.unwrap("some").multiply(multiplier)}`);
 *     });
 * });
 * // Instead, read multiplier inside the Reactive body:
 * Reactive.Root($ => {
 *     const multiplier = $(State.readTyped("multiplier", IntegerType)());
 *     const count = $(State.readTyped("counter", IntegerType)());
 *     return Text.Root(East.str`${count.unwrap("some").multiply(multiplier)}`);
 * })
 * ```
 */
function createReactive(
    body: ($: BlockBuilder<typeof UIComponentType>) => ExprType<typeof UIComponentType> | void,
): ExprType<typeof UIComponentType> {
    // Create the inner render function
    const renderFn = East.function([], UIComponentType, body);

    // Get the IR and validate no captures from parent scope
    try {
        renderFn.toIR();
    } catch (e) {
        if (e instanceof OutOfScopeException) {
            throw new Error(
                `Reactive.Root body must be a free function with no captures from parent scope. ` +
                `Found capture from variable defined at ${printLocation(e.definedLocation)}. ` +
                `Move state reads inside the Reactive body or use State for shared data.`
            );
        } else {
            throw e;
        }
    }

    // Return the ReactiveComponent variant
    return East.value(variant("ReactiveComponent", {
        render: renderFn
    }), UIComponentType);
}

/**
 * Reactive component for selective re-rendering.
 *
 * @remarks
 * Use `Reactive.Root(body)` to create a reactive component that re-renders
 * independently when its state dependencies change. Dependencies are automatically
 * detected at runtime.
 *
 * @example
 * ```ts
 * import { Reactive, State, Text } from "@elaraai/east-ui";
 * import { IntegerType } from "@elaraai/east";
 *
 * // Create a reactive component
 * Reactive.Root($ => {
 *     const count = $(State.readTyped("counter", IntegerType)());
 *     return Text.Root(East.str`Count: ${count.unwrap("some")}`);
 * })
 * ```
 */
export const Reactive = {
    /**
     * Creates a reactive component that re-renders independently.
     *
     * @param body - Function body returning UIComponentType. Must be a free function.
     * @returns A ReactiveComponent variant
     *
     * @see {@link createReactive} for full documentation and examples
     */
    Root: createReactive,
} as const;
