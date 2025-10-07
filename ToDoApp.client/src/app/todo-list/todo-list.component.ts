import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../todo.service';
import { TodoItem } from './todo-item.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todoItems: TodoItem[] = [];
  newItemTitle = '';
  newItemDescription = '';
  editingItem: TodoItem | null = null;
  editTitle = '';
  editDescription = '';
  showToast = false;
  toastMessage = '';
  draggedIndex: number | null = null;

  // Filtreleme & Arama
  searchTerm = '';
  filterType: 'all' | 'active' | 'completed' = 'all';

  constructor(private todoService: TodoService) { }

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.todoService.getAll().subscribe(items => this.todoItems = items);
  }

  // Filtrelenmiş ve aranmış görevler
  get filteredTodoItems(): TodoItem[] {
    let filtered = this.todoItems;

    // Filtre uygula
    if (this.filterType === 'active') {
      filtered = filtered.filter(item => !item.isCompleted);
    } else if (this.filterType === 'completed') {
      filtered = filtered.filter(item => item.isCompleted);
    }

    // Arama uygula
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search)
      );
    }

    return filtered;
  }

  // İstatistikler
  get totalCount(): number {
    return this.todoItems.length;
  }

  get completedCount(): number {
    return this.todoItems.filter(item => item.isCompleted).length;
  }

  get activeCount(): number {
    return this.todoItems.filter(item => !item.isCompleted).length;
  }

  setFilter(type: 'all' | 'active' | 'completed') {
    this.filterType = type;
  }

  onItemAdd() {
    if (!this.newItemTitle.trim()) return;

    const isDuplicate = this.todoItems.some(item =>
      item.title.trim().toLowerCase() === this.newItemTitle.trim().toLowerCase() &&
      item.description.trim().toLowerCase() === this.newItemDescription.trim().toLowerCase()
    );

    if (isDuplicate) {
      this.showToastMessage('⚠️ Bu başlık ve açıklamaya sahip bir görev zaten var!');
      return;
    }

    this.todoService.create(this.newItemTitle, this.newItemDescription).subscribe(item => {
      this.todoItems.push(item);
      this.showToastMessage(`✅ "${item.title}" eklendi!`);
      this.newItemTitle = '';
      this.newItemDescription = '';
    });
  }


  onItemDelete(item: TodoItem) {
    this.todoService.delete(item.id).subscribe(() => {
      this.todoItems = this.todoItems.filter(i => i.id !== item.id);
      this.showToastMessage(`🗑️ "${item.title}" silindi!`);
    });
  }

  toggleCompleted(item: TodoItem) {
    const updatedItem = { ...item, isCompleted: !item.isCompleted };
    this.todoService.update(updatedItem).subscribe(res => {
      item.isCompleted = res.isCompleted;
      const status = res.isCompleted ? 'tamamlandı' : 'işareti kaldırıldı';
      this.showToastMessage(`✅ Görev ${status}!`);
    });
  }

  onDragStart(index: number) {
    this.draggedIndex = index;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault();
    if (this.draggedIndex !== null && this.draggedIndex !== dropIndex) {
      const draggedItem = this.todoItems[this.draggedIndex];
      this.todoItems.splice(this.draggedIndex, 1);
      this.todoItems.splice(dropIndex, 0, draggedItem);
      this.showToastMessage('📋 Sıralama güncellendi!');
    }
    this.draggedIndex = null;
  }

  onDragEnd() {
    this.draggedIndex = null;
  }

  openEditModal(item: TodoItem) {
    this.editingItem = item;
    this.editTitle = item.title;
    this.editDescription = item.description;
  }

  closeEditModal() {
    this.editingItem = null;
  }

  saveEditModal() {
    if (!this.editingItem) return;

    const isDuplicate = this.todoItems.some(item =>
      item.id !== this.editingItem!.id &&
      item.title.trim().toLowerCase() === this.editTitle.trim().toLowerCase() &&
      item.description.trim().toLowerCase() === this.editDescription.trim().toLowerCase()
    );

    if (isDuplicate) {
      this.showToastMessage('⚠️ Bu başlık ve açıklamaya sahip bir görev zaten var!');
      return;
    }

    const updatedItem = {
      ...this.editingItem,
      title: this.editTitle,
      description: this.editDescription
    };

    this.todoService.update(updatedItem).subscribe(res => {
      this.editingItem!.title = res.title;
      this.editingItem!.description = res.description;
      this.showToastMessage(`✏️ "${res.title}" güncellendi!`);
      this.editingItem = null;
    });
  }

  showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 2000);
  }
}
