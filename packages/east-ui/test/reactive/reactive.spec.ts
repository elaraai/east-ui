/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { describeEast, assertEast } from "../platforms.spec.js";
import { East, IntegerType, StringType, BooleanType, NullType, ArrayType, some } from "@elaraai/east";
import { Reactive, State, Button, Text, Stat, Stack, UIComponentType } from "../../src/index.js";

// Module-level constant (NOT a capture - in module scope)
const TITLE = "Counter";

// =============================================================================
// Valid Cases - Using describeEast pattern
// =============================================================================

describeEast("Reactive.Root - Valid Cases", (test) => {

    // =========================================================================
    // Basic State Reads
    // =========================================================================

    // Test 1: Simple state read
    test("creates reactive with simple state read", $ => {
        const reactive = $.let(Reactive.Root($ => {
            const count = $.let(State.readTyped("counter", IntegerType)());
            return Stat.Root("Counter", East.str`${count.unwrap("some")}`);
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

    // Test 2: Multiple state reads
    test("creates reactive with multiple state reads", $ => {
        const reactive = $.let(Reactive.Root($ => {
            const a = $.let(State.readTyped("keyA", IntegerType)());
            const b = $.let(State.readTyped("keyB", IntegerType)());
            const c = $.let(State.readTyped("keyC", StringType)());
            return Text.Root(East.str`${a.unwrap("some")} ${b.unwrap("some")} ${c.unwrap("some")}`);
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

    // Test 3: Dynamic/computed key
    test("creates reactive with dynamic computed key", $ => {
        const reactive = $.let(Reactive.Root($ => {
            const userId = $.let(State.readTyped("currentUser", StringType)());
            const userData = $.let(State.readTyped(
                East.str`user_${userId.unwrap("some")}`,
                StringType
            )());
            return Text.Root(userData.unwrap("some"));
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

    // =========================================================================
    // Static Content
    // =========================================================================

    // Test 4: No state reads (static content)
    test("creates reactive with static content (no state reads)", $ => {
        const reactive = $.let(Reactive.Root(_$ => {
            return Text.Root("Hello, World!");
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

    // =========================================================================
    // Module-Level References (Not Captures)
    // =========================================================================

    // Test 5: Module-level constant
    test("allows module-level constants (not captures)", $ => {
        const reactive = $.let(Reactive.Root($ => {
            const count = $.let(State.readTyped("counter", IntegerType)());
            // TITLE is module-level, not a capture
            return Stat.Root(TITLE, East.str`${count.unwrap("some")}`);
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

    // =========================================================================
    // Callbacks Defined Inside
    // =========================================================================

    // Test 7: Callback defined inside
    test("allows callbacks defined inside the body", $ => {
        const reactive = $.let(Reactive.Root($ => {
            const count = $.let(State.readTyped("counter", IntegerType)());
            return Button.Root(East.str`Count: ${count.unwrap("some")}`, {
                // This callback is defined inside, not captured
                onClick: East.function([], NullType, $ => {
                    const current = $.let(State.readTyped("counter", IntegerType)());
                    $(State.writeTyped("counter", some(current.unwrap("some").add(1n)), IntegerType)());
                })
            });
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

    // Test 9: State write in onClick
    test("allows state writes in onClick callbacks", $ => {
        const reactive = $.let(Reactive.Root(_$ => {
            return Button.Root("Increment", {
                onClick: East.function([], NullType, $ => {
                    const current = $.let(State.readTyped("counter", IntegerType)());
                    $(State.writeTyped("counter", some(current.unwrap("some").add(1n)), IntegerType)());
                })
            });
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

    // =========================================================================
    // Nested Reactive
    // =========================================================================

    // Test 8: Nested Reactive.Root
    test("allows nested Reactive.Root", $ => {
        const reactive = $.let(Reactive.Root(_$ => {
            return Stack.VStack([
                Text.Root("Header"),
                // Nested Reactive is fine - it's a new scope
                Reactive.Root($ => {
                    const count = $.let(State.readTyped("inner", IntegerType)());
                    return Text.Root(East.str`${count.unwrap("some")}`);
                }),
            ]);
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

    // =========================================================================
    // Conditional Logic
    // =========================================================================

    // Test 10: Conditional state read
    test("allows conditional state reads", $ => {
        const reactive = $.let(Reactive.Root($ => {
            $(State.initTyped("showDetails", false, BooleanType)());
            const show = $.let(State.readTyped("showDetails", BooleanType)());
            $.if(show.unwrap("some"), $ => {
                const details = $.let(State.readTyped("details", StringType)());
                $.return(Text.Root(East.str`${details.unwrap("some")}`));
            }).else($ => {
                $.return(Text.Root("Hidden"));
            })
        }));

        $(assertEast.equal(reactive.getTag(), "ReactiveComponent"));
    });

});

// =============================================================================
// Invalid Cases - Using Node.js assert.throws
// =============================================================================

describe("Reactive.Root - Invalid Cases (Capture Validation)", () => {

    // =========================================================================
    // Parent Variable Captures
    // =========================================================================

    // Test 11: Capture parent $.let variable
    it("should throw when capturing parent $.let variable", () => {
        assert.throws(
            () => {
                East.function([], UIComponentType, $ => {
                    const multiplier = $.let(East.value(2n, IntegerType));

                    return Reactive.Root(_$ => {
                        // ERROR: captures `multiplier` from parent scope
                        return Text.Root(East.str`${multiplier}`);
                    });
                });
            },
            {
                message: /Reactive\.Root body must be a free function with no captures/
            }
        );
    });

    // Test 12: Capture parent state read result
    it("should throw when capturing parent state read result", () => {
        assert.throws(
            () => {
                East.function([], UIComponentType, $ => {
                    const config = $.let(State.readTyped("config", StringType)());

                    return Reactive.Root(_$ => {
                        // ERROR: captures `config` from parent scope
                        return Text.Root(config.unwrap("some"));
                    });
                });
            },
            {
                message: /Reactive\.Root body must be a free function with no captures/
            }
        );
    });

    // Test 13: Capture multiple variables
    it("should throw when capturing multiple variables", () => {
        assert.throws(
            () => {
                East.function([], UIComponentType, $ => {
                    const a = $.let(East.value(1n, IntegerType));
                    const b = $.let(East.value(2n, IntegerType));
                    const c = $.let(East.value(3n, IntegerType));

                    return Reactive.Root(_$ => {
                        // ERROR: captures `a`, `b`, `c` from parent scope
                        return Text.Root(East.str`${a.add(b).add(c)}`);
                    });
                });
            },
            {
                message: /Reactive\.Root body must be a free function with no captures/
            }
        );
    });

    // Test 14: Capture in expression
    it("should throw when capture is used in arithmetic expression", () => {
        assert.throws(
            () => {
                East.function([], UIComponentType, $ => {
                    const offset = $.let(East.value(100n, IntegerType));

                    return Reactive.Root($ => {
                        const count = $.let(State.readTyped("counter", IntegerType)());
                        // ERROR: captures `offset` in arithmetic expression
                        return Stat.Root("Adjusted", East.str`${count.unwrap("some").add(offset)}`);
                    });
                });
            },
            {
                message: /Reactive\.Root body must be a free function with no captures/
            }
        );
    });

    // =========================================================================
    // Parameter Captures
    // =========================================================================

    // Test 15: Capture parent parameter
    it("should throw when capturing parent function parameter", () => {
        assert.throws(
            () => {
                // Function with a parameter
                East.function([IntegerType], UIComponentType, ($, userId) => {
                    return Reactive.Root(_$ => {
                        // ERROR: captures `userId` parameter from parent function
                        return Text.Root(East.str`User: ${userId}`);
                    });
                });
            },
            {
                message: /Reactive\.Root body must be a free function with no captures/
            }
        );
    });

    // =========================================================================
    // Nested Scope Captures
    // =========================================================================

    // Test 16: Capture from grandparent scope
    it("should throw when capturing from grandparent scope", () => {
        assert.throws(
            () => {
                East.function([], UIComponentType, $ => {
                    const grandparentVar = $.let(East.value("outer", StringType));

                    // This Reactive.Root captures grandparentVar from the outer scope
                    return Reactive.Root(_$ => {
                        // ERROR: captures `grandparentVar` from parent scope
                        return Text.Root(grandparentVar);
                    });
                });
            },
            {
                message: /Reactive\.Root body must be a free function with no captures/
            }
        );
    });

    // =========================================================================
    // Collection Captures
    // =========================================================================

    // Test 17: Capture array from parent
    it("should throw when capturing array from parent", () => {
        assert.throws(
            () => {
                East.function([], UIComponentType, $ => {
                    const items = $.let(East.value([], ArrayType(StringType)));

                    return Reactive.Root(_$ => {
                        // ERROR: captures `items` array from parent scope
                        return Text.Root(East.str`Count: ${items.size()}`);
                    });
                });
            },
            {
                message: /Reactive\.Root body must be a free function with no captures/
            }
        );
    });

    // =========================================================================
    // String Template Captures
    // =========================================================================

    // Test 18: Capture in string template
    it("should throw when capture is used in string template", () => {
        assert.throws(
            () => {
                East.function([], UIComponentType, $ => {
                    const prefix = $.let(East.value("Value: ", StringType));

                    return Reactive.Root($ => {
                        const count = $.let(State.readTyped("counter", IntegerType)());
                        // ERROR: captures `prefix` in string template
                        return Text.Root(East.str`${prefix}${count.unwrap("some")}`);
                    });
                });
            },
            {
                message: /Reactive\.Root body must be a free function with no captures/
            }
        );
    });

});
