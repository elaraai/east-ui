/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { EastFunction } from "@elaraai/east-ui-components";
import layoutShowcase from "../showcases/layout/all";

// Pre-compile IR at module load time
const layoutIR = layoutShowcase.toIR();

export function LayoutPage() {
    return <EastFunction ir={layoutIR} />;
}
