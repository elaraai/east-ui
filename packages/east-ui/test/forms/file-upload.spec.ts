/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, assertEast } from "../platforms.spec.js";
import { FileUpload } from "../../src/index.js";

describeEast("FileUpload", (test) => {
    // =========================================================================
    // Basic Creation
    // =========================================================================

    test("creates file upload with no options", $ => {
        const upload = $.let(FileUpload.Root());

        $(assertEast.equal(upload.getTag(), "FileUpload"));
        $(assertEast.equal(upload.unwrap("FileUpload").accept.hasTag("none"), true));
        $(assertEast.equal(upload.unwrap("FileUpload").maxFiles.hasTag("none"), true));
    });

    test("creates file upload with label", $ => {
        const upload = $.let(FileUpload.Root({
            label: "Upload file",
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").label.hasTag("some"), true));
        $(assertEast.equal(upload.unwrap("FileUpload").label.unwrap("some"), "Upload file"));
    });

    test("creates file upload with trigger text", $ => {
        const upload = $.let(FileUpload.Root({
            triggerText: "Choose file",
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").triggerText.unwrap("some"), "Choose file"));
    });

    test("creates file upload with dropzone text", $ => {
        const upload = $.let(FileUpload.Root({
            dropzoneText: "or drag and drop here",
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").dropzoneText.unwrap("some"), "or drag and drop here"));
    });

    // =========================================================================
    // Accept Patterns
    // =========================================================================

    test("creates file upload with image accept pattern", $ => {
        const upload = $.let(FileUpload.Root({
            accept: "image/*",
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").accept.hasTag("some"), true));
        $(assertEast.equal(upload.unwrap("FileUpload").accept.unwrap("some"), "image/*"));
    });

    test("creates file upload with specific extensions", $ => {
        const upload = $.let(FileUpload.Root({
            accept: ".pdf,.doc,.docx",
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").accept.unwrap("some"), ".pdf,.doc,.docx"));
    });

    test("creates file upload with video accept pattern", $ => {
        const upload = $.let(FileUpload.Root({
            accept: "video/*",
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").accept.unwrap("some"), "video/*"));
    });

    // =========================================================================
    // File Constraints
    // =========================================================================

    test("creates file upload with maxFiles", $ => {
        const upload = $.let(FileUpload.Root({
            maxFiles: 5,
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").maxFiles.hasTag("some"), true));
        $(assertEast.equal(upload.unwrap("FileUpload").maxFiles.unwrap("some"), 5n));
    });

    test("creates file upload with maxFileSize", $ => {
        const upload = $.let(FileUpload.Root({
            maxFileSize: 5 * 1024 * 1024, // 5MB
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").maxFileSize.hasTag("some"), true));
        $(assertEast.equal(upload.unwrap("FileUpload").maxFileSize.unwrap("some"), 5242880n));
    });

    test("creates file upload with minFileSize", $ => {
        const upload = $.let(FileUpload.Root({
            minFileSize: 1024, // 1KB
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").minFileSize.unwrap("some"), 1024n));
    });

    test("creates file upload with all size constraints", $ => {
        const upload = $.let(FileUpload.Root({
            maxFiles: 3,
            maxFileSize: 10 * 1024 * 1024,
            minFileSize: 100,
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").maxFiles.unwrap("some"), 3n));
        $(assertEast.equal(upload.unwrap("FileUpload").maxFileSize.unwrap("some"), 10485760n));
        $(assertEast.equal(upload.unwrap("FileUpload").minFileSize.unwrap("some"), 100n));
    });

    // =========================================================================
    // Behavior Options
    // =========================================================================

    test("creates file upload with directory enabled", $ => {
        const upload = $.let(FileUpload.Root({
            directory: true,
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").directory.hasTag("some"), true));
        $(assertEast.equal(upload.unwrap("FileUpload").directory.unwrap("some"), true));
    });

    test("creates file upload disabled", $ => {
        const upload = $.let(FileUpload.Root({
            disabled: true,
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").disabled.unwrap("some"), true));
    });

    test("creates required file upload", $ => {
        const upload = $.let(FileUpload.Root({
            required: true,
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").required.unwrap("some"), true));
    });

    test("creates file upload with allowDrop disabled", $ => {
        const upload = $.let(FileUpload.Root({
            allowDrop: false,
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").allowDrop.unwrap("some"), false));
    });

    test("creates file upload with name", $ => {
        const upload = $.let(FileUpload.Root({
            name: "document",
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").name.unwrap("some"), "document"));
    });

    // =========================================================================
    // Capture Mode
    // =========================================================================

    test("creates file upload with user camera capture", $ => {
        const upload = $.let(FileUpload.Root({
            capture: "user",
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").capture.hasTag("some"), true));
        $(assertEast.equal(upload.unwrap("FileUpload").capture.unwrap("some").hasTag("user"), true));
    });

    test("creates file upload with environment camera capture", $ => {
        const upload = $.let(FileUpload.Root({
            capture: "environment",
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").capture.unwrap("some").hasTag("environment"), true));
    });

    // =========================================================================
    // Practical Examples
    // =========================================================================

    test("creates image upload with drag-and-drop", $ => {
        const upload = $.let(FileUpload.Root({
            accept: "image/*",
            maxFiles: 5,
            maxFileSize: 5 * 1024 * 1024,
            label: "Upload images",
            dropzoneText: "or drag and drop here",
            triggerText: "Choose files",
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").accept.unwrap("some"), "image/*"));
        $(assertEast.equal(upload.unwrap("FileUpload").maxFiles.unwrap("some"), 5n));
        $(assertEast.equal(upload.unwrap("FileUpload").label.unwrap("some"), "Upload images"));
        $(assertEast.equal(upload.unwrap("FileUpload").dropzoneText.unwrap("some"), "or drag and drop here"));
        $(assertEast.equal(upload.unwrap("FileUpload").triggerText.unwrap("some"), "Choose files"));
    });

    test("creates single document upload", $ => {
        const upload = $.let(FileUpload.Root({
            accept: ".pdf",
            maxFiles: 1,
            required: true,
            label: "Upload document",
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").accept.unwrap("some"), ".pdf"));
        $(assertEast.equal(upload.unwrap("FileUpload").maxFiles.unwrap("some"), 1n));
        $(assertEast.equal(upload.unwrap("FileUpload").required.unwrap("some"), true));
    });

    test("creates folder upload", $ => {
        const upload = $.let(FileUpload.Root({
            directory: true,
            label: "Upload folder",
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").directory.unwrap("some"), true));
        $(assertEast.equal(upload.unwrap("FileUpload").label.unwrap("some"), "Upload folder"));
    });

    test("creates mobile camera capture upload", $ => {
        const upload = $.let(FileUpload.Root({
            accept: "image/*",
            capture: "environment",
            maxFiles: 1,
            label: "Take photo",
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").accept.unwrap("some"), "image/*"));
        $(assertEast.equal(upload.unwrap("FileUpload").capture.unwrap("some").hasTag("environment"), true));
        $(assertEast.equal(upload.unwrap("FileUpload").label.unwrap("some"), "Take photo"));
    });

    test("creates bulk file upload", $ => {
        const upload = $.let(FileUpload.Root({
            maxFiles: 100,
            maxFileSize: 50 * 1024 * 1024, // 50MB
            label: "Upload files",
            dropzoneText: "Drop files here or click to browse",
            triggerText: "Select files",
            allowDrop: true,
        }));

        $(assertEast.equal(upload.unwrap("FileUpload").maxFiles.unwrap("some"), 100n));
        $(assertEast.equal(upload.unwrap("FileUpload").maxFileSize.unwrap("some"), 52428800n));
        $(assertEast.equal(upload.unwrap("FileUpload").allowDrop.unwrap("some"), true));
    });
});
