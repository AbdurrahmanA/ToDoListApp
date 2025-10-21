import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../todo.service';
import { TodoItem } from './todo-item.model';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink 
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  
  todoItems: TodoItem[] = [];
  newItemTitle = '';
  newItemDescription = '';
  newItemDueDate: string = '';
  newItemRecurrence: 'none' | 'daily' | 'weekly' | 'monthly' = 'none';
  newItemIsCompleted = false;

  editingItem: TodoItem | null = null;
  editTitle = '';
  editDescription = '';
  editDueDate: string = '';
  editRecurrence: 'none' | 'daily' | 'weekly' | 'monthly' = 'none';

  showToast = false;
  toastMessage = '';
  draggedIndex: number | null = null;

  searchTerm = '';
  filterType: 'all' | 'active' | 'completed' | 'today' | 'upcoming' | 'daily' | 'weekly' | 'monthly' = 'all';

  isCreatingNewItem: boolean = false;
  
  isNotificationPanelOpen: boolean = false;

  private readonly titleMap: { [key: string]: string } = {
    all: 'Tüm Görevler',
    active: 'Aktif Görevler',
    completed: 'Tamamlanmış Görevler',
    today: 'Bugün Yapılacaklar',
    upcoming: 'Yaklaşan Görevler',
    daily: 'Günlük Görevler',
    weekly: 'Haftalık Görevler',
    monthly: 'Aylık Görevler'
  };
  get sectionTitle(): string {
    return this.titleMap[this.filterType] || 'Görev Akışı';
  }

  constructor(
    private todoService: TodoService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setFilter('all');
    this.loadItems();
  }

  loadItems() {
    this.todoService.getAll().subscribe(items => this.todoItems = items);
  }

  get todayTasks(): TodoItem[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.todoItems.filter(item => {
      if (!item.dueDate || item.isCompleted) return false;
      
      const dueDate = new Date(item.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    });
  }

  get todayTaskCount(): number {
    return this.todayTasks.length;
  }

  toggleNotificationPanel(event: MouseEvent): void {
    this.isNotificationPanelOpen = !this.isNotificationPanelOpen;
    event.stopPropagation();
  }

  @HostListener('document:click')
  closeNotificationPanel(): void {
    this.isNotificationPanelOpen = false;
  }

  get filteredTodoItems(): TodoItem[] {
    let filtered = this.todoItems;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (this.filterType === 'active') {
      filtered = filtered.filter(item => !item.isCompleted);
    } else if (this.filterType === 'completed') {
      filtered = filtered.filter(item => item.isCompleted);
    } else if (this.filterType === 'today') {
      filtered = filtered.filter(item => {
        if (!item.dueDate) return false;
        const dueDate = new Date(item.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime() && !item.isCompleted;
      });
    } else if (this.filterType === 'upcoming') {
      filtered = filtered.filter(item => {
        if (!item.dueDate) return false;
        const dueDate = new Date(item.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() > today.getTime() && !item.isCompleted;
      });
    }
    else if (this.filterType === 'daily') {
      filtered = filtered.filter(item => item.recurrenceRule === 'daily' && !item.isCompleted);
    } else if (this.filterType === 'weekly') {
      filtered = filtered.filter(item => item.recurrenceRule === 'weekly' && !item.isCompleted);
    } else if (this.filterType === 'monthly') {
      filtered = filtered.filter(item => item.recurrenceRule === 'monthly' && !item.isCompleted);
    }

    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(search) ||
        (item.description && item.description.toLowerCase().includes(search))
      );
    }

    return filtered;
  }

  get totalCount(): number { return this.todoItems.length; }
  get completedCount(): number { return this.todoItems.filter(item => item.isCompleted).length; }
  get activeCount(): number { return this.todoItems.filter(item => !item.isCompleted).length; }

  setFilter(type: 'all' | 'active' | 'completed' | 'today' | 'upcoming' | 'daily' | 'weekly' | 'monthly') {
    this.filterType = type;
  }

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
      case 'monthly': return 'Aylık Tekrar';
      default: return 'Tekrarlamayan Görev';
    }
  }

  toggleCreateForm() {
    this.isCreatingNewItem = !this.isCreatingNewItem;
    if (!this.isCreatingNewItem) {
      this.closeCreateForm();
    }
  }

  closeCreateForm() {
    this.isCreatingNewItem = false;
    this.newItemTitle = '';
    this.newItemDescription = '';
    this.newItemDueDate = '';
    this.newItemRecurrence = 'none';
    this.newItemIsCompleted = false;
  }

  onItemAddAndClose() {
    if (!this.newItemTitle.trim()) {
      this.showToastMessage('⚠️ Başlık boş bırakılamaz.');
      return;
    }

    const isDuplicate = this.todoItems.some(item =>
      item.title.trim().toLowerCase() === this.newItemTitle.trim().toLowerCase() &&
      item.description.trim().toLowerCase() === this.newItemDescription.trim().toLowerCase()
    );

    if (isDuplicate) {
      this.showToastMessage('⚠️ Bu görev zaten var!');
      return;
    }

    const dueDate = this.newItemDueDate ? new Date(this.newItemDueDate) : undefined;
    this.todoService.create(
      this.newItemTitle,
      this.newItemDescription,
      this.newItemIsCompleted,
      dueDate,
      this.newItemRecurrence
    ).subscribe(item => {
      this.todoItems.push(item);
      this.showToastMessage(`✅ "${item.title}" eklendi!`);
      this.closeCreateForm();
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
      const originalItem = this.todoItems.find(i => i.id === res.id);
      if (originalItem) {
        originalItem.isCompleted = res.isCompleted;
      }
      const status = res.isCompleted ? 'tamamlandı' : 'işareti kaldırıldı';
      this.showToastMessage(`✅ Görev ${status}!`);
    });
  }

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }

  onDragStart(index: number) { this.draggedIndex = index; }
  onDragOver(event: DragEvent) { event.preventDefault(); }
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
  onDragEnd() { this.draggedIndex = null; }

  openEditModal(item: TodoItem) {
    this.editingItem = { ...item };
    this.editTitle = item.title;
    this.editDescription = item.description;
    this.editDueDate = item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : '';
    this.editRecurrence = item.recurrenceRule || 'none';
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
      description: this.editDescription,
      dueDate: this.editDueDate ? new Date(this.editDueDate) : undefined,
      recurrenceRule: this.editRecurrence
    };

    this.todoService.update(updatedItem).subscribe(res => {
      const index = this.todoItems.findIndex(i => i.id === res.id);
      if (index > -1) {
        this.todoItems[index] = res;
      }
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