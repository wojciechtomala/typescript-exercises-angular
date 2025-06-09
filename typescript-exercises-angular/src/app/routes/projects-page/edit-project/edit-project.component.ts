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
import { MatSnackBar } from '@angular/material/snack-bar';

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

  private projectId: string | null =
    this.activatedRoute.snapshot.paramMap.get('projectId')!;

  public comments: string | Comment[] = '198251298591825';

  public editProjectForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    createdAt: ['', Validators.required],
    endDate: ['', Validators.required],
    maxAssignedUsers: [1, Validators.required],
  });

  constructor(private snackBar: MatSnackBar) {
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
    if (this.projectId) {
      this.projectService.getProject(this.projectId).subscribe({
        next: (projectDetailsResponse: any) => {
          this.editProjectForm.patchValue({
            name: projectDetailsResponse.name,
            description: projectDetailsResponse.description,
            createdAt: projectDetailsResponse.createdAt,
            endDate: projectDetailsResponse.endDate,
            maxAssignedUsers: projectDetailsResponse.maxAssignedUsers,
          });
        },
      });
    }
  }

  public onSubmit(): void {
    if (this.editProjectForm.valid) {
      const newProject: NewProject = {
        name: this.editProjectForm.controls.name.value || '',
        description: this.editProjectForm.controls.description.value || '',
        createdAt: this.editProjectForm.controls.createdAt.value || '',
        endDate: this.editProjectForm.controls.endDate.value || '',
        maxAssignedUsers:
          this.editProjectForm.controls.maxAssignedUsers.value || 1,
        stories: [],
      };
      if (this.projectId) {
        const updatedProject = {
          ...newProject,
          _id: this.projectId,
        } as Project;
        this.projectService.updateProject(updatedProject).subscribe({
          next: () => {
            this.snackBar.open(
              'Projekt został zaktualizowany pomyślnie',
              'Zamknij',
              {
                duration: 3000,
              }
            );
          },
          error: (error) => {
            console.error(error);
          },
        });
      } else {
        this.projectService.createProject(newProject).subscribe({
          next: () => {
            this.snackBar.open(
              'Projekt został utworzony pomyślnie',
              'Zamknij',
              {
                duration: 3000,
              }
            );
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
      this.router.navigate(['/projects']);
    }
  }
}
