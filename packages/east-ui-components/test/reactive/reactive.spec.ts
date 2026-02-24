/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { describeEast, Assert } from "../platforms.spec.js";
import { East, IntegerType, StringType, BooleanType, NullType, ArrayType } from "@elaraai/east";
import { Reactive, State, Button, Text, Stat, Stack, UIComponentType } from "@elaraai/east-ui";

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
        const reactive = $.let(Reactive.Root(
            East.function([], UIComponentType, $ => {
                // Use State.has to check, then read
                $.if(State.has("counter"), $ => {
                    const count = $.let(State.read([IntegerType], "counter"));
                    $.return(Stat.Root("Counter", Text.Root(East.str`${count}`)));
                });
                return Stat.Root("Counter", Text.Root("0"));
            })));

        $(Assert.equal(reactive.unwrap().getTag(), "ReactiveComponent"));
    });

    // Test 2: Multiple state reads
    test("creates reactive with multiple state reads", $ => {
        const reactive = $.let(Reactive.Root(
            East.function([], UIComponentType, $ => {
                // Initialize values first
                $(State.write([IntegerType], "keyA", 1n));
                $(State.write([IntegerType], "keyB", 2n));
                $(State.write([StringType], "keyC", "test"));

                const a = $.let(State.read([IntegerType], "keyA"));
                const b = $.let(State.read([IntegerType], "keyB"));
                const c = $.let(State.read([StringType], "keyC"));
                return Text.Root(East.str`${a} ${b} ${c}`);
            })));

        $(Assert.equal(reactive.unwrap().getTag(), "ReactiveComponent"));
    });

    // Test 3: Dynamic/computed key
    test("creates reactive with dynamic computed key", $ => {
        const reactive = $.let(Reactive.Root(
            East.function([], UIComponentType, $ => {
                // Initialize values
                $(State.write([StringType], "currentUser", "alice"));
                $(State.write([StringType], "user_alice", "Alice Smith"));

                const userId = $.let(State.read([StringType], "currentUser"));
                const userData = $.let(State.read(
                    [StringType],
                    East.str`user_${userId}`
                ));
                return Text.Root(userData);
            })));

        $(Assert.equal(reactive.unwrap().getTag(), "ReactiveComponent"));
    });

    // =========================================================================
    // Static Content
    // =========================================================================

    // Test 4: No state reads (static content)
    test("creates reactive with static content (no state reads)", $ => {
        const reactive = $.let(Reactive.Root(
            East.function([], UIComponentType, _$ => {
                return Text.Root("Hello, World!");
            })));

        $(Assert.equal(reactive.unwrap().getTag(), "ReactiveComponent"));
    });

    // =========================================================================
    // Module-Level References (Not Captures)
    // =========================================================================

    // Test 5: Module-level constant
    test("allows module-level constants (not captures)", $ => {
        const reactive = $.let(Reactive.Root(
            East.function([], UIComponentType, $ => {
                $(State.write([IntegerType], "counter", 42n));
                const count = $.let(State.read([IntegerType], "counter"));
                // TITLE is module-level, not a capture
                return Stat.Root(TITLE, Text.Root(East.str`${count}`));
            }))
        );

        $(Assert.equal(reactive.unwrap().getTag(), "ReactiveComponent"));
    });

    // =========================================================================
    // Callbacks Defined Inside
    // =========================================================================

    // Test 7: Callback defined inside
    test("allows callbacks defined inside the body", $ => {
        const reactive = $.let(Reactive.Root(
            East.function([], UIComponentType, $ => {
                $(State.write([IntegerType], "counter", 0n));
                const count = $.let(State.read([IntegerType], "counter"));
                return Button.Root(East.str`Count: ${count}`, {
                    // This callback is defined inside, not captured
                    onClick: East.function([], NullType, $ => {
                        const current = $.let(State.read([IntegerType], "counter"));
                        $(State.write([IntegerType], "counter", current.add(1n)));
                    })
                });
            }))
        );

        $(Assert.equal(reactive.unwrap().getTag(), "ReactiveComponent"));
    });

    // Test 9: State write in onClick
    test("allows state writes in onClick callbacks", $ => {
        const reactive = $.let(Reactive.Root(
            East.function([], UIComponentType, $ => {
                $(State.write([IntegerType], "counter", 0n));
                return Button.Root("Increment", {
                    onClick: East.function([], NullType, $ => {
                        const current = $.let(State.read([IntegerType], "counter"));
                        $(State.write([IntegerType], "counter", current.add(1n)));
                    })
                });
            })));

        $(Assert.equal(reactive.unwrap().getTag(), "ReactiveComponent"));
    });

    // =========================================================================
    // Nested Reactive
    // =========================================================================

    // Test 8: Nested Reactive.Root
    test("allows nested Reactive.Root", $ => {
        const reactive = $.let(Reactive.Root(
            East.function([], UIComponentType, $ => {
                $(State.write([IntegerType], "inner", 99n));
                return Stack.VStack([
                    Text.Root("Header"),
                    // Nested Reactive is fine - it's a new scope
                    Reactive.Root(
                        East.function([], UIComponentType, $ => {
                            const count = $.let(State.read([IntegerType], "inner"));
                            return Text.Root(East.str`${count}`);
                        })
                    ),
                ]);
            })));

        $(Assert.equal(reactive.unwrap().getTag(), "ReactiveComponent"));
    });

    // =========================================================================
    // Conditional Logic
    // =========================================================================

    // Test 10: Conditional state read with has check
    test("allows conditional state reads with has check", $ => {
        const reactive = $.let(Reactive.Root(
            East.function([], UIComponentType, $ => {
                $(State.write([BooleanType], "showDetails", false));
                $(State.write([StringType], "details", "Secret info"));

                const show = $.let(State.read([BooleanType], "showDetails"));
                $.if(show, $ => {
                    const details = $.let(State.read([StringType], "details"));
                    $.return(Text.Root(details));
                }).else($ => {
                    $.return(Text.Root("Hidden"));
                })
            })));

        $(Assert.equal(reactive.unwrap().getTag(), "ReactiveComponent"));
    });

});

