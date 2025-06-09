import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/userService/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  public user!: User;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.loggedInUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }
}
