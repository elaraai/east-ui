/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { EastFunction } from "@elaraai/east-ui-components";
import disclosureShowcase from "../showcases/disclosure/all";

// Pre-compile IR at module load time
const disclosureIR = disclosureShowcase.toIR();

export function DisclosurePage() {
    return <EastFunction ir={disclosureIR} />;
}
