import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemanticNavigatorComponent } from './semantic-navigator.component';

describe('SemanticNavigatorComponent', () => {
  let component: SemanticNavigatorComponent;
  let fixture: ComponentFixture<SemanticNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SemanticNavigatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemanticNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
