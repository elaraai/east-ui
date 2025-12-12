/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { memo, useMemo, useCallback } from "react";
import { FileUpload as ChakraFileUpload, type FileUploadRootProps } from "@chakra-ui/react";
import { equalFor, type ValueTypeOf } from "@elaraai/east";
import { FileUpload } from "@elaraai/east-ui";
import { getSomeorUndefined } from "../../utils";

// Pre-define equality function at module level
const fileUploadEqual = equalFor(FileUpload.Types.FileUpload);

/** East FileUpload value type */
export type FileUploadValue = ValueTypeOf<typeof FileUpload.Types.FileUpload>;

/**
 * Converts an East UI FileUpload value to Chakra UI FileUpload props.
 * Pure function - easy to test independently.
 */
export function toChakraFileUpload(value: FileUploadValue): FileUploadRootProps {
    const maxFiles = getSomeorUndefined(value.maxFiles);
    const maxFileSize = getSomeorUndefined(value.maxFileSize);
    const minFileSize = getSomeorUndefined(value.minFileSize);

    return {
        accept: getSomeorUndefined(value.accept),
        maxFiles: maxFiles !== undefined ? Number(maxFiles) : undefined,
        maxFileSize: maxFileSize !== undefined ? Number(maxFileSize) : undefined,
        minFileSize: minFileSize !== undefined ? Number(minFileSize) : undefined,
        directory: getSomeorUndefined(value.directory),
        disabled: getSomeorUndefined(value.disabled),
        required: getSomeorUndefined(value.required),
        allowDrop: getSomeorUndefined(value.allowDrop),
        capture: getSomeorUndefined(value.capture)?.type,
        name: getSomeorUndefined(value.name),
    };
}

export interface EastChakraFileUploadProps {
    value: FileUploadValue;
}

/** File info type for callbacks */
interface FileInfo {
    name: string;
    size: bigint;
    type: string;
}

/** File rejection type for callbacks */
interface FileRejection {
    file: FileInfo;
    errors: string[];
}

/**
 * Renders an East UI FileUpload value using Chakra UI FileUpload component.
 */
export const EastChakraFileUpload = memo(function EastChakraFileUpload({ value }: EastChakraFileUploadProps) {
    const props = useMemo(() => toChakraFileUpload(value), [value]);
    const label = useMemo(() => getSomeorUndefined(value.label), [value.label]);
    const dropzoneText = useMemo(() => getSomeorUndefined(value.dropzoneText), [value.dropzoneText]);
    const triggerText = useMemo(() => getSomeorUndefined(value.triggerText), [value.triggerText]);
    const onFileAcceptFn = useMemo(() => getSomeorUndefined(value.onFileAccept), [value.onFileAccept]);
    const onFileRejectFn = useMemo(() => getSomeorUndefined(value.onFileReject), [value.onFileReject]);

    const handleFileAccept = useCallback((details: { files: File[] }) => {
        if (onFileAcceptFn) {
            const fileInfos: FileInfo[] = details.files.map(f => ({
                name: f.name,
                size: BigInt(f.size),
                type: f.type,
            }));
            queueMicrotask(() => onFileAcceptFn(fileInfos));
        }
    }, [onFileAcceptFn]);

    const handleFileReject = useCallback((details: { files: { file: File; errors: string[] }[] }) => {
        if (onFileRejectFn) {
            const rejections: FileRejection[] = details.files.map(r => ({
                file: {
                    name: r.file.name,
                    size: BigInt(r.file.size),
                    type: r.file.type,
                },
                errors: r.errors.map(e => String(e)),
            }));
            queueMicrotask(() => onFileRejectFn(rejections));
        }
    }, [onFileRejectFn]);

    return (
        <ChakraFileUpload.Root
            {...props}
            onFileAccept={onFileAcceptFn ? handleFileAccept : undefined}
            onFileReject={onFileRejectFn ? handleFileReject : undefined}
        >
            {label && <ChakraFileUpload.Label>{label}</ChakraFileUpload.Label>}
            <ChakraFileUpload.Dropzone>
                <ChakraFileUpload.DropzoneContent>
                    <ChakraFileUpload.Trigger>
                        {triggerText ?? "Choose files"}
                    </ChakraFileUpload.Trigger>
                    {dropzoneText && <span>{dropzoneText}</span>}
                </ChakraFileUpload.DropzoneContent>
            </ChakraFileUpload.Dropzone>
            <ChakraFileUpload.ItemGroup>
                <ChakraFileUpload.Context>
                    {({ acceptedFiles }) => acceptedFiles.map((file) => (
                        <ChakraFileUpload.Item key={file.name} file={file}>
                            <ChakraFileUpload.ItemName />
                            <ChakraFileUpload.ItemSizeText />
                            <ChakraFileUpload.ItemDeleteTrigger />
                        </ChakraFileUpload.Item>
                    ))}
                </ChakraFileUpload.Context>
            </ChakraFileUpload.ItemGroup>
            <ChakraFileUpload.HiddenInput />
        </ChakraFileUpload.Root>
    );
}, (prev, next) => fileUploadEqual(prev.value, next.value));
