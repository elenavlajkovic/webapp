import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfessorviewComponent } from './admin-professorview.component';

describe('AdminProfessorviewComponent', () => {
  let component: AdminProfessorviewComponent;
  let fixture: ComponentFixture<AdminProfessorviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminProfessorviewComponent]
    });
    fixture = TestBed.createComponent(AdminProfessorviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
