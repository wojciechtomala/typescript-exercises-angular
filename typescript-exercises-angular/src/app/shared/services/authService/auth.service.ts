import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginDataResponse } from '../../models/loginDataResponse.model';
import { Token } from '../../models/token.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = 'http://localhost:3000';
  private readonly tokenKey = 'access_token';
  private readonly refreshKey = 'refresh_token';

  private _isUserLoggedIn: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public readonly isUserLoggedIn$: Observable<boolean> =
    this._isUserLoggedIn.asObservable();

  constructor(private http: HttpClient) {}

  public login(login: string, password: string): Observable<LoginDataResponse> {
    return this.http.post<LoginDataResponse>(`${this.api}/login`, {
      login,
      password,
    });
  }

  public refreshToken(): Observable<LoginDataResponse> {
    const refreshToken = localStorage.getItem(this.refreshKey);
    return this.http.post<LoginDataResponse>(`${this.api}/refreshToken`, {
      refreshToken,
    });
  }

  public saveTokens(token: string, refreshToken: string) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.refreshKey, refreshToken);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
  }

  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: Token = jwtDecode(token);
      const exp = decoded.exp * 1000;
      return Date.now() < exp;
    } catch (e) {
      return false;
    }
  }

  public updateLoggedInStatus(): void {
    const status = this.isLoggedIn();
    this._isUserLoggedIn.next(status);
  }
}
