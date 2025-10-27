import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TodoListComponent } from '@app/features/todo/components/todo-list/todo-list.component';
import { CalendarViewComponent } from '@app/features/calendar/components/calendar-view/calendar-view.component';
import { EmailConfirmationComponent } from '@app/features/auth/components/email-confirmation/email-confirmation.component';
import { LoginComponent } from '@app/features/auth/components/login/login.component';
import { RegisterComponent } from '@app/features/auth/components/register/register.component';
import { ResetPasswordComponent } from '@app/features/auth/components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from '@app/features/auth/components/forgot-password/forgot-password.component';
import { MainLayoutComponent } from '@app/shared/components/main-layout/main-layout.component';
import { ProfileComponent } from '@app/features/profile/components/profile/profile.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AuthInterceptor } from '@app/core/interceptors/auth.interceptor';
import { TodoItemComponent } from './features/todo/components/todo-item/todo-item.component';

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TodoItemComponent,
    TodoListComponent,
    CalendarViewComponent,
    EmailConfirmationComponent,
    LoginComponent,
    RegisterComponent,
    TodoItemComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    MainLayoutComponent,
    ProfileComponent,

    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }