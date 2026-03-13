/**
 * Profile beast2 decode of real UI data using UIComponentType
 */
import { readFileSync } from "fs";
import { decodeBeast2For } from "@elaraai/east";
// @ts-ignore - temporary profiling export
import { _beast2_profile } from "@elaraai/east/internal";
import { UIComponentType } from "../src/component.js";

const data = readFileSync("/tmp/ui.beast2");
const buffer = new Uint8Array(data);
console.log(`File size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);

// Build decoder
const t0 = performance.now();
const decoder = decodeBeast2For(UIComponentType, { skipTypeCheck: true });
const t1 = performance.now();
console.log(`buildDecoder: ${(t1 - t0).toFixed(1)}ms`);

// Reset counters and decode
_beast2_profile.reset();
const t2 = performance.now();
const value = decoder(buffer);
const t3 = performance.now();
console.log(`decode: ${(t3 - t2).toFixed(1)}ms`);

_beast2_profile.report();
