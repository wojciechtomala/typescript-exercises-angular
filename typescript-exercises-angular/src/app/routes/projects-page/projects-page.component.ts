import { Component, inject, OnInit } from '@angular/core';
import { Project } from '../../shared/models/project.model';
import { ProjectService } from '../../shared/services/projectService/project.service';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInbox, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-projects-page',
  imports: [
    RouterLink,
    MatIconModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatButtonModule,
  ],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss',
})
export class ProjectsPageComponent implements OnInit {
  public readonly faThumbtack = faThumbtack;

  public readonly faInbox = faInbox;

  public projects: Project[] = [];

  private projectService = inject(ProjectService);

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  private fetchProjects(): void {
    this.projectService
      .getProjects()
      .subscribe((projectsResponse: Project[]) => {
        this.projects = projectsResponse;
      });
  }

  public onSelectProject(e: Event, projectId: string): void {
    e.stopPropagation();
    this.projectService.setSelectedProject(projectId).subscribe({
      next: () => {
        this.snackBar.open('Zaktualizowano projekt domyślny', 'Zamknij', {
          duration: 3000,
        });
        this.fetchProjects();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  public onDeleteProject(e: Event, projectId: string): void {
    e.stopPropagation();
    this.projectService.deleteProject(projectId).subscribe({
      next: () => {
        this.fetchProjects();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
