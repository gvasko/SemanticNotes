import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTagDialogComponent } from './create-tag-dialog.component';

describe('CreateTagDialogComponent', () => {
  let component: CreateTagDialogComponent;
  let fixture: ComponentFixture<CreateTagDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTagDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTagDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
