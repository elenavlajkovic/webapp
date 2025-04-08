import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentChooseSubjectsComponent } from './student-choose-subjects.component';

describe('StudentChooseSubjectsComponent', () => {
  let component: StudentChooseSubjectsComponent;
  let fixture: ComponentFixture<StudentChooseSubjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentChooseSubjectsComponent]
    });
    fixture = TestBed.createComponent(StudentChooseSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
