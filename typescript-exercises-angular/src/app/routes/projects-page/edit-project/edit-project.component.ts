import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectService } from '../../../shared/services/projectService/project.service';
import { NewProject } from '../../../shared/models/newProject.model';
import { NgIf } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Project } from '../../../shared/models/project.model';

@Component({
  selector: 'app-edit-project',
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterLink,
  ],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss',
})
export class EditProjectComponent implements OnInit {
  private projectService = inject(ProjectService);

  private formBuilder = inject(FormBuilder);

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private projectId: number | null =
    +this.activatedRoute.snapshot.paramMap.get('projectId')!;

  public comments: string | Comment[] = '198251298591825';

  public editProjectForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    createdAt: ['', Validators.required],
    endDate: ['', Validators.required],
    maxAssignedUsers: [1, Validators.required],
  });

  constructor() {
    this.getProjectId();
  }

  private getProjectId(): void {
    if (this.router.url.includes('create-project')) {
      this.projectId = null;
    } else if (this.router.url.includes('edit-project')) {
      const routeProjectId =
        this.activatedRoute.snapshot.paramMap.get('projectId');
      if (typeof routeProjectId === 'number') {
        this.projectId = routeProjectId;
      }
    } else {
      this.router.navigate(['/projects']);
    }
  }

  ngOnInit(): void {
    if (typeof this.projectId === 'number') {
      const project = this.projectService.getProjectById(this.projectId);
      if (project) {
        this.editProjectForm.patchValue({
          name: project.name,
          description: project.description,
          createdAt: project.createdAt,
          endDate: project.endDate,
          maxAssignedUsers: project.maxAssignedUsers,
        });
      }
    }
  }

  public onSubmit(): void {
    console.log('eo');
    if (this.editProjectForm.valid) {
      console.log('eo1');
      const newProject: NewProject = {
        name: this.editProjectForm.controls.name.value || '',
        description: this.editProjectForm.controls.description.value || '',
        createdAt: this.editProjectForm.controls.createdAt.value || '',
        endDate: this.editProjectForm.controls.endDate.value || '',
        maxAssignedUsers:
          this.editProjectForm.controls.maxAssignedUsers.value || 1,
        stories: [],
      };
      if (typeof this.projectId === 'number') {
        const updatedProject = { ...newProject, id: this.projectId } as Project;
        this.projectService.updateProject(updatedProject);
      } else {
        this.projectService.createNewLocalStorageProject(newProject);
      }
      this.router.navigate(['/projects']);
    }
  }
}
