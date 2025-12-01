/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { EastFunction } from "@elaraai/east-ui-components";
import displayShowcase from "../showcases/display/all";

// Pre-compile IR at module load time
const displayIR = displayShowcase.toIR();

export function DisplayPage() {
    return <EastFunction ir={displayIR} />;
}
