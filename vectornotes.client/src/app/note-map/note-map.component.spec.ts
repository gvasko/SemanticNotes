import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteMapComponent } from './note-map.component';

describe('NoteMapComponent', () => {
  let component: NoteMapComponent;
  let fixture: ComponentFixture<NoteMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoteMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
