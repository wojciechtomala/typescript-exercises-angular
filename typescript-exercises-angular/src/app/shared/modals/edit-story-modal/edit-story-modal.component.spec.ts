import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditStoryModalComponent } from './edit-story-modal.component';

describe('AddStoryModalComponent', () => {
  let component: EditStoryModalComponent;
  let fixture: ComponentFixture<EditStoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStoryModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditStoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
