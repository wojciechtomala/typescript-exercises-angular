import { Component, inject, OnInit } from '@angular/core';
import { Project } from '../../shared/models/project.model';
import { ProjectService } from '../../shared/services/projectService/project.service';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-projects-page',
  imports: [RouterLink, MatIconModule, MatTooltipModule],
  templateUrl: './projects-page.component.html',
  styleUrl: './projects-page.component.scss'
})
export class ProjectsPageComponent implements OnInit{

  public projects: Project[] = [];

  private projectService = inject(ProjectService);

  constructor() {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  private fetchProjects() : void {
    this.projects = this.projectService.getAllProjects();
  }

  public onSelectProject(e: Event, projectId: number) : void {
    e.stopPropagation();
    this.projectService.setSelectedProject(projectId);
    this.fetchProjects();
  }

  public onDeleteProject(e: Event, projectId: number) : void {
    e.stopPropagation();
    this.projectService.deleteProjectFromLocalStorage(projectId);
    this.fetchProjects();
  }
}
