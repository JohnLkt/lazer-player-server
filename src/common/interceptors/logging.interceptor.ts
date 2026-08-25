import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const method = request.method;
    const url = request.url;
    const requestId = request.headers['x-request-id'] ?? '';
    const startTime = performance.now();

    this.logger.log(`[${method}] ${url} - ${requestId} - Start`);

    let status = 200;

    return next.handle().pipe(
      tap(() => {
        status = response.statusCode;
        const duration = (performance.now() - startTime).toFixed(2);
        this.logger.log(
          `[${method}] ${url} - ${status} - Completed in ${duration}ms`,
        );
      }),
      catchError((err: unknown) => {
        const status =
          (err as { status?: number }).status ?? response.statusCode ?? 500;
        this.logger.error(
          `[${method}] ${url} - ${status} - ERROR: ${(err as Error).message}`,
        );
        return throwError(() => err);
      }),
    );
  }
}
