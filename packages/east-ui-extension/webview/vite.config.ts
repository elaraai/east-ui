import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [react()],
    define: {
        // Replace process.env and process.argv for East compatibility
        'process.env': {},
        'process.argv': '[]',
        // Replace import.meta.url for IIFE compatibility (East uses this for direct execution check)
        'import.meta.url': '""',
    },
    build: {
        outDir: '../dist/webview',
        emptyOutDir: true,
        rollupOptions: {
            input: resolve(__dirname, 'src/main.tsx'),
            output: {
                entryFileNames: 'index.js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name][extname]',
                // Use IIFE format for webview compatibility (no ES modules)
                format: 'iife',
            },
        },
        // Inline everything for single file output
        assetsInlineLimit: 100000,
        // Don't copy public folder
        copyPublicDir: false,
        // Handle CommonJS modules that use exports.default (like sorted-btree)
        commonjsOptions: {
            defaultIsModuleExports: true,
            include: [/sorted-btree/, /node_modules/],
        },
    },
    optimizeDeps: {
        include: ['sorted-btree', '@elaraai/east', '@elaraai/east-ui', '@elaraai/east-ui-components', 'react-dom/client', '@chakra-ui/react'],
    },
    // Ensure we can reference assets properly in webview
    base: './',
});
