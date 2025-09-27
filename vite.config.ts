import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: id => {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                            return 'react-vendor';
                        }
                        if (id.includes('lexical') || id.includes('@lexical')) {
                            return 'lexical-vendor';
                        }
                        if (
                            id.includes('react-icons') ||
                            id.includes('react-spinners') ||
                            id.includes('react-simple-keyboard')
                        ) {
                            return 'ui-vendor';
                        }
                        if (id.includes('@supabase') || id.includes('supabase')) {
                            return 'supabase-vendor';
                        }
                        if (id.includes('zustand')) {
                            return 'state-vendor';
                        }
                        return 'vendor';
                    }
                },
            },
        },
    },
    esbuild: {
        drop: ['console', 'debugger'],
    },
});
