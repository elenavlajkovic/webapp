import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentExamregistrationComponent } from './student-examregistration.component';

describe('StudentExamregistrationComponent', () => {
  let component: StudentExamregistrationComponent;
  let fixture: ComponentFixture<StudentExamregistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentExamregistrationComponent]
    });
    fixture = TestBed.createComponent(StudentExamregistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