// =============================================================================
// Capture Cases - Captures are now allowed in Reactive.Root
// =============================================================================

describeEast("Reactive.Root - Capture Cases", (test) => {

    // =========================================================================
    // Parent Variable Captures
    // =========================================================================

    // Test 11: Capture parent $.let variable
    test("allows capturing parent $.let variable", _$ => {
        // This should not throw - captures are now allowed
        East.function([], UIComponentType, $ => {
            const multiplier = $.let(East.value(2n, IntegerType));

            return Reactive.Root(
                East.function([], UIComponentType, _$ => {
                    // Captures `multiplier` from parent scope
                    return Text.Root(East.str`${multiplier}`);
                })
            );
        });
    });

    // Test 12: Capture parent state read result
    test("allows capturing parent state read result", _$ => {
        // This should not throw - captures are now allowed
        East.function([], UIComponentType, $ => {
            $(State.write([StringType], "config", "test"));
            const config = $.let(State.read([StringType], "config"));

            return Reactive.Root(
                East.function([], UIComponentType, _$ => {
                    // Captures `config` from parent scope
                    return Text.Root(config);
                })
            );
        });
    });

    // Test 13: Capture multiple variables
    test("allows capturing multiple variables", _$ => {
        // This should not throw - captures are now allowed
        East.function([], UIComponentType, $ => {
            const a = $.let(East.value(1n, IntegerType));
            const b = $.let(East.value(2n, IntegerType));
            const c = $.let(East.value(3n, IntegerType));

            return Reactive.Root(
                East.function([], UIComponentType, _$ => {
                    // Captures `a`, `b`, `c` from parent scope
                    return Text.Root(East.str`${a.add(b).add(c)}`);
                })
            );
        });
    });

    // Test 14: Capture in expression
    test("allows capture in arithmetic expression", _$ => {
        // This should not throw - captures are now allowed
        East.function([], UIComponentType, $ => {
            const offset = $.let(East.value(100n, IntegerType));
            return Reactive.Root(
                East.function([], UIComponentType, $ => {
                    $(State.write([IntegerType], "counter", 0n));
                    const count = $.let(State.read([IntegerType], "counter"));
                    // Captures `offset` in arithmetic expression
                    return Stat.Root("Adjusted", Text.Root(East.str`${count.add(offset)}`));
                }));
        });
    });

    // =========================================================================
    // Parameter Captures
    // =========================================================================

    // Test 15: Capture parent parameter
    test("allows capturing parent function parameter", _$ => {
        // This should not throw - captures are now allowed
        East.function([IntegerType], UIComponentType, ($, userId) => {
            return Reactive.Root(
                East.function([], UIComponentType, _$ => {
                    // Captures `userId` parameter from parent function
                    return Text.Root(East.str`User: ${userId}`);
                })
            );
        });
    });

    // =========================================================================
    // Nested Scope Captures
    // =========================================================================

    // Test 16: Capture from grandparent scope
    test("allows capturing from grandparent scope", _$ => {
        // This should not throw - captures are now allowed
        East.function([], UIComponentType, $ => {
            const grandparentVar = $.let(East.value("outer", StringType));

            // This Reactive.Root captures grandparentVar from the outer scope
            return Reactive.Root(
                East.function([], UIComponentType, _$ => {
                    // Captures `grandparentVar` from parent scope
                    return Text.Root(grandparentVar);
                })
            );
        });
    });

    // =========================================================================
    // Collection Captures
    // =========================================================================

    // Test 17: Capture array from parent
    test("allows capturing array from parent", _$ => {
        // This should not throw - captures are now allowed
        East.function([], UIComponentType, $ => {
            const items = $.let(East.value([], ArrayType(StringType)));

            return Reactive.Root(
                East.function([], UIComponentType, _$ => {
                    // Captures `items` array from parent scope
                    return Text.Root(East.str`Count: ${items.size()}`);
                })
            );
        });
    });

    // =========================================================================
    // String Template Captures
    // =========================================================================

    // Test 18: Capture in string template
    test("allows capture in string template", _$ => {
        // This should not throw - captures are now allowed
        East.function([], UIComponentType, $ => {
            const prefix = $.let(East.value("Value: ", StringType));
            return Reactive.Root(
                East.function([], UIComponentType, $ => {
                    $(State.write([IntegerType], "counter", 0n));
                    const count = $.let(State.read([IntegerType], "counter"));
                    // Captures `prefix` in string template
                    return Text.Root(East.str`${prefix}${count}`);
                })
            );
        });
    });

});
