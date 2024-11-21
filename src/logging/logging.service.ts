//src/logging/logging.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService extends Logger {
  private logFile = path.join(__dirname, '../../logs/app.log');
  private errorFile = path.join(__dirname, '../../logs/errors.log');

  log(message: string) {
    super.log(message);
    this.writeLog('INFO', message, this.logFile);
  }

  error(message: string, trace: string) {
    super.error(message, trace);
    this.writeLog('ERROR', `${message} - ${trace}`, this.errorFile);
  }

  private writeLog(level: string, message: string, filePath: string) {
    const logMessage = `[${new Date().toISOString()}] [${level}] ${message}\n`;
    fs.appendFileSync(filePath, logMessage);
  }
}
