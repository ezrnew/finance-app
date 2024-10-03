import { createWriteStream } from 'fs';

type LogType = 'error' | 'info';

class CustomLogger {
  writeToFile(message: string, type: LogType = 'info') {
    const stream = createWriteStream('log.txt', { flags: 'a' });
    stream.write(`[${type}] ${new Date().toISOString()} - ${message} \n`);
    stream.end();
  }
}

export const logger = new CustomLogger();
