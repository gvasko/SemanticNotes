import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllNotesViewComponent } from './all-notes-view.component';

describe('AllNotesViewComponent', () => {
  let component: AllNotesViewComponent;
  let fixture: ComponentFixture<AllNotesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllNotesViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllNotesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
