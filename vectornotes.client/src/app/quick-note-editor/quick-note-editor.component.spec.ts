import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickNoteEditorComponent } from './quick-note-editor.component';

describe('QuickNoteEditorComponent', () => {
  let component: QuickNoteEditorComponent;
  let fixture: ComponentFixture<QuickNoteEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickNoteEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickNoteEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
