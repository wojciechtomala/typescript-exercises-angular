import { Component, Inject, inject, model, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NewStory, Priority, Status, Story } from '../../models/story.model';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { priorities, statuses } from '../../constants/constants';
import { UserService } from '../../services/userService/user.service';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoriesService } from '../../services/storiesService/stories-service.service';
import { TaskService } from '../../services/taskService/task.service';

@Component({
  selector: 'app-add-task-modal',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogClose,
  ],
  templateUrl: './add-task-modal.component.html',
  styleUrl: './add-task-modal.component.scss',
})
export class AddTaskModalComponent implements OnInit {
  public stories: Story[] = [];

  public addTaskModalForm!: FormGroup;

  public readonly priorities: Priority[] = priorities;

  public readonly statuses: Status[] = statuses;

  constructor(
    public dialogRef: MatDialogRef<AddTaskModalComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private storiesService: StoriesService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.fetchAllStories();
    this.initAddStoryModalForm();
  }

  private fetchAllStories(): void {
    this.stories = this.storiesService.getAllStories();
  }

  private initAddStoryModalForm(): void {
    this.addTaskModalForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required]],
      estimatedWorkHours: [null, Validators.required],
      state: [{ value: 'Todo', disabled: true }, Validators.required],
      storyId: ['', Validators.required],
      createdAt: [null, Validators.required],
    });
  }

  public async onSubmit(): Promise<void> {
    const newStoryCreateDate = new Date().toISOString().substring(0, 10);
    this.addTaskModalForm.patchValue({
      createdAt: newStoryCreateDate,
    });
    if (this.addTaskModalForm.valid) {
      if (typeof this.addTaskModalForm.controls['storyId'].value === 'number') {
        this.taskService.createTask(
          this.addTaskModalForm.controls['storyId'].value,
          this.addTaskModalForm.value
        );
        this._snackBar.open('Sukces: utworzono nowe zadanie', 'Zamknij', {
          duration: 3000,
        });
      } else {
        this._snackBar.open('Wystąpił błąd: Brak id projektu', 'Zamknij', {
          duration: 3000,
        });
      }
      this.dialogRef.close();
    } else {
      console.log('Form is invalid');
      this._snackBar.open(
        'Wystąpił błąd: nie wszystkie pola zostały uzupełnione',
        'Zamknij',
        {
          duration: 3000,
        }
      );
    }
  }
}
