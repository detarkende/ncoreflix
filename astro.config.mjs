import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    optimizeDeps: {
      exclude: ['ssh2', 'nock', 'aws-sdk', 'mock-aws-s3']
    },
    server: {
      hmr: {
        host: '0.0.0.0'
      }
    }
  },
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [tailwind(), react()]
});