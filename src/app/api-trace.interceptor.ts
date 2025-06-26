import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class ApiTraceInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const start = performance.now();

    return next.handle(request).pipe(
      tap({
        next: () => {
          const duration = performance.now() - start;
          console.log(`[TRACE] ${request.method} ${request.url} - ${duration.toFixed(2)} ms`);
          //  this.logToBackend(request.url, duration);
        },
        error: (error) => {
          const duration = performance.now() - start;
          console.error(`[ERROR] ${request.method} ${request.url} - ${duration.toFixed(2)} ms`, error);
        }
      })
    );
  }
}
