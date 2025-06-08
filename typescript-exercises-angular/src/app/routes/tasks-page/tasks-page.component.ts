import { Component, OnInit } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { TaskService } from '../../shared/services/taskService/task.service';
import { StoriesService } from '../../shared/services/storiesService/stories-service.service';
import { Story } from '../../shared/models/story.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskModalComponent } from '../../shared/modals/add-task-modal/add-task-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tasks-page',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatButtonModule,
  ],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss',
})
export class TasksPageComponent implements OnInit {
  public readonly faTrash = faTrash;

  public taskFiltersForm: FormGroup;

  public stories: Story[] = [];

  public tasks: Task[] = [];

  constructor(
    private storiesService: StoriesService,
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.taskFiltersForm = this.formBuilder.group({
      storyId: [null, []],
    });
  }

  ngOnInit(): void {
    this.fetchAllStories();
    this.fetchTasks();
  }

  private fetchAllStories(): void {
    this.stories = this.storiesService.getAllStories();
  }

  public fetchTasks(): void {
    this.tasks = this.taskService.getTasks(
      this.taskFiltersForm.controls['storyId'].value
    );
  }

  public onAddTaskModalOpen(): void {
    const dialogRef = this.dialog.open(AddTaskModalComponent, {
      width: '620px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.fetchTasks();
    });
  }

  public deleteTask(
    e: Event,
    clickedStoryId: number,
    clickedTaskId: number
  ): void {
    e.stopPropagation();
    this.taskService.deleteTask(clickedStoryId, clickedTaskId);
    this.fetchTasks();
  }
}
