/**
 * Instrumented profile of beast2 decode hotspots
 */
import { readFileSync } from "fs";
import { decodeBeast2ValueFor, toEastTypeValue, EastTypeValueType } from "@elaraai/east/internal";
import { UIComponentType } from "../src/component.js";

const data = readFileSync("/tmp/ui.beast2");
const buffer = new Uint8Array(data);
const MAGIC_LEN = 8;

// Decode type header to get offset
const typeDecoder = decodeBeast2ValueFor(EastTypeValueType);
const [_type, valueStartOffset] = typeDecoder(buffer, MAGIC_LEN);
console.log(`Value data: ${((buffer.length - valueStartOffset) / 1024 / 1024).toFixed(2)} MB`);

// Build value decoder
const typeValue = toEastTypeValue(UIComponentType);
const valueDecoder = decodeBeast2ValueFor(typeValue);

// Profile just the value decode with --prof
console.log('Starting decode...');
const t0 = performance.now();
const [value, endOffset] = valueDecoder(buffer, valueStartOffset, { refs: new Map() });
const t1 = performance.now();
console.log(`Decode: ${(t1 - t0).toFixed(1)}ms`);
console.log(`Consumed: ${endOffset} / ${buffer.length}`);
