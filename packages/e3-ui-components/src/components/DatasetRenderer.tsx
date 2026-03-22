/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useState } from 'react';
import { Box, Text, Button, Flex } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import {
    EastStoreProvider,
    createEastStore,
    EastChakraComponent,
} from '@elaraai/east-ui-components';
import type { RequestOptions } from '@elaraai/e3-api-client';
import { useDatasetPreview, useDatasetDownload, type DatasetPreviewState } from '../hooks/useDatasetPreview.js';
import { StatusDisplay } from './StatusDisplay.js';
import { EastValueViewer } from './EastValueViewer.js';
import { ErrorBoundary } from './ErrorBoundary.js';
import { formatApiError, formatError } from '../errors.js';

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function DownloadButton({ onClick, label }: { onClick: () => void; label?: string }) {
    const [downloading, setDownloading] = useState(false);

    const handleClick = async () => {
        setDownloading(true);
        try {
            await onClick();
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Button
            size="sm"
            variant="outline"
            onClick={handleClick}
            loading={downloading}
            loadingText="Downloading..."
        >
            <FontAwesomeIcon icon={faDownload} />
            {label ?? 'Download'}
        </Button>
    );
}

// ── Pure render component ───────────────────────────────────────────

export interface DatasetContentProps {
    preview: DatasetPreviewState;
    download: () => Promise<void>;
    datasetPath: string;
}

export function DatasetContent({ preview, download, datasetPath }: DatasetContentProps) {
    const store = useMemo(() => createEastStore(), [
        // eslint-disable-next-line react-hooks/exhaustive-deps
        preview.state === 'ui' ? preview.component : null,
    ]);

    switch (preview.state) {
        case 'loading':
            return <StatusDisplay variant="loading" title="Loading..." />;

        case 'error': {
            const { message, details } = formatApiError(preview.error);
            return <StatusDisplay variant="error" title="Error" message={message} details={details ?? formatError(preview.error)} />;
        }

        case 'unassigned':
            return <StatusDisplay variant="info" title="No data available" message="Waiting for a value to be set" />;

        case 'ui':
            return (
                <EastStoreProvider store={store}>
                    <ErrorBoundary>
                        <Box height="100%" overflow="auto" p="4">
                            <EastChakraComponent value={preview.component} storageKey={datasetPath} />
                        </Box>
                    </ErrorBoundary>
                </EastStoreProvider>
            );

        case 'value':
            return (
                <Flex direction="column" height="100%" overflow="hidden">
                    <Flex px={4} py={2} justify="flex-end" flexShrink={0} borderBottom="1px solid" borderColor="gray.100">
                        {preview.status.sizeBytes != null && (
                            <Text fontSize="xs" color="gray.500" mr={2} alignSelf="center">
                                {formatSize(preview.status.sizeBytes)}
                            </Text>
                        )}
                        <DownloadButton onClick={download} />
                    </Flex>
                    <Box flex={1} overflow="auto" p="4" minHeight={0}>
                        <EastValueViewer type={preview.status.type} value={preview.decoded} />
                    </Box>
                </Flex>
            );

        case 'oversized':
            return (
                <Flex
                    height="100%"
                    direction="column"
                    align="center"
                    justify="center"
                    bg="yellow.50"
                    gap={3}
                    p={6}
                >
                    <Text fontSize="lg" color="yellow.700" fontWeight="bold">
                        Value too large to display
                    </Text>
                    <Text color="yellow.600" fontSize="sm">
                        {preview.status.sizeBytes != null
                            ? `The data is ${formatSize(preview.status.sizeBytes)}, which exceeds the 200 KB display limit.`
                            : 'The data exceeds the 200 KB display limit.'}
                    </Text>
                    <DownloadButton onClick={download} label="Download value" />
                </Flex>
            );
    }
}

// ── Convenience wrapper (calls hook internally) ─────────────────────

export interface DatasetRendererProps {
    apiUrl: string;
    repo: string;
    workspace: string;
    datasetPath: string;
    requestOptions?: RequestOptions;
    pollInterval?: number;
}

export const DatasetRenderer = memo(function DatasetRenderer({
    apiUrl,
    repo,
    workspace,
    datasetPath,
    requestOptions,
    pollInterval,
}: DatasetRendererProps) {
    const preview = useDatasetPreview(apiUrl, repo, workspace, datasetPath, {
        ...(requestOptions != null && { requestOptions }),
        ...(pollInterval != null && { pollInterval }),
    });

    const download = useDatasetDownload(apiUrl, repo, workspace, datasetPath, requestOptions);

    return (
        <Box height="100%" overflow="hidden" minHeight={0}>
            <DatasetContent preview={preview} download={download} datasetPath={datasetPath} />
        </Box>
    );
}, (prev, next) =>
    prev.datasetPath === next.datasetPath &&
    prev.workspace === next.workspace &&
    prev.repo === next.repo &&
    prev.apiUrl === next.apiUrl
);
