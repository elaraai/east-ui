/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */
import { match, type option } from "@elaraai/east";


export const getSomeorUndefined = <T,>(opt: option<T>): T | undefined => {
    return match(opt, {
        some: (value) => value,
    }, undefined);
};