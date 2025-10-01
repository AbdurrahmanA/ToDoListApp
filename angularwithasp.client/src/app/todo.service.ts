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

  create(title: string, description: string): Observable<TodoItem> {
    const newItem = { title, description, isCompleted: false };
    return this.http.post<TodoItem>(this.apiUrl, newItem);
  }

  update(item: TodoItem): Observable<TodoItem> {
    const updateData = {
      title: item.title,
      description: item.description,
      isCompleted: item.isCompleted
    };
    return this.http.put<TodoItem>(`${this.apiUrl}/${item.id}`, updateData);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
