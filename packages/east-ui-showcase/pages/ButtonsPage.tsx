/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { EastFunction } from "@elaraai/east-ui-components";
import buttonShowcase from "../showcases/buttons/button";

// Pre-compile IR at module load time
const buttonIR = buttonShowcase.toIR();

export function ButtonsPage() {
    return <EastFunction ir={buttonIR} />;
}
