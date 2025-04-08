import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorGradesComponent } from './professor-grades.component';

describe('ProfessorGradesComponent', () => {
  let component: ProfessorGradesComponent;
  let fixture: ComponentFixture<ProfessorGradesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorGradesComponent]
    });
    fixture = TestBed.createComponent(ProfessorGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
