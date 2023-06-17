/// <reference types="astro/client" />

import type { User } from '@prisma/client';
import { env } from './environment/server';

type ImportMetaEnv = typeof env;

declare global {
	namespace App {
		interface Locals {
			user: User;
		}
	}
}
