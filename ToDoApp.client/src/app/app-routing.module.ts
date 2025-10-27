import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { TodoListComponent } from './features/todo/components/todo-list/todo-list.component';
import { CalendarViewComponent } from './features/calendar/components/calendar-view/calendar-view.component';
import { ProfileComponent } from './features/profile/components/profile/profile.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { RegisterComponent } from './features/auth/components/register/register.component';
import { EmailConfirmationComponent } from './features/auth/components/email-confirmation/email-confirmation.component';
import { ForgotPasswordComponent } from './features/auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/components/reset-password/reset-password.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'confirm-email', component: EmailConfirmationComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },

  { 
    path: '', 
    component: MainLayoutComponent, 
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'tasks/all', pathMatch: 'full' },
      { path: 'tasks', redirectTo: 'tasks/all', pathMatch: 'full' },
      { path: 'tasks/:filter', component: TodoListComponent }, 
      { path: 'calendar', component: CalendarViewComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }