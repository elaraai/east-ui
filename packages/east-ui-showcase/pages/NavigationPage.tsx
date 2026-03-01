/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { EastFunction } from "@elaraai/east-ui-components";
import navigationShowcase from "../showcases/navigation/all";

// Pre-compile IR at module load time
const navigationIR = navigationShowcase.toIR();

export function NavigationPage() {
    return <EastFunction ir={navigationIR} />;
}
