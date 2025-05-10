import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStoryModalComponent } from './add-story-modal.component';

describe('AddStoryModalComponent', () => {
  let component: AddStoryModalComponent;
  let fixture: ComponentFixture<AddStoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStoryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
