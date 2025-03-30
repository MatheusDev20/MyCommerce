/* eslint-disable @typescript-eslint/no-explicit-any */
import { DATABASE_CONFIGURATION } from './db';

type ConfigKeys = 'db';
export const config: Record<ConfigKeys, any> = {
  db: DATABASE_CONFIGURATION,
};
