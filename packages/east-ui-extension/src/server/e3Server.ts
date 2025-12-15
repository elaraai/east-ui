/**
 * Copyright (c) 2025 Elara AI Pty Ltd
 * Dual-licensed under AGPL-3.0 and commercial license. See LICENSE for details.
 */

import { createServer, type Server } from '@elaraai/e3-api-server';

let serverInstance: Server | null = null;
let currentRepoPath: string | null = null;

export interface E3ServerConfig {
    repo: string;
    port: number;
}

/**
 * Start the e3 API server.
 * If already running with a different repo, stops and restarts.
 */
export async function startE3Server(config: E3ServerConfig): Promise<string> {
    // If server is running with same repo, just return the URL
    if (serverInstance && currentRepoPath === config.repo) {
        return `http://localhost:${serverInstance.port}`;
    }

    // Stop existing server if running
    if (serverInstance) {
        await stopE3Server();
    }

    serverInstance = createServer({
        repo: config.repo,
        port: config.port,
        host: 'localhost',
        cors: true,
    });

    await serverInstance.start();
    currentRepoPath = config.repo;

    return `http://localhost:${serverInstance.port}`;
}

/**
 * Stop the e3 API server if running.
 */
export async function stopE3Server(): Promise<void> {
    if (serverInstance) {
        await serverInstance.stop();
        serverInstance = null;
        currentRepoPath = null;
    }
}

/**
 * Check if the server is currently running.
 */
export function isServerRunning(): boolean {
    return serverInstance !== null;
}

/**
 * Get the current server URL if running.
 */
export function getServerUrl(): string | null {
    if (serverInstance) {
        return `http://localhost:${serverInstance.port}`;
    }
    return null;
}
