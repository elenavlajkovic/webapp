import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationProfessorComponent } from './registration-professor.component';

describe('RegistrationProfessorComponent', () => {
  let component: RegistrationProfessorComponent;
  let fixture: ComponentFixture<RegistrationProfessorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationProfessorComponent]
    });
    fixture = TestBed.createComponent(RegistrationProfessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
