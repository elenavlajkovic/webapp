import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorInfoComponent } from './professor-info.component';

describe('ProfessorInfoComponent', () => {
  let component: ProfessorInfoComponent;
  let fixture: ComponentFixture<ProfessorInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorInfoComponent]
    });
    fixture = TestBed.createComponent(ProfessorInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
