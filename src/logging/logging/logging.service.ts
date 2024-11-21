// src/logging/logging.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingService extends Logger {
  constructor() {
    super();
    try {
      console.log('LoggingService initialized');
    } catch (err) {
      console.error('Error initializing LoggingService:', err);
    }
  }

  // Путь для логов внутри контейнера
  private logFile = path.join('/usr/src/app/logs', 'app.log');
  private errorFile = path.join('/usr/src/app/logs', 'errors.log');

  log(message: string) {
    super.log(message);
    console.log(`Logging message: ${message}`); // Отладочное сообщение
    this.writeLog('INFO', message, this.logFile);
  }

  error(message: string, trace: string) {
    super.error(message, trace);
    console.log(`Logging error: ${message}, Trace: ${trace}`); // Отладочное сообщение
    this.writeLog('ERROR', `${message} - ${trace}`, this.errorFile);
  }

  private writeLog(level: string, message: string, filePath: string) {
    const logMessage = `[${new Date().toISOString()}] [${level}] ${message}\n`;
    console.log(`Writing log to ${filePath}: ${logMessage}`); // Отладочное сообщение
    try {
      fs.appendFileSync(filePath, logMessage);
    } catch (err) {
      console.error('Error writing to log file', err); // Ошибка записи в лог
    }
  }
}
