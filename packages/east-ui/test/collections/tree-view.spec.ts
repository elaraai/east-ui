/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { TreeView } from "../../src/collections/tree-view/index.js";
import { describeEast as describe, assertEast } from "../platforms.spec.js";

describe("TreeView", (test) => {
    // =========================================================================
    // TreeView.Item - Basic
    // =========================================================================

    test("creates item without indicator", $ => {
        const item = $.let(TreeView.Item("file1", "index.ts"));

        $(assertEast.equal(item.unwrap("Item").value, "file1"));
        $(assertEast.equal(item.unwrap("Item").label, "index.ts"));
        $(assertEast.equal(item.unwrap("Item").indicator.hasTag("none"), true));
    });

    test("creates item with indicator", $ => {
        const item = $.let(TreeView.Item("readme", "README.md", { prefix: "far", name: "file" }));

        $(assertEast.equal(item.unwrap("Item").value, "readme"));
        $(assertEast.equal(item.unwrap("Item").indicator.hasTag("some"), true));
        $(assertEast.equal(item.unwrap("Item").indicator.unwrap("some").name, "file"));
        $(assertEast.equal(item.unwrap("Item").indicator.unwrap("some").prefix, "far"));
    });

    test("creates item with colored indicator", $ => {
        const item = $.let(TreeView.Item("index", "index.ts", { prefix: "fas", name: "file-code", color: "blue.500" }));

        $(assertEast.equal(item.unwrap("Item").indicator.unwrap("some").name, "file-code"));
        $(assertEast.equal(item.unwrap("Item").indicator.unwrap("some").style.unwrap("some").color.unwrap("some"), "blue.500"));
    });

    // =========================================================================
    // TreeView.Branch - Basic
    // =========================================================================

    test("creates branch with children", $ => {
        const branch = $.let(TreeView.Branch("src", "src", [
            TreeView.Item("file1", "index.ts"),
            TreeView.Item("file2", "utils.ts"),
        ]));

        $(assertEast.equal(branch.unwrap("Branch").value, "src"));
        $(assertEast.equal(branch.unwrap("Branch").label, "src"));
        $(assertEast.equal(branch.unwrap("Branch").indicator.hasTag("none"), true));
    });

    test("creates branch with indicator", $ => {
        const branch = $.let(TreeView.Branch("src", "src", [
            TreeView.Item("file1", "index.ts"),
        ], { prefix: "fas", name: "folder" }));

        $(assertEast.equal(branch.unwrap("Branch").indicator.hasTag("some"), true));
        $(assertEast.equal(branch.unwrap("Branch").indicator.unwrap("some").name, "folder"));
        $(assertEast.equal(branch.unwrap("Branch").indicator.unwrap("some").prefix, "fas"));
    });

    test("creates branch with colored indicator", $ => {
        const branch = $.let(TreeView.Branch("src", "src", [
            TreeView.Item("file1", "index.ts"),
        ], { prefix: "fas", name: "folder", color: "yellow.500" }));

        $(assertEast.equal(branch.unwrap("Branch").indicator.unwrap("some").style.unwrap("some").color.unwrap("some"), "yellow.500"));
    });

    test("creates disabled branch", $ => {
        const branch = $.let(TreeView.Branch("src", "src", [
            TreeView.Item("file1", "index.ts"),
        ], undefined, true));

        $(assertEast.equal(branch.unwrap("Branch").disabled.unwrap("some"), true));
    });

    // =========================================================================
    // TreeView.Branch - Nested
    // =========================================================================

    test("creates nested branches", $ => {
        const tree = $.let(TreeView.Branch("src", "src", [
            TreeView.Branch("components", "components", [
                TreeView.Item("button", "Button.tsx"),
            ]),
            TreeView.Item("index", "index.ts"),
        ]));

        $(assertEast.equal(tree.unwrap("Branch").value, "src"));
    });

    // =========================================================================
    // TreeView.Root - Basic
    // =========================================================================

    test("creates tree view with items", $ => {
        const tree = $.let(TreeView.Root([
            TreeView.Item("file1", "index.ts"),
            TreeView.Item("file2", "utils.ts"),
        ]));

        $(assertEast.equal(tree.unwrap("TreeView").label.hasTag("none"), true));
    });

    test("creates tree view with branches and items", $ => {
        const tree = $.let(TreeView.Root([
            TreeView.Branch("src", "src", [
                TreeView.Item("index", "index.ts"),
            ]),
            TreeView.Item("package", "package.json"),
        ]));

        $(assertEast.equal(tree.unwrap("TreeView").label.hasTag("none"), true));
    });

    test("creates tree view with label", $ => {
        const tree = $.let(TreeView.Root([
            TreeView.Item("file1", "index.ts"),
        ], {
            label: "Project Files",
        }));

        $(assertEast.equal(tree.unwrap("TreeView").label.unwrap("some"), "Project Files"));
    });

    // =========================================================================
    // TreeView.Root - Styling
    // =========================================================================

    test("creates tree view with subtle variant", $ => {
        const tree = $.let(TreeView.Root([
            TreeView.Item("file1", "index.ts"),
        ], {
            variant: "subtle",
        }));

        $(assertEast.equal(tree.unwrap("TreeView").style.unwrap("some").variant.unwrap("some").hasTag("subtle"), true));
    });

    test("creates tree view with solid variant", $ => {
        const tree = $.let(TreeView.Root([
            TreeView.Item("file1", "index.ts"),
        ], {
            variant: "solid",
        }));

        $(assertEast.equal(tree.unwrap("TreeView").style.unwrap("some").variant.unwrap("some").hasTag("solid"), true));
    });

    test("creates tree view with sm size", $ => {
        const tree = $.let(TreeView.Root([
            TreeView.Item("file1", "index.ts"),
        ], {
            size: "sm",
        }));

        $(assertEast.equal(tree.unwrap("TreeView").style.unwrap("some").size.unwrap("some").hasTag("sm"), true));
    });

    test("creates tree view with single selection mode", $ => {
        const tree = $.let(TreeView.Root([
            TreeView.Item("file1", "index.ts"),
        ], {
            selectionMode: "single",
        }));

        $(assertEast.equal(tree.unwrap("TreeView").style.unwrap("some").selectionMode.unwrap("some").hasTag("single"), true));
    });

    test("creates tree view with multiple selection mode", $ => {
        const tree = $.let(TreeView.Root([
            TreeView.Item("file1", "index.ts"),
        ], {
            selectionMode: "multiple",
        }));

        $(assertEast.equal(tree.unwrap("TreeView").style.unwrap("some").selectionMode.unwrap("some").hasTag("multiple"), true));
    });

    // =========================================================================
    // TreeView.Root - Default Values
    // =========================================================================

    test("creates tree view with default expanded values", $ => {
        const tree = $.let(TreeView.Root([
            TreeView.Branch("src", "src", [
                TreeView.Item("file1", "index.ts"),
            ]),
        ], {
            defaultExpandedValue: ["src"],
        }));

        $(assertEast.equal(tree.unwrap("TreeView").defaultExpandedValue.hasTag("some"), true));
    });

    test("creates tree view with default selected values", $ => {
        const tree = $.let(TreeView.Root([
            TreeView.Item("file1", "index.ts"),
            TreeView.Item("file2", "utils.ts"),
        ], {
            defaultSelectedValue: ["file1"],
        }));

        $(assertEast.equal(tree.unwrap("TreeView").defaultSelectedValue.hasTag("some"), true));
    });

    // =========================================================================
    // TreeView - Complete File Explorer Example
    // =========================================================================

    test("creates complete file explorer with indicators", $ => {
        const tree = $.let(TreeView.Root([
            TreeView.Branch("src", "src", [
                TreeView.Branch("components", "components", [
                    TreeView.Item("button", "Button.tsx", { prefix: "fas", name: "file-code", color: "blue.500" }),
                    TreeView.Item("input", "Input.tsx", { prefix: "fas", name: "file-code", color: "blue.500" }),
                ], { prefix: "fas", name: "folder", color: "yellow.500" }),
                TreeView.Item("index", "index.ts", { prefix: "fas", name: "file-code", color: "blue.500" }),
            ], { prefix: "fas", name: "folder", color: "yellow.500" }),
            TreeView.Item("package", "package.json", { prefix: "far", name: "file" }),
            TreeView.Item("readme", "README.md", { prefix: "far", name: "file" }),
        ], {
            label: "Project",
            variant: "subtle",
            size: "sm",
            defaultExpandedValue: ["src", "components"],
        }));

        $(assertEast.equal(tree.unwrap("TreeView").label.unwrap("some"), "Project"));
        $(assertEast.equal(tree.unwrap("TreeView").style.unwrap("some").variant.unwrap("some").hasTag("subtle"), true));
        $(assertEast.equal(tree.unwrap("TreeView").style.unwrap("some").size.unwrap("some").hasTag("sm"), true));
    });
});
