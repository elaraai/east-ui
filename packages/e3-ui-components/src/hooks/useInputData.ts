/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useQuery } from '@tanstack/react-query';
import type { QueryOverrides } from './types.js';
import { datasetGet } from '@elaraai/e3-api-client';
import type { DatasetStatusInfo, RequestOptions } from '@elaraai/e3-api-client';
import { variant } from '@elaraai/east';

export function useInputData(
    apiUrl: string,
    repo: string,
    workspace: string | null,
    inputInfo: DatasetStatusInfo | null,
    requestOptions?: RequestOptions,
    queryOptions?: QueryOverrides
) {
    const isUpToDate = inputInfo?.status.type === 'up-to-date';

    // Extract hash for query key - when hash changes, data changed
    const hash = inputInfo?.hash?.type === 'some' ? inputInfo.hash.value : null;

    return useQuery({
        queryKey: ['inputData', apiUrl, repo, workspace, inputInfo?.path, hash],
        queryFn: () => {
            // Parse path like ".inputs.foo" into path parts
            const pathParts = inputInfo?.path?.split('.')
                ?.filter(Boolean)
                ?.map((value) => variant('field', value)) ?? [];
            return datasetGet(apiUrl, repo, workspace!, pathParts, requestOptions ?? { token: null });
        },
        enabled: !!workspace && !!inputInfo && isUpToDate,
        ...queryOptions,
    });
}
