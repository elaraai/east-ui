/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { EastFunction } from "@elaraai/east-ui-components";
import collectionsShowcase from "../showcases/collections/all";

// Pre-compile IR at module load time
const collectionsIR = collectionsShowcase.toIR();

export function CollectionsPage() {
    return <EastFunction ir={collectionsIR} />;
}
