/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { EastFunction } from "@elaraai/east-ui-components";
import reactiveShowcase from "../showcases/reactive/reactive";

// Pre-compile IR at module load time
const reactiveIR = reactiveShowcase.toIR();

export function ReactivePage() {
    return <EastFunction ir={reactiveIR} />;
}
