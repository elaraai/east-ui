/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { EastFunction } from "@elaraai/east-ui-components";
import containerShowcase from "../showcases/container/all";

// Pre-compile IR at module load time
const containerIR = containerShowcase.toIR();

export function ContainerPage() {
    return <EastFunction ir={containerIR} />;
}
