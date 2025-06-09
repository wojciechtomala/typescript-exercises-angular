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

interface ModalData {
  projectId: string;
  storyId: string;
}
@Component({
  selector: 'app-edit-story-modal',
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
  templateUrl: './edit-story-modal.component.html',
  styleUrl: './edit-story-modal.component.scss',
})
export class EditStoryModalComponent implements OnInit {
  private projectId: string | null;

  private storyId: string | null;

  public editStoryModalForm!: FormGroup;

  public readonly priorities: Priority[] = priorities;

  public readonly statuses: Status[] = statuses;

  constructor(
    public dialogRef: MatDialogRef<EditStoryModalComponent>,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public matDialogData: ModalData,
    private userService: UserService,
    private storiesService: StoriesService
  ) {
    this.projectId = this.matDialogData.projectId;
    this.storyId = this.matDialogData.storyId;
    if (!this.projectId || !this.storyId) {
      this.dialogRef.close();
    }
  }

  ngOnInit(): void {
    this.initEditStoryModalForm();
    console.log(this.storyId, this.projectId);
    this.getFormValuesByStoryId();
  }

  private async getUserId(): Promise<string | null> {
    const loggedInUser = await firstValueFrom(this.userService.loggedInUser$);
    return loggedInUser ? loggedInUser._id : null;
  }

  private initEditStoryModalForm(): void {
    this.editStoryModalForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required]],
      priority: ['', Validators.required],
      createDate: [null, Validators.required],
      status: ['', Validators.required],
      ownerId: ['', Validators.required],
    });
  }

  private getFormValuesByStoryId(): void {
    if (this.storyId) {
      this.storiesService.getStory(this.storyId).subscribe({
        next: (storyData: Story) => {
          this.editStoryModalForm.patchValue(storyData);
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  public async onSubmit(): Promise<void> {
    const ownerId = await this.getUserId();
    if (ownerId) {
      const newStoryCreateDate = new Date().toISOString().substring(0, 10);
      this.editStoryModalForm.patchValue({
        createDate: newStoryCreateDate,
        ownerId: ownerId,
      });
      if (this.editStoryModalForm.valid) {
        const updatedStory: Story = {
          ...this.editStoryModalForm.value,
          projectId: this.projectId,
          _id: this.storyId,
        };
        console.log('Submitting Story:', updatedStory);
        if (this.projectId) {
          this.storiesService.updateStory(updatedStory).subscribe({
            next: () => {
              this._snackBar.open('Sukces: zedytowano historyjkę', 'Zamknij', {
                duration: 3000,
              });
            },
            error: (error) => {
              console.error(error);
            },
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
