import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TodoItem } from '../../models/todo-item.model';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {

  @Input() task!: TodoItem;

  @Output() onDelete = new EventEmitter<TodoItem>();
  @Output() onToggleComplete = new EventEmitter<TodoItem>();
  @Output() onOpenEdit = new EventEmitter<TodoItem>();

  isOverdue(item: TodoItem): boolean {
    if (item.isCompleted || !item.dueDate) {
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(item.dueDate).getTime() < today.getTime();
  }

  getRecurrenceTitle(rule: string | undefined): string {
    switch (rule) {
      case 'daily': return 'Günlük Tekrar';
      case 'weekly': return 'Haftalık Tekrar';
      case 'monthly': return 'Aylık Görevler';
      default: return 'Tekrarlamayan Görev';
    }
  }

  deleteClicked(): void {
    this.onDelete.emit(this.task);
  }

  toggleCompleteClicked(): void {
    this.onToggleComplete.emit(this.task);
  }

  openEditClicked(): void {
    this.onOpenEdit.emit(this.task);
  }
}