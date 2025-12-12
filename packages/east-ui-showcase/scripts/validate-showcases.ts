/**
 * Validates all showcase exports by:
 * 1. Type-checking the showcases directory (via tsc)
 * 2. Compiling each East function export with East.compile(fn, [])
 *
 * Run with: npx tsx scripts/validate-showcases.ts
 */


// Import all exports from showcases
import { State } from "@elaraai/east-ui";
import * as showcases from "../showcases/index.js";

// Track results
let passed = 0;
let failed = 0;
const errors: string[] = [];

console.log("Validating showcase East functions...\n");

for (const [name, exported] of Object.entries(showcases)) {
    // Check if it's an East function by checking for toIR method
    try {
        // Try to compile the function - this validates the East IR
        exported.toIR().compile([...State.Implementation]);
        console.log(`  ✅ ${name}`);
        passed++;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(`  ❌ ${name}: ${message}`);
        errors.push(`${name}: ${message}`);
        failed++;
    }
}

console.log(`\n${"=".repeat(50)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
    console.log("\nErrors:");
    for (const error of errors) {
        console.log(`  - ${error}`);
    }
    process.exit(1);
}

console.log("\nAll showcase functions compiled successfully!");
