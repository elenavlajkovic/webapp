import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { RegistrationProfessorComponent } from './registration-professor/registration-professor.component';
import { ProfessorMainComponent } from './professor-main/professor-main.component';
import { StudentMainComponent } from './student-main/student-main.component';
import { AdminGuard } from './guard/admin-guard';
import { AdminExamsComponent } from './admin-subjects/admin-exams.component';
import { AdminExamComponent } from './admin-exam/admin-exam.component';
import { AdminProfessorviewComponent } from './admin-professorview/admin-professorview.component';
import { AdminStudentviewComponent } from './admin-studentview/admin-studentview.component';
import { ProfessorExamsComponent } from './professor-exams/professor-exams.component';
import { ProfessorGuard } from './guard/professor-guard';
import { ProfessorChangepasswordComponent } from './professor-changepassword/professor-changepassword.component';
import { AdminTestViewComponent } from './admin-testview/admin-test-view.component';
import { ProfessorInfoComponent } from './professor-info/professor-info.component';
import { StudentChooseSubjectsComponent } from './student-choose-subjects/student-choose-subjects.component';
import { StudentExamregistrationComponent } from './student-examregistration/student-examregistration.component';
import { ProfessorGradesComponent } from './professor-grades/professor-grades.component';
import { StudentGradesComponent } from './student-grades/student-grades.component';
import { StudentGuard } from './guard/student-guard';
import { StudentChangepasswordComponent } from './student-changepassword/student-changepassword.component';
import { ProfessorTimetableComponent } from './professor-timetable/professor-timetable.component';
import { StudentTimetableComponent } from './student-timetable/student-timetable.component';
import { StudentPaymentsComponent } from './student-payments/student-payments.component';
import { AdminPaymentsComponent } from './admin-payments/admin-payments.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent, canActivate: [AdminGuard]},
  {path: 'admin', component: LoginAdminComponent},
  {path: 'adminMain', component: AdminMainComponent, canActivate: [AdminGuard]},
  {path: 'registrationProfessor', component: RegistrationProfessorComponent, canActivate: [AdminGuard]},
  {path: 'student', component: StudentMainComponent, canActivate: [StudentGuard]},
  {path: 'adminSubjects', component: AdminExamsComponent, canActivate: [AdminGuard]},
  {path: 'adminExams', component: AdminExamComponent, canActivate: [AdminGuard]},
  {path: 'adminProfView', component: AdminProfessorviewComponent, canActivate: [AdminGuard]},
  {path: 'adminStudView', component: AdminStudentviewComponent, canActivate: [AdminGuard]},
  {path: 'adminPayments', component: AdminPaymentsComponent, canActivate: [AdminGuard]},
  {path: 'professor', component: ProfessorMainComponent, canActivate: [ProfessorGuard]},
  {path: 'professorExams', component: ProfessorExamsComponent, canActivate: [ProfessorGuard]},
  {path: 'professorPassword', component: ProfessorChangepasswordComponent, canActivate: [ProfessorGuard]},
  {path: 'adminTestView', component: AdminTestViewComponent, canActivate: [AdminGuard]},
  {path: 'professorInfo', component: ProfessorInfoComponent, canActivate: [ProfessorGuard]},
  {path: 'professorGrades', component: ProfessorGradesComponent, canActivate: [ProfessorGuard]},
  {path: 'professorTimeTable', component: ProfessorTimetableComponent, canActivate: [ProfessorGuard]},
  {path: 'studentChooseSubjects', component: StudentChooseSubjectsComponent, canActivate: [StudentGuard]},
  {path: 'studentExamReg', component: StudentExamregistrationComponent, canActivate: [StudentGuard]},
  {path: 'studentGrades', component: StudentGradesComponent, canActivate: [StudentGuard]},
  {path: 'studentPassword', component: StudentChangepasswordComponent, canActivate: [StudentGuard]},
  {path: 'studentTimeTable', component: StudentTimetableComponent, canActivate: [StudentGuard]},
  {path: 'studentPayments', component: StudentPaymentsComponent, canActivate: [StudentGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
