import { Component } from '@angular/core';
import { TodoItem } from './todo-item.model';
import { TodoService } from '../todo.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent {
  todoItems: TodoItem[] = [];

  newItemTitle: string = '';
  newItemDescription: string = '';

  editingItemId: string | null = null;
  editTitle: string = '';
  editDescription: string = '';

  constructor(private todoService: TodoService) { }

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.todoService.getAll().subscribe(items => {
      this.todoItems = items;
    });
  }

  onItemAdd() {
    if (!this.newItemTitle.trim()) return; 

    this.todoService.create(this.newItemTitle, this.newItemDescription)
      .subscribe(item => {
        this.todoItems.push(item);
        this.newItemTitle = '';
        this.newItemDescription = '';
      });
  }

  onItemDelete(item: TodoItem) {
    this.todoService.delete(item.id).subscribe(() => {
      this.todoItems = this.todoItems.filter(i => i.id !== item.id);
    });
  }

  toggleCompleted(item: TodoItem) {
    const updatedItem = { ...item, isCompleted: !item.isCompleted };
    this.todoService.update(updatedItem).subscribe(res => {
      item.isCompleted = res.isCompleted;
    });
  }

  startEdit(item: TodoItem) {
    this.editingItemId = item.id;
    this.editTitle = item.title;
    this.editDescription = item.description;
  }

  saveEdit(item: TodoItem) {
    const updatedItem = { ...item, title: this.editTitle, description: this.editDescription };
    this.todoService.update(updatedItem).subscribe(res => {
      item.title = res.title;
      item.description = res.description;
      this.editingItemId = null;
    });
  }
    
  cancelEdit() {
    this.editingItemId = null;
  }
}
