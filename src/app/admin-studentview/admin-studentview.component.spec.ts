import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStudentviewComponent } from './admin-studentview.component';

describe('AdminStudentviewComponent', () => {
  let component: AdminStudentviewComponent;
  let fixture: ComponentFixture<AdminStudentviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminStudentviewComponent]
    });
    fixture = TestBed.createComponent(AdminStudentviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
