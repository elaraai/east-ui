/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { EastFunction } from "@elaraai/east-ui-components";
import stateShowcase from "../showcases/platform/state";

// Pre-compile IR at module load time
const stateIR = stateShowcase.toIR();

export function PlatformPage() {
    return <EastFunction ir={stateIR} />;
}
