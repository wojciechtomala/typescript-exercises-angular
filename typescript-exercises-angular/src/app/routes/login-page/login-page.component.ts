import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../shared/services/authService/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    FontAwesomeModule,
    MatInputModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
  public loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  public login(): void {
    if (this.loginForm.valid) {
      this.authService
        .login(
          this.loginForm.controls['login'].value,
          this.loginForm.controls['password'].value
        )
        .subscribe({
          next: (res) => {
            this.authService.saveTokens(res.token, res.refreshToken);
            this.authService.updateLoggedInStatus();
          },
          error: (error) => {
            console.error(error);
            if (error.status === 401) {
              this.snackBar.open('Błędne dane logowania', 'Zamknij', {
                duration: 3000,
              });
            } else {
              this.snackBar.open(error.message, 'Zamknij', {
                duration: 3000,
              });
            }
          },
        });
    }
  }
}
