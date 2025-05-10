import { Component, OnInit } from '@angular/core';
import { Project } from '../../../shared/models/project.model';
import { ProjectService } from '../../../shared/services/projectService/project.service';
import { ActivatedRoute } from '@angular/router';
import { Status, Story } from '../../../shared/models/story.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddStoryModalComponent } from '../../../shared/modals/add-story-modal/add-story-modal.component';

type StatusSelect = Status | 'All';

@Component({
  selector: 'app-project-details-page',
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './project-details-page.component.html',
  styleUrl: './project-details-page.component.scss',
})
export class ProjectDetailsPageComponent implements OnInit {
  public storyStatuses: StatusSelect[] = ['All', 'Todo', 'Doing', 'Done'];

  private routeId!: number;

  public projectDetails!: Project;

  public stories: Story[] = [];

  public storiesFilterForm!: FormGroup;

  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.routeId = +this.activatedRoute.snapshot.params['id'];
    this.storiesFilterForm = this.formBuilder.group({
      status: ['All', []],
    });
  }

  ngOnInit(): void {
    this.fetchProjectDetails();
  }

  private fetchProjectDetails(): void {
    const projectData = this.projectService.getProjectById(this.routeId);
    if (projectData) {
      this.projectDetails = projectData;
    } else {
      alert('No project data found');
    }
  }

  public onAddStoryClick(): void {
    const dialogRef = this.dialog.open(AddStoryModalComponent, {
      width: '620px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
