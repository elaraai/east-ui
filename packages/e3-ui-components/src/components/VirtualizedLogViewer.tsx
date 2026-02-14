/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Box, Flex, Text, IconButton, Tabs, type UseTabsReturn, Input, Badge } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck, faChevronUp, faChevronDown, faArrowDown } from '@fortawesome/free-solid-svg-icons';

interface Match {
    lineIndex: number;
    start: number;
    end: number;
}

export interface VirtualizedLogViewerProps {
    content: string;
    tabs: UseTabsReturn;
}

// Highlight search matches within a line
function HighlightedLine({
    text,
    lineMatches,
    currentMatchIndex,
    globalMatches,
}: {
    text: string;
    lineMatches: Match[];
    currentMatchIndex: number;
    globalMatches: Match[];
}) {
    if (lineMatches.length === 0) {
        return <>{text || ' '}</>;
    }

    const parts: React.ReactNode[] = [];
    let lastEnd = 0;

    lineMatches.forEach((match, idx) => {
        // Add text before this match
        if (match.start > lastEnd) {
            parts.push(<span key={`t${idx}`}>{text.slice(lastEnd, match.start)}</span>);
        }

        // Check if this is the current match
        const globalIdx = globalMatches.findIndex(
            m => m.lineIndex === match.lineIndex && m.start === match.start
        );
        const isCurrent = globalIdx === currentMatchIndex;

        // Add highlighted match
        parts.push(
            <span
                key={`m${idx}`}
                style={{
                    backgroundColor: isCurrent ? '#f59e0b' : '#fbbf24',
                    color: '#000',
                    borderRadius: '2px',
                    outline: isCurrent ? '2px solid #f59e0b' : undefined,
                }}
            >
                {text.slice(match.start, match.end)}
            </span>
        );

        lastEnd = match.end;
    });

    // Add remaining text
    if (lastEnd < text.length) {
        parts.push(<span key="end">{text.slice(lastEnd)}</span>);
    }

    return <>{parts}</>;
}

