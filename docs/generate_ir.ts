/**
 * Generate simplified reactive UI IR for testing east-c.
 *
 * Usage:
 *   cd east-ui/packages/east-ui && npx tsx examples/generate_ir.ts
 */

import { writeFileSync } from "fs";
import { East, IntegerType, NullType, IRType } from "@elaraai/east";
import { encodeBeast2For } from "@elaraai/east/internal";
import { UIComponentType, Stack, Text, Reactive, Button } from "../src/index.js";

// Static: Text inside a VStack
const staticUI = East.function([], UIComponentType, ($) => {
    return Stack.VStack([
        Text.Root("Hello World"),
        Text.Root("Static UI test"),
    ], { gap: "4" });
});

// Reactive: Reactive.Root with inner render function
const reactiveUI = East.function([], UIComponentType, ($) => {
    return Reactive.Root($ => {
        return Stack.VStack([
            Text.Root("Inside reactive"),
            Text.Root("Component re-renders independently"),
        ], { gap: "2" });
    });
});

// Nested: generate array of components, button with onClick
const nestedUI = East.function([], UIComponentType, ($) => {
    return Stack.VStack([
        Text.Root("Header"),
        Stack.HStack([
            Text.Root("A"),
            Text.Root("B"),
            Text.Root("C"),
        ], { gap: "2" }),
        Button.Root("Click me", {
            onClick: East.function([], NullType, $ => {
                return null;
            }),
        }),
        Text.Root("Footer"),
    ], { gap: "4" });
});

// Interactive: Reactive with button callback
const interactiveUI = East.function([], UIComponentType, ($) => {
    return Stack.VStack([
        Reactive.Root(() => {
            return Text.Root("Reactive counter display");
        }),
        Button.Root("Increment", {
            onClick: East.function([], NullType, $ => {
                return null;
            }),
        }),
    ], { gap: "3" });
});

const encodeBeast2 = encodeBeast2For(IRType);

const tests = [
    { name: "ui_static", fn: staticUI },
    { name: "ui_reactive", fn: reactiveUI },
    { name: "ui_nested", fn: nestedUI },
    { name: "ui_interactive", fn: interactiveUI },
];

for (const test of tests) {
    console.log(`Generating ${test.name}...`);
    const ir = test.fn.toIR().ir;
    const beast2Data = encodeBeast2(ir);
    writeFileSync(`/tmp/${test.name}.beast2`, beast2Data);
    console.log(`  ${(beast2Data.length / 1024).toFixed(1)}KB -> /tmp/${test.name}.beast2`);
}
console.log("\nDone!");
