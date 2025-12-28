import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.status === 0) {
            errorMessage =
              'Unable to connect to the server. Please check your internet connection.';
          } else if (error.status === 400) {
            errorMessage = error.error?.message || 'Bad request. Please check your input.';
          } else if (error.status === 401) {
            errorMessage = 'Unauthorized. Please log in again.';
          } else if (error.status === 403) {
            errorMessage = 'Access denied.';
          } else if (error.status === 404) {
            errorMessage = 'Resource not found.';
          } else if (error.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (error.status === 503) {
            errorMessage = 'Service temporarily unavailable. Please try again later.';
          } else {
            errorMessage =
              error.error?.message ||
              `HTTP Error: ${error.status} ${error.statusText}`;
          }
        }

        console.error('HTTP Error:', errorMessage);
        return throwError(() => ({
          message: errorMessage,
          status: error.status,
          error: error.error,
        }));
      })
    );
  }
}
