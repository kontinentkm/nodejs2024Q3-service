// logging.module.ts
import { Module } from '@nestjs/common';
import { LoggingService } from './logging/logging.service';

@Module({
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
