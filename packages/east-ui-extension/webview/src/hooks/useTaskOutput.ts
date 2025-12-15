/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useQuery } from '@tanstack/react-query';
import { datasetGet } from '@elaraai/e3-api-client';
import type { TaskStatusInfo } from '@elaraai/e3-api-client';

/**
 * Parse output path string to TreePath array.
 * ".tasks.foo.output" -> [{ value: "tasks" }, { value: "foo" }, { value: "output" }]
 */
function parseOutputPath(outputPath: string) {
    return outputPath
        .split('.')
        .filter(Boolean)
        .map((value) => ({ value }));
}

export function useTaskOutput(
    apiUrl: string,
    workspace: string | null,
    task: TaskStatusInfo | null
) {
    const isUpToDate = task?.status.type === 'up-to-date';

    return useQuery({
        queryKey: ['taskOutput', apiUrl, workspace, task?.name],
        queryFn: () => {
            const pathParts = parseOutputPath(task!.output);
            return datasetGet(apiUrl, workspace!, pathParts);
        },
        enabled: !!apiUrl && !!workspace && !!task && isUpToDate,
    });
}
