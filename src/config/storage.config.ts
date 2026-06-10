import { registerAs } from '@nestjs/config';
import * as path from 'path';

export default registerAs('storage', () => {
  const basePath = process.env.OSU_LAZER_PATH;

  if (!basePath) {
    throw new Error('OSU_LAZER_PATH environment variable is not set');
  }

  return {
    // Path to the actual Realm database file
    realmDbPath: path.join(basePath, 'client.realm'),
    
    // Path to the hashed files directory
    filesPath: path.join(basePath, 'files'),
  };
});