import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorMainComponent } from './professor-main.component';

describe('ProfessorMainComponent', () => {
  let component: ProfessorMainComponent;
  let fixture: ComponentFixture<ProfessorMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorMainComponent]
    });
    fixture = TestBed.createComponent(ProfessorMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
