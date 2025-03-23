import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemanticBrowserComponent } from './semantic-browser.component';

describe('SemanticBrowserComponent', () => {
  let component: SemanticBrowserComponent;
  let fixture: ComponentFixture<SemanticBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SemanticBrowserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SemanticBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
