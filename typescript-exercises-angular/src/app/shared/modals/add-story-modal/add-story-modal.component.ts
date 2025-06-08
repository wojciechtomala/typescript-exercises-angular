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
import { NewStory, Priority, Status } from '../../models/story.model';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { priorities, statuses } from '../../constants/constants';
import { UserService } from '../../services/userService/user.service';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoriesService } from '../../services/storiesService/stories-service.service';

interface ModalData {
  projectId: number;
}
@Component({
  selector: 'app-add-story-modal',
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
  templateUrl: './add-story-modal.component.html',
  styleUrl: './add-story-modal.component.scss',
})
export class AddStoryModalComponent implements OnInit {
  private projectId: number | null;

  public addStoryModalForm!: FormGroup;

  public readonly priorities: Priority[] = priorities;

  public readonly statuses: Status[] = statuses;

  constructor(
    public dialogRef: MatDialogRef<AddStoryModalComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public matDialogData: ModalData,
    private userService: UserService,
    private storiesService: StoriesService
  ) {
    this.projectId = this.matDialogData.projectId;
    if (typeof this.projectId !== 'number') {
      this.dialogRef.close();
    }
  }

  ngOnInit(): void {
    this.initAddStoryModalForm();
  }

  private async getUserId(): Promise<number> {
    const loggedInUser = await firstValueFrom(this.userService.loggedInUser$);
    return loggedInUser.id;
  }

  private initAddStoryModalForm(): void {
    this.addStoryModalForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required]],
      priority: ['Mid', Validators.required],
      createDate: [null, Validators.required],
      status: ['Todo', Validators.required],
      ownerId: ['', Validators.required],
    });
  }

  public async onSubmit(): Promise<void> {
    const ownerId = await this.getUserId();
    if (ownerId) {
      const newStoryCreateDate = new Date().toISOString().substring(0, 10);
      this.addStoryModalForm.patchValue({
        createDate: newStoryCreateDate,
        ownerId: ownerId,
      });
      if (this.addStoryModalForm.valid) {
        const newStory: NewStory = {
          ...this.addStoryModalForm.value,
          projectId: this.projectId,
          tasks: [],
        };
        console.log('Submitting Story:', newStory);
        if (typeof this.projectId === 'number') {
          this.storiesService.createStory(this.projectId, newStory);
          this._snackBar.open('Sukces: utworzono nową historyjkę', 'Zamknij', {
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
    } else {
      console.error('No user data');
      this._snackBar.open(
        'Wystąpił błąd: Brak informacji o użytkowniku',
        'Zamknij',
        {
          duration: 3000,
        }
      );
    }
  }
}
