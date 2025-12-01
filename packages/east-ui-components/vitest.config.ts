/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "node",
        include: ["src/**/*.test.{ts,tsx}"],
        coverage: {
            provider: "v8",
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["src/**/*.test.{ts,tsx}", "src/**/index.ts"],
        },
    },
    define: {
        "process.env": {},
        "process.argv": "[]",
    },
});
