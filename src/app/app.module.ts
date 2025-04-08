import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { RegistrationProfessorComponent } from './registration-professor/registration-professor.component';
import { StudentMainComponent } from './student-main/student-main.component';
import { ProfessorMainComponent } from './professor-main/professor-main.component';
import { AdminExamsComponent } from './admin-subjects/admin-exams.component';
import { AdminExamComponent } from './admin-exam/admin-exam.component';
import { AdminProfessorviewComponent } from './admin-professorview/admin-professorview.component';
import { AdminStudentviewComponent } from './admin-studentview/admin-studentview.component';
import { ProfessorExamsComponent } from './professor-exams/professor-exams.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ProfessorChangepasswordComponent } from './professor-changepassword/professor-changepassword.component';
import { AdminTestViewComponent } from './admin-testview/admin-test-view.component';
import { ProfessorInfoComponent } from './professor-info/professor-info.component';
import { StudentChooseSubjectsComponent } from './student-choose-subjects/student-choose-subjects.component';
import { StudentExamregistrationComponent } from './student-examregistration/student-examregistration.component';
import { ProfessorGradesComponent } from './professor-grades/professor-grades.component';
import { StudentGradesComponent } from './student-grades/student-grades.component';
import { StudentChangepasswordComponent } from './student-changepassword/student-changepassword.component';
import { ProfessorTimetableComponent } from './professor-timetable/professor-timetable.component';
import { StudentTimetableComponent } from './student-timetable/student-timetable.component';
import { StudentPaymentsComponent } from './student-payments/student-payments.component';
import { AdminPaymentsComponent } from './admin-payments/admin-payments.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    LoginAdminComponent,
    AdminMainComponent,
    RegistrationProfessorComponent,
    StudentMainComponent,
    ProfessorMainComponent,
    AdminExamsComponent,
    AdminExamComponent,
    AdminProfessorviewComponent,
    AdminStudentviewComponent,
    ProfessorExamsComponent,
    ProfessorChangepasswordComponent,
    AdminTestViewComponent,
    ProfessorInfoComponent,
    StudentChooseSubjectsComponent,
    StudentExamregistrationComponent,
    ProfessorGradesComponent,
    StudentGradesComponent,
    StudentChangepasswordComponent,
    ProfessorTimetableComponent,
    StudentTimetableComponent,
    StudentPaymentsComponent,
    AdminPaymentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    FullCalendarModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
