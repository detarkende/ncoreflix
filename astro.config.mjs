import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
    vite: {
        optimizeDeps: {
            exclude: ['ssh2']
        },
        server: {
            hmr: {
                host: '0.0.0.0'
            }
        }
    },
    output: 'server',
    adapter: node({
        mode: "standalone"
    }),
    integrations: [tailwind(),],
});