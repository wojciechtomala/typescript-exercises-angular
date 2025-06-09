import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../constants/environment';
import { User } from '../../models/user.model';
import { AuthService } from '../authService/auth.service';
import { UserDataResponse } from '../../models/userDataResponse.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly api = 'http://localhost:3000';
  private httpClient = inject(HttpClient);

  private isUserLoggedIn: boolean = false;

  private _loggedInUser: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);

  public readonly loggedInUser$: Observable<User | null> =
    this._loggedInUser.asObservable();

  constructor(private authService: AuthService) {
    this.subsctibeUserLoggedInStatus();
  }

  private subsctibeUserLoggedInStatus(): void {
    this.authService.isUserLoggedIn$.subscribe((isUserLoggedIn) => {
      if (this.isUserLoggedIn === isUserLoggedIn) return;
      this.isUserLoggedIn = isUserLoggedIn;
      this.fetchUserData();
    });
  }

  private fetchUserData(): void {
    this.httpClient.get<UserDataResponse>(`${this.api}/me`).subscribe({
      next: (userDataResponse) => {
        this._loggedInUser.next({
          _id: userDataResponse._id,
          name: userDataResponse.name,
          surname: userDataResponse.surname,
        });
      },
    });
  }

  public getLoggedUser(): Observable<User | null> {
    return this.loggedInUser$;
  }

  public getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.api}/users`);
  }
}
