import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorChangepasswordComponent } from './professor-changepassword.component';

describe('ProfessorChangepasswordComponent', () => {
  let component: ProfessorChangepasswordComponent;
  let fixture: ComponentFixture<ProfessorChangepasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorChangepasswordComponent]
    });
    fixture = TestBed.createComponent(ProfessorChangepasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
