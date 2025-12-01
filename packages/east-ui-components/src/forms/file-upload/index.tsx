/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { memo, useMemo } from "react";
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

/**
 * Renders an East UI FileUpload value using Chakra UI FileUpload component.
 */
export const EastChakraFileUpload = memo(function EastChakraFileUpload({ value }: EastChakraFileUploadProps) {
    const props = useMemo(() => toChakraFileUpload(value), [value]);
    const label = useMemo(() => getSomeorUndefined(value.label), [value.label]);
    const dropzoneText = useMemo(() => getSomeorUndefined(value.dropzoneText), [value.dropzoneText]);
    const triggerText = useMemo(() => getSomeorUndefined(value.triggerText), [value.triggerText]);

    return (
        <ChakraFileUpload.Root {...props}>
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
