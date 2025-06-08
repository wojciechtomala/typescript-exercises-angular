import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';

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

  login(login: string, password: string) {
    return this.http.post<any>(`${this.api}/login`, {
      login,
      password,
    });
  }

  refreshToken() {
    const refreshToken = localStorage.getItem(this.refreshKey);
    return this.http.post<any>(`${this.api}/refreshToken`, { refreshToken });
  }

  saveTokens(token: string, refreshToken: string) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.refreshKey, refreshToken);
  }

  getToken() {
    console.log(this.tokenKey, localStorage.getItem(this.tokenKey));
    return localStorage.getItem(this.tokenKey);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp * 1000;
      return Date.now() < exp;
    } catch (e) {
      return false;
    }
  }

  updateLoggedInStatus(): void {
    const status = this.isLoggedIn();
    this._isUserLoggedIn.next(status);
  }
}
