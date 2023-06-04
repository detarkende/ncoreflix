/// <reference types="astro/client" />

import { env } from './environment/server';

// interface ImportMetaEnv {
//   readonly NCORE_USERNAME: string;
//   readonly NCORE_PASSWORD: string;
//   readonly TMDB_TOKEN: string;
//   readonly TRANSMISSION_USERNAME: string;
//   readonly TRANSMISSION_PASSWORD: string;
//   readonly TRANSMISSION_DOWNLOAD_DIR: string;
//   readonly ASTROAUTH_SECRET: string;
//   readonly AUTH_PASSWORD: string;
//   readonly PUBLIC_VAPID_PUBLIC_KEY: string;
//   readonly VAPID_PRIVATE_KEY: string;

//   //  --- You don't need to change the variables below ---
//   readonly PORT: string;
//   readonly NCORE_URL: string;
//   readonly TMDB_API_URL: string;
//   readonly INTERNAL_TRANSMISSION_PORT: string;
//   readonly PUBLIC_TRANSMISSION_PORT: string;
//   readonly ASTROAUTH_URL: string;
//   readonly EXTRACT_SUBTITLES_FROM_MKV: "true" | "false";
//   readonly DOCKER_WORKDIR: string;
//   readonly DOCKER_START_COMMAND: string;
//   readonly TRANSMISSION_PEER_PORT: string;
//   readonly DOCKER_NODE_ENV: "development" | "production";
// }

type ImportMetaEnv = typeof env;
