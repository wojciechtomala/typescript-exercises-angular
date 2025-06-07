import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/userService/user.service';
import { RouterLink } from '@angular/router';
import { Project } from '../../shared/models/project.model';
import { ProjectService } from '../../shared/services/projectService/project.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  public readonly faThumbtack = faThumbtack;

  public user!: User;

  public selectedProject: Project | null = null;

  private userService = inject(UserService);

  private projectService = inject(ProjectService);

  constructor() {}

  ngOnInit(): void {
    this.fetchLoggedUserData();
    this.fetchSelectedProjectData();
  }

  private fetchLoggedUserData(): void {
    this.userService.getLoggedUser().subscribe({
      next: (loggedUserData: User) => {
        this.user = loggedUserData;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private fetchSelectedProjectData(): void {
    const selectedProject = this.projectService.getSelectedProject();
    if (selectedProject) {
      this.selectedProject = selectedProject;
    }
  }
}
