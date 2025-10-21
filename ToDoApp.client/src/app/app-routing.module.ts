import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { LoginComponent } from './login/login.component'; // EKLENDİ
import { RegisterComponent } from './register/register.component'; // EKLENDİ
import { ResetPasswordComponent } from './reset-password/reset-password.component'; // EKLENDİ
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from './auth.guard'; 

const routes: Routes = [
  // GÜNCELLENDİ: Ana sayfa artık login'e yönlendiriyor
  { path: '', redirectTo: '/login', pathMatch: 'full' }, 
  
  // GÜNCELLENDİ: Bu rotalar artık AuthGuard tarafından korunuyor
  { path: 'tasks', component: TodoListComponent, canActivate: [AuthGuard] },
  { path: 'calendar', component: CalendarViewComponent, canActivate: [AuthGuard] },
  
  // Herkesin erişebileceği rotalar
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirm-email', component: EmailConfirmationComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }