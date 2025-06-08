import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/authService/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();
    console.log('asdasdsad');
    console.log('token', token);
    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.auth.refreshToken().pipe(
            switchMap((res: any) => {
              this.auth.saveTokens(res.token, res.refreshToken);
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.token}`,
                },
              });
              return next.handle(newReq);
            }),
            catchError(() => {
              this.auth.logout();
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
