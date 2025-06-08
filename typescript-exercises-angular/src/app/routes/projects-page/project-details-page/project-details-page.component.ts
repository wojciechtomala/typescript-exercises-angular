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
import { MatButtonModule } from '@angular/material/button';
import { EditStoryModalComponent } from '../../../shared/modals/edit-story-modal/edit-story-modal.component';
import { statuses } from '../../../shared/constants/constants';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { StoriesService } from '../../../shared/services/storiesService/stories-service.service';

type StatusSelect = Status | 'All';

@Component({
  selector: 'app-project-details-page',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    FontAwesomeModule,
  ],
  templateUrl: './project-details-page.component.html',
  styleUrl: './project-details-page.component.scss',
})
export class ProjectDetailsPageComponent implements OnInit {
  public readonly faTrash = faTrash;

  public storyStatuses: StatusSelect[] = statuses;

  private routeId!: number;

  public projectDetails!: Project;

  public stories: Story[] = [];

  public storiesFilterForm!: FormGroup;

  public filteredStories: Story[] = [];

  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private storiesService: StoriesService
  ) {
    this.routeId = +this.activatedRoute.snapshot.params['id'];
    this.storiesFilterForm = this.formBuilder.group({
      status: ['All', []],
    });

    this.storiesFilterForm
      .get('status')!
      .valueChanges.subscribe((selectedStatus) => {
        this.applyFilter(selectedStatus);
      });
  }

  applyFilter(selectedStatus: string) {
    if (selectedStatus === 'All') {
      this.filteredStories = this.projectDetails.stories;
    } else {
      this.filteredStories = this.projectDetails.stories.filter(
        (story) => story.status === selectedStatus
      );
    }
  }

  ngOnInit(): void {
    this.fetchProjectDetails();
  }

  private fetchProjectDetails(): void {
    const projectData = this.projectService.getProjectById(this.routeId);
    if (projectData) {
      this.projectDetails = projectData;
      this.filteredStories = this.projectDetails.stories;
    } else {
      alert('No project data found');
    }
  }

  public deleteStory(e: Event, clickedStoryId: number): void {
    e.stopPropagation();
    this.storiesService.deleteStory(this.projectDetails.id, clickedStoryId);
    this.fetchProjectDetails();
  }

  public onAddStoryClick(): void {
    const dialogRef = this.dialog.open(AddStoryModalComponent, {
      width: '620px',
      data: {
        projectId: this.projectDetails.id,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.fetchProjectDetails();
    });
  }

  public onEditStoryClick(storyId: number): void {
    const dialogRef = this.dialog.open(EditStoryModalComponent, {
      width: '620px',
      data: {
        projectId: this.projectDetails.id,
        storyId: storyId,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.fetchProjectDetails();
    });
  }
}
