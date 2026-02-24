/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { Component, type ReactNode } from 'react';
import { StatusDisplay } from './StatusDisplay.js';
import { formatError } from '../errors.js';

export interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    error: Error | null;
}

/**
 * React Error Boundary that catches rendering errors in East UI components.
 * Displays EastError details (including source locations) using StatusDisplay.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    override componentDidUpdate(prevProps: ErrorBoundaryProps) {
        // Reset error when children change (new data loaded)
        if (this.state.error !== null && prevProps.children !== this.props.children) {
            this.setState({ error: null });
        }
    }

    override render() {
        if (this.state.error !== null) {
            return (
                <StatusDisplay
                    variant="error"
                    title="Rendering error"
                    details={formatError(this.state.error)}
                />
            );
        }
        return this.props.children;
    }
}
