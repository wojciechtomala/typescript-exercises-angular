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
import { ActivatedRoute, Router } from '@angular/router';
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
    MatNativeDateModule
  ],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})
export class EditProjectComponent implements OnInit{

  private projectService = inject(ProjectService);
  
  private formBuilder = inject(FormBuilder);

  private router = inject(Router);

  private activatedRoute = inject(ActivatedRoute);

  private projectId : number = +this.activatedRoute.snapshot.paramMap.get('projectId')!;

  public comments: string | Comment[] = "198251298591825";

  public editProjectForm = this.formBuilder.group({
    name: ['', Validators.required],
    description:  ['', Validators.required],
    createdAt:  ['', Validators.required],
    endDate: ['', Validators.required],
    maxAssignedUsers: [1, Validators.required],
  });

  constructor() { }

  ngOnInit(): void {
    if(this.projectId >= 0) {
      const project = this.projectService.getProjectById(this.projectId);
      if(project){
        this.editProjectForm.patchValue({
          name: project.name,
          description: project.description,
          createdAt: project.createdAt,
          endDate: project.endDate,
          maxAssignedUsers: project.maxAssignedUsers
        })
      }
    }
  }

  public onSubmit() : void {
    if(this.editProjectForm.valid) {
      const newProject : NewProject = {
        name: this.editProjectForm.controls.name.value || "",
        description: this.editProjectForm.controls.description.value || "",
        createdAt: this.editProjectForm.controls.createdAt.value || "",
        endDate: this.editProjectForm.controls.endDate.value || "",
        maxAssignedUsers: this.editProjectForm.controls.maxAssignedUsers.value || 1,
      }
      if(this.projectId >= 0 ){
        const updatedProject = { ...newProject, id: this.projectId } as Project;
        this.projectService.updateProject(updatedProject);
      }
      else{
        this.projectService.createNewLocalStorageProject(newProject);
      }
      this.router.navigate(['/projects']);
    }
  }
}
