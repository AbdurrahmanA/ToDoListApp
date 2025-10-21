import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TodoItem } from './todo-list/todo-item.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'https://localhost:7261/api/ToDo';

  constructor(private http: HttpClient) { }

  getAll(): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(this.apiUrl);
  }

  create(
    title: string,
    description: string,
    isCompleted: boolean,
    dueDate?: Date,
    recurrenceRule?: string
  ): Observable<TodoItem> {
    const newItem = {
      Title: title,
      Description: description,
      IsCompleted: isCompleted,
      DueDate: dueDate || null,
      RecurrenceRule: recurrenceRule || 'none'
    };
    console.log('API\'ye gönderilen veri:', newItem);
    return this.http.post<TodoItem>(this.apiUrl, newItem);
  }

  update(item: TodoItem): Observable<TodoItem> {
    const updateData = {
      Title: item.title,
      Description: item.description,
      IsCompleted: item.isCompleted,
      DueDate: item.dueDate,
      RecurrenceRule: item.recurrenceRule
    };
    return this.http.put<TodoItem>(`${this.apiUrl}/${item.id}`, updateData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}