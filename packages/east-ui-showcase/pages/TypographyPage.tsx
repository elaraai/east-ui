/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { EastFunction } from "@elaraai/east-ui-components";
import textShowcase from "../showcases/typography/text";

// Pre-compile IR at module load time
const textIR = textShowcase.toIR();

export function TypographyPage() {
    return <EastFunction ir={textIR} />;
}
