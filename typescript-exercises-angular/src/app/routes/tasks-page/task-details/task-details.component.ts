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
  public storyId: string | null = null;

  public taskId: string | null = null;

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

  public getUserNameById(userId: string): string {
    if (this.usersToSelect) {
      const userIndex = this.usersToSelect.findIndex(
        (user) => user._id === userId
      );
      if (typeof userIndex === 'number' && userIndex !== -1) {
        return `${this.usersToSelect[userIndex].name} ${this.usersToSelect[userIndex].surname}`;
      } else {
        return 'Nieprzypisane';
      }
    } else {
      return 'Ładowanie...';
    }
  }

  private subscribeForTaskDetailsFormValueChange(): void {
    this.taskDetailsForm.valueChanges.subscribe(() => {
      const assignedUserId =
        this.taskDetailsForm.controls['assignedUser'].value;
      if (assignedUserId && this.storyId) {
        const updatedTask: Task = {
          _id: this.task._id,
          storyId: this.task.storyId,
          title: this.task.title,
          description: this.task.description,
          estimatedWorkHours: this.task.estimatedWorkHours,
          createdAt: this.task.createdAt,
          userId: assignedUserId,
          state: 'Doing',
          startDate: new Date().toISOString().substring(0, 10),
        };
        this.taskService.updateTask(updatedTask).subscribe({
          next: () => {
            this.fetchTaskDetails();
            this.snackBar.open(
              'Przypisana osoba zaktualizowana pomyślnie',
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
      } else if (typeof assignedUserId !== 'number' && this.storyId) {
        const updatedTask: Task = {
          _id: this.task._id,
          storyId: this.task.storyId,
          title: this.task.title,
          description: this.task.description,
          estimatedWorkHours: this.task.estimatedWorkHours,
          createdAt: this.task.createdAt,
          state: 'Todo',
        };
        this.taskService.updateTask(updatedTask).subscribe({
          next: () => {
            this.fetchTaskDetails();
            this.snackBar.open(
              'Przypisana osoba zaktualizowana pomyślnie',
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
        _id: this.task._id,
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
      this.taskService.updateTask(updatedTask).subscribe({
        next: () => {
          this.snackBar.open('Zadanie zakończone pomyślnie', 'Zakończ', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
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
    this.storyId = this.route.snapshot.params['storyId'];
    this.taskId = this.route.snapshot.params['taskId'];
    this.fetchTaskDetails();
  }

  private fetchTaskDetails(): void {
    if (this.storyId && this.taskId) {
      this.taskService.getTask(this.taskId).subscribe({
        next: (taskDetails: Task) => {
          this.task = taskDetails;
          this.taskDetailsForm.patchValue(
            {
              assignedUser: this.task.state === 'Doing' ? this.task.userId : '',
            },
            { emitEvent: false }
          );
        },
        error: (error) => {
          console.error(error);
        },
      });
    } else {
      this.snackBar.open('Wystąpił błąd', 'Zamknij', {
        duration: 3000,
      });
      this.router.navigate(['/']);
    }
  }
}
