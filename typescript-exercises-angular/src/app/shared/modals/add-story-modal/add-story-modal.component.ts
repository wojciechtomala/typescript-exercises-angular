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
  public addStoryModalForm!: FormGroup;

  public priorities: Priority[] = ['Low', 'Mid', 'High'];
  public statuses: Status[] = ['Todo', 'Doing', 'Done'];

  constructor(
    public dialogRef: MatDialogRef<AddStoryModalComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initAddStoryModalForm();
  }

  private initAddStoryModalForm(): void {
    this.addStoryModalForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required]],
      priority: ['Mid', Validators.required],
      projectId: [null, [Validators.required, Validators.min(1)]],
      createDate: [
        new Date().toISOString().substring(0, 10),
        Validators.required,
      ],
      status: ['Todo', Validators.required],
      ownerId: ['', Validators.required],
    });
  }

  public onSubmit(): void {
    if (this.addStoryModalForm.valid) {
      const newStory: NewStory = this.addStoryModalForm.value;
      console.log('Submitting Story:', newStory);
    } else {
      console.log('Form is invalid');
    }
  }
}
