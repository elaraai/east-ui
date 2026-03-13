/**
 * Profile beast2 decode with micro-benchmarks on hot paths
 */
import { readFileSync } from "fs";
import { decodeBeast2For } from "@elaraai/east";
import { UIComponentType } from "../src/component.js";

const data = readFileSync("/tmp/ui.beast2");
const buffer = new Uint8Array(data);
console.log(`File size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);

const decoder = decodeBeast2For(UIComponentType, { skipTypeCheck: true });

console.log('\n--- Run 1 (cold) ---');
let t0 = performance.now();
let value = decoder(buffer);
let t1 = performance.now();
console.log(`decode: ${(t1 - t0).toFixed(1)}ms`);

console.log('\n--- Run 2 (warm) ---');
t0 = performance.now();
value = decoder(buffer);
t1 = performance.now();
console.log(`decode: ${(t1 - t0).toFixed(1)}ms`);

console.log('\n--- Run 3 (warm) ---');
t0 = performance.now();
value = decoder(buffer);
t1 = performance.now();
console.log(`decode: ${(t1 - t0).toFixed(1)}ms`);

// Micro-benchmark: BigInt readVarint vs number readVarint
console.log('\n--- readVarint micro-benchmark (1M single-byte varints) ---');

const testBuf = new Uint8Array(1_000_000);
for (let i = 0; i < testBuf.length; i++) testBuf[i] = i & 0x7F;

function readVarintBigInt(buffer: Uint8Array, offset: number): [number, number] {
    let result = 0n;
    let shift = 0n;
    while (true) {
        const byte = buffer[offset++]!;
        result |= BigInt(byte & 0x7F) << shift;
        if ((byte & 0x80) === 0) break;
        shift += 7n;
    }
    return [Number(result), offset];
}

function readVarintNumber(buffer: Uint8Array, offset: number): [number, number] {
    let byte = buffer[offset]!;
    if ((byte & 0x80) === 0) return [byte, offset + 1];
    let result = byte & 0x7F;
    let shift = 7;
    while (true) {
        byte = buffer[++offset]!;
        result |= (byte & 0x7F) << shift;
        if ((byte & 0x80) === 0) return [result, offset + 1];
        shift += 7;
        if (shift > 28) {
            let bigResult = BigInt(result);
            let bigShift = BigInt(shift);
            while (true) {
                byte = buffer[++offset]!;
                bigResult |= BigInt(byte & 0x7F) << bigShift;
                if ((byte & 0x80) === 0) return [Number(bigResult), offset + 1];
                bigShift += 7n;
            }
        }
    }
}

const N = 1_000_000;

let off = 0;
t0 = performance.now();
for (let i = 0; i < N; i++) {
    const [, newOff] = readVarintBigInt(testBuf, off);
    off = newOff;
    if (off >= testBuf.length) off = 0;
}
t1 = performance.now();
console.log(`BigInt path: ${(t1 - t0).toFixed(1)}ms (${((t1 - t0) / N * 1e6).toFixed(0)} ns/call)`);

off = 0;
t0 = performance.now();
for (let i = 0; i < N; i++) {
    const [, newOff] = readVarintNumber(testBuf, off);
    off = newOff;
    if (off >= testBuf.length) off = 0;
}
t1 = performance.now();
console.log(`Number path: ${(t1 - t0).toFixed(1)}ms (${((t1 - t0) / N * 1e6).toFixed(0)} ns/call)`);

// Micro-benchmark: variant() construction
console.log('\n--- variant() micro-benchmark (1M calls) ---');
import { variant } from "@elaraai/east";

t0 = performance.now();
for (let i = 0; i < N; i++) {
    variant("Text", null);
}
t1 = performance.now();
console.log(`variant(): ${(t1 - t0).toFixed(1)}ms (${((t1 - t0) / N * 1e6).toFixed(0)} ns/call)`);

// Micro-benchmark: tuple allocation
console.log('\n--- tuple allocation micro-benchmark (1M calls) ---');
t0 = performance.now();
let dummy: any;
for (let i = 0; i < N; i++) {
    dummy = [i, i + 1];
}
t1 = performance.now();
console.log(`[a, b] alloc: ${(t1 - t0).toFixed(1)}ms (${((t1 - t0) / N * 1e6).toFixed(0)} ns/call)`);
