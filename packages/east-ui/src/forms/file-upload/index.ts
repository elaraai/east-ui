/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import {
    type ExprType,
    East,
    variant,
} from "@elaraai/east";

import { UIComponentType } from "../../component.js";
import {
    FileUploadType,
    FileCaptureType,
    type FileUploadStyle,
} from "./types.js";

// Re-export types
export {
    FileUploadType,
    FileCaptureType,
    type FileUploadStyle,
    type FileCaptureLiteral,
} from "./types.js";

// ============================================================================
// FileUpload Factory
// ============================================================================

/**
 * Creates a FileUpload component.
 *
 * @param style - Configuration options for the file upload
 * @returns An East expression representing the FileUpload component
 *
 * @example
 * ```ts
 * import { FileUpload } from "@elaraai/east-ui";
 *
 * // Image upload with drag-and-drop
 * const imageUpload = FileUpload.Root({
 *   accept: "image/*",
 *   maxFiles: 5,
 *   maxFileSize: 5 * 1024 * 1024, // 5MB
 *   label: "Upload images",
 *   dropzoneText: "or drag and drop here",
 *   triggerText: "Choose files",
 * });
 *
 * // Single document upload
 * const docUpload = FileUpload.Root({
 *   accept: ".pdf,.doc,.docx",
 *   maxFiles: 1,
 *   required: true,
 *   label: "Upload document",
 * });
 *
 * // Directory upload
 * const folderUpload = FileUpload.Root({
 *   directory: true,
 *   label: "Upload folder",
 * });
 * ```
 */
function createFileUpload(
    style?: FileUploadStyle
): ExprType<UIComponentType> {
    // Convert number to bigint for IntegerType fields
    const maxFilesValue = style?.maxFiles !== undefined
        ? (typeof style.maxFiles === "number" ? BigInt(style.maxFiles) : style.maxFiles)
        : undefined;
    const maxFileSizeValue = style?.maxFileSize !== undefined
        ? (typeof style.maxFileSize === "number" ? BigInt(style.maxFileSize) : style.maxFileSize)
        : undefined;
    const minFileSizeValue = style?.minFileSize !== undefined
        ? (typeof style.minFileSize === "number" ? BigInt(style.minFileSize) : style.minFileSize)
        : undefined;

    // Convert capture string literal to variant
    const captureValue = style?.capture
        ? (typeof style.capture === "string"
            ? East.value(variant(style.capture, null), FileCaptureType)
            : style.capture)
        : undefined;

    return East.value(variant("FileUpload", {
        accept: style?.accept !== undefined ? variant("some", style.accept) : variant("none", null),
        maxFiles: maxFilesValue !== undefined ? variant("some", maxFilesValue) : variant("none", null),
        maxFileSize: maxFileSizeValue !== undefined ? variant("some", maxFileSizeValue) : variant("none", null),
        minFileSize: minFileSizeValue !== undefined ? variant("some", minFileSizeValue) : variant("none", null),
        directory: style?.directory !== undefined ? variant("some", style.directory) : variant("none", null),
        disabled: style?.disabled !== undefined ? variant("some", style.disabled) : variant("none", null),
        required: style?.required !== undefined ? variant("some", style.required) : variant("none", null),
        allowDrop: style?.allowDrop !== undefined ? variant("some", style.allowDrop) : variant("none", null),
        capture: captureValue ? variant("some", captureValue) : variant("none", null),
        name: style?.name !== undefined ? variant("some", style.name) : variant("none", null),
        label: style?.label !== undefined ? variant("some", style.label) : variant("none", null),
        dropzoneText: style?.dropzoneText !== undefined ? variant("some", style.dropzoneText) : variant("none", null),
        triggerText: style?.triggerText !== undefined ? variant("some", style.triggerText) : variant("none", null),
    }), UIComponentType);
}

// ============================================================================
// FileUpload Namespace Export
// ============================================================================

/**
 * FileUpload component namespace.
 *
 * @remarks
 * FileUpload provides a form control for uploading files with drag-and-drop support.
 *
 * @example
 * ```ts
 * import { FileUpload } from "@elaraai/east-ui";
 *
 * // Basic file upload
 * const upload = FileUpload.Root({
 *   label: "Upload file",
 *   triggerText: "Choose file",
 * });
 *
 * // Image upload with constraints
 * const imageUpload = FileUpload.Root({
 *   accept: "image/*",
 *   maxFiles: 3,
 *   maxFileSize: 10 * 1024 * 1024, // 10MB
 *   label: "Upload images",
 *   dropzoneText: "Drag images here",
 *   triggerText: "Browse",
 * });
 *
 * // Mobile camera capture
 * const cameraUpload = FileUpload.Root({
 *   accept: "image/*",
 *   capture: "environment",
 *   label: "Take photo",
 * });
 * ```
 */
export const FileUpload = {
    /** Creates a FileUpload component */
    Root: createFileUpload,
    /** Type definitions */
    Types: {
        /** FileUpload struct type */
        FileUpload: FileUploadType,
        /** File capture variant type */
        Capture: FileCaptureType,
    },
} as const;
