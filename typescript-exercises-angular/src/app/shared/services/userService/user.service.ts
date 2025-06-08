import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../constants/environment';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpClient = inject(HttpClient);

  private readonly user: User = {
    id: 0,
    name: 'Wojciech',
    surname: 'Tomala',
  };

  private _loggedInUser: BehaviorSubject<User> = new BehaviorSubject<User>(
    this.user
  );

  public readonly loggedInUser$: Observable<User> =
    this._loggedInUser.asObservable();

  constructor() {}

  public getLoggedUser(): Observable<User> {
    return this.loggedInUser$;
  }

  public getAllUsers(): Observable<User[]> {
    return of([
      {
        id: 1,
        name: 'Wojtek',
        surname: 'Tomala',
      },
      {
        id: 2,
        name: 'Adam',
        surname: 'Tomala',
      },
    ]);
  }

  public loginUser(login: string, password: string): Observable<any> {
    const payload = {
      login,
      password,
    };
    return this.httpClient.post(`${environment.apiURL}/login`, payload);
  }
}
