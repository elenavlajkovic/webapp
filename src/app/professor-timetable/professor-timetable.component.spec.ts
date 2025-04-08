import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorTimetableComponent } from './professor-timetable.component';

describe('ProfessorTimetableComponent', () => {
  let component: ProfessorTimetableComponent;
  let fixture: ComponentFixture<ProfessorTimetableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorTimetableComponent]
    });
    fixture = TestBed.createComponent(ProfessorTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
