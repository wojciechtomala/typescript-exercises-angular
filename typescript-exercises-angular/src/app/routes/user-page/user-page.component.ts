import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/userService/user.service';
import { AuthService } from '../../shared/services/authService/auth.service';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-page',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.scss',
})
export class UserPageComponent implements OnInit {
  public user!: User;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserInfo();
  }

  public onLogout(): void {
    this.authService.logout();
    this.authService.updateLoggedInStatus();
  }

  public async fetchUserInfo(): Promise<void> {
    const userData = await firstValueFrom(this.userService.loggedInUser$);
    if (userData) {
      this.user = userData;
    } else {
      this.router.navigate(['/']);
    }
  }
}
