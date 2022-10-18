import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import * as path from 'path';
import license from 'rollup-plugin-license';
import { generateLicensesReportAndStaticLibsPage } from './generateLicensePage.js';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), visualizer()],
    build: {
        outDir: 'build',
        sourcemap: true,
        rollupOptions: {
            manualChunks: {
                commonVendor: ['core-js', '@sentry/browser', 'framer-motion', 'oidc-client-ts'],
            },
            plugins: [
                license({
                    sourcemap: true,
                    cwd: process.cwd(), // The default

                    thirdParty: {
                        includePrivate: true, // Default is false.
                        allow: '(MIT OR Apache-2.0 OR BSD-3-Clause OR 0BSD)',
                        output: {
                            file: path.join(__dirname, 'dist', 'dependencies.html'),
                            encoding: 'utf-8', // Default is utf-8.
                            template(dependencies) {
                                return generateLicensesReportAndStaticLibsPage(dependencies);
                            },
                        },
                    },
                }),
            ],
        },
    },
    server: {
        port: 3000,
    },
});
