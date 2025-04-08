import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMainComponent } from './student-main.component';

describe('StudentMainComponent', () => {
  let component: StudentMainComponent;
  let fixture: ComponentFixture<StudentMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentMainComponent]
    });
    fixture = TestBed.createComponent(StudentMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
