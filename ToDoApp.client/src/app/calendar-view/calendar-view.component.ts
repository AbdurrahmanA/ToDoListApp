import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TodoService } from '../todo.service';
import { TodoItem } from '../todo-list/todo-item.model';

// Sadece ana modülleri ve tipleri import ediyoruz
import { CalendarEvent, CalendarView, CalendarMonthViewDay, CalendarModule } from 'angular-calendar'; 

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  
  // imports dizisini en sade haline geri alıyoruz
  imports: [
    CommonModule, 
    RouterLink, 
    DatePipe,
    CalendarModule // Sadece ana modülü kullanıyoruz
  ],
  
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  
  // events dizisini basit tipte tutuyoruz
  events: CalendarEvent[] = [];

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.todoService.getAll().subscribe((items: TodoItem[]) => {
      this.events = items
        .filter(item => item.dueDate)
        .map((item: TodoItem) => {
          return {
            start: new Date(item.dueDate!),
            title: item.title,
            // Renkleri kütüphanenin varsayılan renklerine geri döndürüyoruz
            color: item.isCompleted ? { primary: '#adb5bd', secondary: '#e9ecef' } : { primary: '#3498DB', secondary: '#D6EAF8' }, 
            allDay: true, 
            meta: item, // meta'yı saklamaya devam edebiliriz, zararı yok
          };
        });
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  // Ay görünümünden güne tıklama fonksiyonu
  dayClicked(day: CalendarMonthViewDay): void {
    this.viewDate = day.date;
    this.view = CalendarView.Day;
  }

  // Diğer tüm yardımcı metotları (getIconForRule, isOverdue) kaldırdık.
}