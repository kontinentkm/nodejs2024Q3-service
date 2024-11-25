// src/logging/logging.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class LoggingService extends Logger {
  private logDirectory: string;
  private logFilePath: string;
  private errorLogFilePath: string;
  private maxLogSize: number; // Размер файла лога
  private logLevel: number; // Уровень логирования

  constructor() {
    super();
    this.logDirectory = path.join('/usr/src/app/logs');
    this.logFilePath = path.join(this.logDirectory, 'app.log');
    this.errorLogFilePath = path.join(this.logDirectory, 'errors.log');

    // Получаем максимальный размер файла и уровень логирования из переменных окружения
    this.maxLogSize = Number(process.env.MAX_LOG_SIZE) || 5 * 1024; // По умолчанию 5 MB
    this.logLevel = Number(process.env.LOG_LEVEL) || 1; // По умолчанию уровень "info"

    // Убедимся, что директория для логов существует
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory);
    }

    // Логирование необработанных исключений и отклонений обещаний
    process.on('uncaughtException', (error) => {
      this.logErrorToFile('Uncaught Exception', error);
      process.exit(1); // Завершаем процесс с ошибкой
    });

    process.on('unhandledRejection', (reason) => {
      this.logErrorToFile('Unhandled Rejection', reason);
    });
  }

  // Логирование входящих запросов и ответов
  logRequest(request: any, response: any) {
    const logMessage = {
      url: request.url,
      query: request.query,
      body: request.body,
      statusCode: response.statusCode,
    };

    this.logToFile(
      `[info] Request: ${JSON.stringify(logMessage)}`,
      this.logFilePath,
    );
  }

  // Логирование в файл
  private logToFile(message: string, filePath: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    fs.appendFileSync(filePath, logMessage, 'utf8');
    this.checkFileSize(filePath); // Проверка и ротация файла
  }

  // Логирование ошибок в отдельный файл
  private logErrorToFile(message: string, error: any) {
    const timestamp = new Date().toISOString();
    const errorMessage = `${message}: ${error.message} - Stack: ${
      error.stack || 'No stack trace'
    }`;
    const logMessage = `[${timestamp}] [error] ${errorMessage}\n`;

    fs.appendFileSync(this.errorLogFilePath, logMessage, 'utf8');
    this.checkFileSize(this.errorLogFilePath); // Проверка и ротация файла
  }

  // Проверка размера файла и ротация
  private checkFileSize(filePath: string) {
    const stats = fs.statSync(filePath);
    if (stats.size >= this.maxLogSize) {
      const timestamp = new Date().toISOString();
      const archivedFilePath = `${filePath}.${timestamp}.bak`;
      fs.renameSync(filePath, archivedFilePath);
      fs.writeFileSync(filePath, '', 'utf8'); // Создаем новый пустой файл
    }
  }

  log(message: string) {
    if (this.logLevel <= 1) {
      super.log(message);
      this.logToFile(`[info] ${message}`, this.logFilePath); // Логирование информационных сообщений в файл
    }
  }

  error(message: string, trace: string) {
    if (this.logLevel <= 2) {
      super.error(message, trace);
      this.logErrorToFile(`${message} - ${trace}`, this.errorLogFilePath); // Логирование ошибок в файл
    }
  }

  debug(message: string) {
    if (this.logLevel <= 0) {
      super.debug(message);
      this.logToFile(`[debug] ${message}`, this.logFilePath); // Логирование дебаг сообщений
    }
  }

  warn(message: string) {
    if (this.logLevel <= 1) {
      super.warn(message);
      this.logToFile(`[warn] ${message}`, this.logFilePath); // Логирование предупреждений
    }
  }
}
