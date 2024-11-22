//src/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { LoggingService } from '../logging/logging/logging.service';

@Catch()
@Injectable()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const path = request?.url || 'unknown';

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? typeof exception.getResponse() === 'string'
          ? exception.getResponse()
          : (exception.getResponse() as any)?.message || 'Internal server error'
        : 'Internal server error';

    // Логируем ошибку
    this.logger.error(
      `HTTP ${status} Error: ${JSON.stringify(message)} - Path: ${path}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // Возвращаем ответ клиенту
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path,
      message,
    });
  }
}