export function VirtualizedLogViewer({ content, tabs }: VirtualizedLogViewerProps) {
    const parentRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [hasNewLogs, setHasNewLogs] = useState(false);

    // Split content into lines
    const lines = useMemo(() => {
        if (!content) return [''];
        return content.split('\n');
    }, [content]);

    // Find all matches and build a map by line index for O(1) lookup
    const { matches, matchesByLine } = useMemo(() => {
        const matches: Match[] = [];
        const matchesByLine = new Map<number, Match[]>();

        if (!searchQuery) {
            return { matches, matchesByLine };
        }

        const query = searchQuery.toLowerCase();

        lines.forEach((line, lineIndex) => {
            const lineLower = line.toLowerCase();
            const lineMatches: Match[] = [];
            let start = 0;

            while (true) {
                const found = lineLower.indexOf(query, start);
                if (found === -1) break;

                const match: Match = {
                    lineIndex,
                    start: found,
                    end: found + searchQuery.length,
                };
                matches.push(match);
                lineMatches.push(match);
                start = found + 1;
            }

            if (lineMatches.length > 0) {
                matchesByLine.set(lineIndex, lineMatches);
            }
        });

        return { matches, matchesByLine };
    }, [lines, searchQuery]);

    // Reset current match when search changes
    useEffect(() => {
        setCurrentMatchIndex(0);
    }, [searchQuery]);

    const virtualizer = useVirtualizer({
        count: lines.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 20,
        overscan: 20,
    });

    // Scroll to current match
    const scrollToMatch = useCallback((index: number) => {
        if (matches.length === 0) return;
        const match = matches[index];
        if (match) {
            virtualizer.scrollToIndex(match.lineIndex, { align: 'center' });
        }
    }, [matches, virtualizer]);

    // Scroll to first match when search changes
    useEffect(() => {
        if (matches.length > 0) {
            scrollToMatch(0);
        }
    }, [matches, scrollToMatch]);

    const handlePrevMatch = useCallback(() => {
        if (matches.length === 0) return;
        setCurrentMatchIndex(prev => {
            const newIndex = prev === 0 ? matches.length - 1 : prev - 1;
            scrollToMatch(newIndex);
            return newIndex;
        });
    }, [matches.length, scrollToMatch]);

    const handleNextMatch = useCallback(() => {
        if (matches.length === 0) return;
        setCurrentMatchIndex(prev => {
            const newIndex = prev === matches.length - 1 ? 0 : prev + 1;
            scrollToMatch(newIndex);
            return newIndex;
        });
    }, [matches.length, scrollToMatch]);

    // Handle keyboard shortcuts
    const handleSearchKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                handlePrevMatch();
            } else {
                handleNextMatch();
            }
            e.preventDefault();
        } else if (e.key === 'Escape') {
            setSearchQuery('');
        }
    }, [handlePrevMatch, handleNextMatch]);

    // Check if scrolled to bottom (within threshold)
    const checkIsAtBottom = useCallback(() => {
        const el = parentRef.current;
        if (!el) return true;
        const threshold = 50; // pixels from bottom
        return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
    }, []);

    // Handle scroll events to track position
    const handleScroll = useCallback(() => {
        const atBottom = checkIsAtBottom();
        setIsAtBottom(atBottom);
        if (atBottom) {
            setHasNewLogs(false);
        }
    }, [checkIsAtBottom]);

    // Scroll to bottom and clear notification
    const scrollToBottom = useCallback(() => {
        virtualizer.scrollToIndex(lines.length - 1, { align: 'end' });
        setHasNewLogs(false);
        setIsAtBottom(true);
    }, [virtualizer, lines.length]);

    // Auto-scroll to bottom when new logs arrive (only if already at bottom and not searching)
    const prevLinesLength = useRef(lines.length);
    useEffect(() => {
        if (lines.length > prevLinesLength.current) {
            if (!searchQuery && isAtBottom) {
                virtualizer.scrollToIndex(lines.length - 1, { align: 'end' });
            } else if (!searchQuery) {
                setHasNewLogs(true);
            }
        }
        prevLinesLength.current = lines.length;
    }, [lines.length, virtualizer, searchQuery, isAtBottom]);

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Failed to copy
        }
    }, [content]);

    return (
        <Box
            height="100%"
            display="flex"
            flexDirection="column"
            p="4"
        >
            {/* Header */}
            <Flex
                px={3}
                py={2}
                bg="gray.800"
                borderTopRadius="md"
                align="center"
                justify="space-between"
                flexShrink={0}
                gap={2}
            >
                <Tabs.RootProvider value={tabs} size="sm" variant="line">
                    <Tabs.List borderBottom="none">
                        <Tabs.Trigger value="stdout" color="gray.300" _selected={{ color: 'white' }}>
                            stdout
                        </Tabs.Trigger>
                        <Tabs.Trigger value="stderr" color="gray.300" _selected={{ color: 'white' }}>
                            stderr
                        </Tabs.Trigger>
                    </Tabs.List>
                </Tabs.RootProvider>

                {/* Search controls */}
                <Flex align="center" gap={1}>
                    <Input
                        size="xs"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        bg="gray.700"
                        border="none"
                        color="white"
                        _placeholder={{ color: 'gray.400' }}
                        width="150px"
                    />
                    {searchQuery && (
                        <Text fontSize="xs" color="gray.400" minWidth="50px" textAlign="center">
                            {matches.length > 0 ? `${currentMatchIndex + 1}/${matches.length}` : '0/0'}
                        </Text>
                    )}
                    <IconButton
                        variant="ghost"
                        size="xs"
                        onClick={handlePrevMatch}
                        color="gray.400"
                        _hover={{ color: 'white' }}
                        aria-label="Previous match"
                        disabled={matches.length === 0}
                    >
                        <FontAwesomeIcon icon={faChevronUp} />
                    </IconButton>
                    <IconButton
                        variant="ghost"
                        size="xs"
                        onClick={handleNextMatch}
                        color="gray.400"
                        _hover={{ color: 'white' }}
                        aria-label="Next match"
                        disabled={matches.length === 0}
                    >
                        <FontAwesomeIcon icon={faChevronDown} />
                    </IconButton>
                    <IconButton
                        variant="ghost"
                        size="xs"
                        onClick={handleCopy}
                        color="gray.400"
                        _hover={{ color: 'white' }}
                        aria-label="Copy logs"
                    >
                        <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                    </IconButton>
                </Flex>
            </Flex>

            {/* Virtualized content */}
            <Box position="relative" flex="1" minHeight={0}>
                <Box
                    ref={parentRef}
                    height="100%"
                    overflow="auto"
                    bg="gray.900"
                    borderBottomRadius="md"
                    fontFamily="mono"
                    fontSize="sm"
                    color="gray.100"
                    onScroll={handleScroll}
                >
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {virtualizer.getVirtualItems().map((virtualItem) => {
                        const lineIndex = virtualItem.index;
                        const lineText = lines[lineIndex] ?? '';
                        const lineMatches = matchesByLine.get(lineIndex) || [];

                        return (
                            <div
                                key={virtualItem.key}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualItem.size}px`,
                                    transform: `translateY(${virtualItem.start}px)`,
                                }}
                            >
                                <Flex px={3} py={0.5} _hover={{ bg: 'gray.800' }}>
                                    <Text
                                        as="span"
                                        color="gray.500"
                                        minWidth="50px"
                                        textAlign="right"
                                        mr={3}
                                        userSelect="none"
                                        flexShrink={0}
                                    >
                                        {lineIndex + 1}
                                    </Text>
                                    <Text
                                        as="span"
                                        whiteSpace="pre"
                                        wordBreak="break-all"
                                        flex={1}
                                    >
                                        <HighlightedLine
                                            text={lineText}
                                            lineMatches={lineMatches}
                                            currentMatchIndex={currentMatchIndex}
                                            globalMatches={matches}
                                        />
                                    </Text>
                                </Flex>
                            </div>
                        );
                    })}
                </div>
                </Box>

                {/* New logs notification */}
                {hasNewLogs && (
                    <Box
                        position="absolute"
                        bottom={3}
                        right={3}
                        cursor="pointer"
                        onClick={scrollToBottom}
                    >
                        <Badge
                            colorPalette="blue"
                            px={3}
                            py={1}
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            gap={2}
                            boxShadow="md"
                        >
                            <FontAwesomeIcon icon={faArrowDown} />
                            New logs
                        </Badge>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
