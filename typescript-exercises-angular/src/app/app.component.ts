import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavBarComponent } from './shared/components/nav-bar/nav-bar.component';
import { AuthService } from './shared/services/authService/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public isUserLoggedIn: boolean = false;

  public readonly title = 'typescript-exercises-angular';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.updateLoggedInStatus();
    this.subsctibeUserLoggedInStatus();
  }

  private subsctibeUserLoggedInStatus(): void {
    this.authService.isUserLoggedIn$.subscribe((isUserLoggedIn) => {
      if (this.isUserLoggedIn === isUserLoggedIn) return;

      this.isUserLoggedIn = isUserLoggedIn;

      if (isUserLoggedIn) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
