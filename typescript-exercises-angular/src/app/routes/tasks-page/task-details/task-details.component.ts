import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../shared/services/taskService/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../../shared/models/task.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../shared/services/userService/user.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-task-details',
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent implements OnInit {
  public storyId: number | null = null;

  public taskId: number | null = null;

  public task!: Task;

  public taskDetailsForm: FormGroup;

  public usersToSelect: User[] = [];

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.taskDetailsForm = this.formBuilder.group({
      assignedUser: ['', []],
    });
    this.fetchUsers();
    this.subscribeForTaskDetailsFormValueChange();
  }

  public getUserNameById(userId: number): string {
    if (this.usersToSelect) {
      const user = this.usersToSelect.findIndex((user) => user.id === userId);
      if (typeof user === 'number' && user !== -1) {
        return `${this.usersToSelect[user].name} ${this.usersToSelect[user].surname}`;
      } else {
        return 'Nieprzypisane';
      }
    } else {
      return 'Ładowanie...';
    }
  }

  private subscribeForTaskDetailsFormValueChange(): void {
    this.taskDetailsForm.valueChanges.subscribe(() => {
      const assignedUserId: number | string =
        this.taskDetailsForm.controls['assignedUser'].value;
      if (typeof assignedUserId === 'number' && this.storyId) {
        const updatedTask: Task = {
          id: this.task.id,
          storyId: this.task.storyId,
          title: this.task.title,
          description: this.task.description,
          estimatedWorkHours: this.task.estimatedWorkHours,
          createdAt: this.task.createdAt,
          userId: assignedUserId,
          state: 'Doing',
          startDate: new Date().toISOString().substring(0, 10),
        };
        this.taskService.updateTask(this.storyId, updatedTask);
        this.fetchTaskDetails();
      } else if (typeof assignedUserId !== 'number' && this.storyId) {
        const updatedTask: Task = {
          id: this.task.id,
          storyId: this.task.storyId,
          title: this.task.title,
          description: this.task.description,
          estimatedWorkHours: this.task.estimatedWorkHours,
          createdAt: this.task.createdAt,
          state: 'Todo',
        };
        this.taskService.updateTask(this.storyId, updatedTask);
        this.fetchTaskDetails();
      }
    });
  }

  public fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (usersResponse: User[]) => {
        this.usersToSelect = usersResponse;
      },
    });
  }

  public endTask(): void {
    if (this.task.state === 'Doing' && this.storyId) {
      const updatedTask: Task = {
        id: this.task.id,
        storyId: this.task.storyId,
        title: this.task.title,
        description: this.task.description,
        estimatedWorkHours: this.task.estimatedWorkHours,
        createdAt: this.task.createdAt,
        userId: this.task.userId,
        state: 'Done',
        startDate: this.task.startDate,
        endDate: new Date().toISOString().substring(0, 10),
      };
      this.taskService.updateTask(this.storyId, updatedTask);
      this.fetchTaskDetails();
    } else {
      this.snackBar.open(
        'Wystąpił bład: Zadanie musi mieć status doing',
        'Zakończ',
        {
          duration: 3000,
        }
      );
    }
  }

  ngOnInit(): void {
    this.storyId = +this.route.snapshot.params['storyId'];
    this.taskId = +this.route.snapshot.params['taskId'];
    this.fetchTaskDetails();
  }

  private fetchTaskDetails(): void {
    if (typeof this.storyId === 'number' && typeof this.taskId === 'number') {
      const taskDetails = this.taskService.getTask(this.storyId, this.taskId);
      if (taskDetails) {
        this.task = taskDetails;
        this.taskDetailsForm.patchValue(
          {
            assignedUser: this.task.state === 'Doing' ? this.task.userId : '',
          },
          { emitEvent: false }
        );
      }
    } else {
      this.snackBar.open('Wystąpił błąd', 'Zamknij', {
        duration: 3000,
      });
      this.router.navigate(['/']);
    }
  }
}
