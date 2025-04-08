import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentChangepasswordComponent } from './student-changepassword.component';

describe('StudentChangepasswordComponent', () => {
  let component: StudentChangepasswordComponent;
  let fixture: ComponentFixture<StudentChangepasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentChangepasswordComponent]
    });
    fixture = TestBed.createComponent(StudentChangepasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
