/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Licensed under AGPL-3.0. See LICENSE file for details.
 */

import { useMemo } from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { East, IntegerType, DictType, StringType, BlobType, encodeBeast2For, decodeBeast2For } from "@elaraai/east";
import { Text as EastText, UIComponentType } from "@elaraai/east-ui";
import {
    createEastStore,
    EastStoreProvider,
    EastFunction,
    useEastStore,
} from "@elaraai/east-ui-components";

// Beast2 encoder/decoder for integers (used for initial state and writes from React)
const encodeInteger = encodeBeast2For(IntegerType);
const decodeInteger = decodeBeast2For(IntegerType);

/**
 * An East function that reads count from state and returns a Text component.
 */
const counterDisplay = East.function(
    [DictType(StringType, BlobType)],
    UIComponentType,
    ($, state) => {
        // Read count from state dict
        const countBlob = state.get("count");
        // Decode the Beast2 blob to an integer
        const count = countBlob.decodeBeast(IntegerType, "v2");

        // Return a Text component showing the count
        return EastText.Root(East.str`Count: ${count}`);
    }
);


/**
 * Button to increment the counter from React.
 */
function IncrementButton() {
    const store = useEastStore();

    const handleClick = () => {
        // Read current value, increment, write back
        const currentBlob = store.read("count");
        const current = currentBlob.length > 0 ? decodeInteger(currentBlob) : 0n;
        store.write("count", encodeInteger(current + 1n));
    };

    return (
        <Button colorScheme="blue" onClick={handleClick}>
            Increment
        </Button>
    );
}

/**
 * Button to reset the counter.
 */
function ResetButton() {
    const store = useEastStore();

    const handleClick = () => {
        store.write("count", encodeInteger(0n));
    };

    return (
        <Button colorScheme="gray" onClick={handleClick}>
            Reset
        </Button>
    );
}

// Pre-compute the IR once at module level
const counterDisplayIR = counterDisplay.toIR();

/**
 * State management showcase component.
 */
export function StateShowcase() {
    // Create store with initial state (no manual registration needed)
    const store = useMemo(() => {
        return createEastStore({
            count: encodeInteger(0n),
        });
    }, []);

    return (
        <EastStoreProvider store={store}>
            <VStack align="stretch" gap={4}>
                <Box
                    p={4}
                    bg="white"
                    _dark={{ bg: "gray.800" }}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="gray.200"
                >
                    <Text fontWeight="semibold" mb={1}>
                        Reactive Counter
                    </Text>
                    <Text color="gray.500" fontSize="sm" mb={3}>
                        East function reads state and renders Text component.
                        React buttons write to state, triggering re-execution.
                    </Text>
                    <VStack align="stretch" gap={3}>
                        <Box
                            p={3}
                            bg="gray.50"
                            _dark={{ bg: "gray.700" }}
                            borderRadius="sm"
                        >
                            <EastFunction ir={counterDisplayIR} />
                        </Box>
                        <HStack>
                            <IncrementButton />
                            <ResetButton />
                        </HStack>
                    </VStack>
                </Box>
            </VStack>
        </EastStoreProvider>
    );
}
