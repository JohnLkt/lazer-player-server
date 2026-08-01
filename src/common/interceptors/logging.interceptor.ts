import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const method = request.method;
    const url = request.url;
    const startTime = performance.now();

    return next.handle().pipe(
      tap(() => {
        const duration = (performance.now() - startTime).toFixed(2);
        this.logger.log(`[${method}] ${url} - Completed in ${duration}ms`);
      }),
    );
  }
}
