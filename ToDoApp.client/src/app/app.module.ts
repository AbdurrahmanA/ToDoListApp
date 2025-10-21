import { NgModule, LOCALE_ID } from '@angular/core'; // <-- 1. LOCALE_ID'yi import edin
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Component'ler
import { TodoListComponent } from './todo-list/todo-list.component';
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

// Servisler ve Kütüphaneler
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AuthInterceptor } from './auth.interceptor';

// --- 2. TÜRKÇELEŞTİRME İÇİN BU BLOKU EKLEYİN ---
import { registerLocaleData } from '@angular/common';
import localeTr from '@angular/common/locales/tr';

// Türkçe lokal verisini Angular'a tanıtın
registerLocaleData(localeTr);
// --- BİTİŞ ---

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule,
    
    // Standalone component'ler
    TodoListComponent, 
    CalendarViewComponent,
    EmailConfirmationComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,

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
    },
    // --- 3. TÜRKÇELEŞTİRME İÇİN BU PROVIDER'I EKLEYİN ---
    // Uygulamanın varsayılan dilini 'tr-TR' (Türkçe) olarak ayarlar
    { provide: LOCALE_ID, useValue: 'tr-TR' }
    // --- BİTİŞ ---
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }