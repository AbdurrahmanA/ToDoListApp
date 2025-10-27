import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TodoItem } from '../../../todo/models/todo-item.model';
import { CalendarEvent, CalendarView, CalendarMonthViewDay, CalendarModule } from 'angular-calendar'; 
import { TodoService } from '../../../todo/services/todo.service';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  
  imports: [
    CommonModule, 
    RouterLink, 
    DatePipe,
    CalendarModule 
  ],
  
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.scss']
})
export class CalendarViewComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  
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
            color: item.isCompleted ? { primary: '#adb5bd', secondary: '#e9ecef' } : { primary: '#3498DB', secondary: '#D6EAF8' }, 
            allDay: true, 
            meta: item,
          };
        });
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  dayClicked(day: CalendarMonthViewDay): void {
    this.viewDate = day.date;
    this.view = CalendarView.Day;
  }

}