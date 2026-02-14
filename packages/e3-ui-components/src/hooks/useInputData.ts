/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useQuery } from '@tanstack/react-query';
import { datasetGet } from '@elaraai/e3-api-client';
import type { DatasetStatusInfo } from '@elaraai/e3-api-client';
import { variant } from '@elaraai/east';

export function useInputData(
    apiUrl: string,
    workspace: string | null,
    inputInfo: DatasetStatusInfo | null
) {
    const isUpToDate = inputInfo?.status.type === 'up-to-date';

    // Extract hash for query key - when hash changes, data changed
    const hash = inputInfo?.hash?.type === 'some' ? inputInfo.hash.value : null;

    return useQuery({
        queryKey: ['inputData', apiUrl, workspace, inputInfo?.path, hash],
        queryFn: () => {
            // Parse path like ".inputs.foo" into path parts
            const pathParts = inputInfo?.path?.split('.')
                ?.filter(Boolean)
                ?.map((value) => variant('field', value)) ?? [];
            // for now, we use an empty token
            return datasetGet(apiUrl, 'default', workspace!, pathParts, { token: ''});
        },
        enabled: !!apiUrl && !!workspace && !!inputInfo && isUpToDate,
    });
}
