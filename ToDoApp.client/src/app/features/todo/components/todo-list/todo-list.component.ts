import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TodoService } from '@app/features/todo/services/todo.service';
import { TodoItem } from '@app/features/todo/models/todo-item.model';
import { UiStateService } from '@app/shared/services/ui-state.service';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { AuthService } from '@app/features/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TodoItemComponent],
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

  draggedIndex: number | null = null;
  searchTerm = '';
  filterType: 'all' | 'active' | 'completed' | 'today' | 'upcoming' | 'daily' | 'weekly' | 'monthly' = 'all';
  isCreatingNewItem: boolean = false; 

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
    private uiStateService: UiStateService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.loadItems();

    this.route.paramMap.subscribe(params => {
      const filter = params.get('filter');
      this.setFilter(filter as any || 'all');
    });

    this.uiStateService.searchTerm$.subscribe(term => {
      this.searchTerm = term;
    });

    this.uiStateService.toggleCreateForm$.subscribe(() => {
      this.toggleCreateForm();
    });
  }

  loadItems() {
    this.todoService.getAll().subscribe((items: TodoItem[]) => this.todoItems = items);
  }

  setFilter(type: 'all' | 'active' | 'completed' | 'today' | 'upcoming' | 'daily' | 'weekly' | 'monthly') {
    this.filterType = type;
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

    if (this.searchTerm && this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(search) ||
        (item.description && item.description.toLowerCase().includes(search))
      );
    }

    return filtered;
  }

  toggleCreateForm() {
    this.isCreatingNewItem = !this.isCreatingNewItem;
  }

  closeCreateForm() {
    this.isCreatingNewItem = false;
    this.newItemTitle = '';
    this.newItemDescription = '';
    this.newItemDueDate = '';
    this.newItemRecurrence = 'none';
    this.newItemIsCompleted = false;
  }

  showToastMessage(message: string) {
    this.uiStateService.showToast(message);
  }

  onItemAddAndClose() {
    if (!this.newItemTitle.trim()) {
      this.showToastMessage('⚠️ Başlık boş bırakılamaz.');
      return;
    }

    const isDuplicate = this.todoItems.some(item =>
      item.title.trim().toLowerCase() === this.newItemTitle.trim().toLowerCase() &&
      (item.description || '').trim().toLowerCase() === (this.newItemDescription || '').trim().toLowerCase()
    );

    if (isDuplicate) {
      this.showToastMessage('⚠️ Bu görev zaten mevcut!');
      return;
    }

    const dueDate = this.newItemDueDate ? new Date(this.newItemDueDate) : undefined;
    this.todoService.create(
      this.newItemTitle,
      this.newItemDescription,
      this.newItemIsCompleted,
      dueDate,
      this.newItemRecurrence
    ).subscribe({
      next: (item: TodoItem) => {
        this.todoItems.push(item);
        this.showToastMessage(`✅ "${item.title}" eklendi!`);
        this.closeCreateForm();
        this.uiStateService.notifyTaskListUpdated();
      },
      error: (err: any) => {


        if (err.status === 400 && err.error?.errors) {
          let customErrorMessages: string[] = [];

          for (const key in err.error.errors) {
            if (err.error.errors.hasOwnProperty(key)) {
              const messages: string[] = err.error.errors[key];
              const lowerKey = key.toLowerCase();

              for (const msg of messages) {
                const lowerMsg = msg.toLowerCase();

                if (lowerKey === 'title' && (lowerMsg.includes('100') || lowerMsg.includes('karakter') || lowerMsg.includes('length') || lowerMsg.includes('maximum'))) {
                  customErrorMessages.push('Başlıkta 100 karakter sınırını aşmamalısınız.');
                }
                else if (lowerKey === 'description' && (lowerMsg.includes('500') || lowerMsg.includes('karakter') || lowerMsg.includes('length') || lowerMsg.includes('maximum'))) {
                  customErrorMessages.push('Açıklamada 500 karakter sınırını aşmamalısınız.');
                }
                else {
                  customErrorMessages.push(msg);
                }
              }
            }
          }

          this.showToastMessage(`❌ Hata:\n${customErrorMessages.join('\n')}`);
        }
        else if (err.status === 500) {
          const errorMessage = typeof err.error === 'string' ? err.error : '';

          if (errorMessage.includes('Description') && errorMessage.includes('truncated')) {
            this.showToastMessage('❌ Hata: Açıklamada 500 karakter sınırını aşmamalısınız.');
          }
          else if (errorMessage.includes('Title') && errorMessage.includes('truncated')) {
            this.showToastMessage('❌ Hata: Başlıkta 100 karakter sınırını aşmamalısınız.');
          }
          else {
            this.showToastMessage('❌ Hata: Sunucuda beklenmeyen bir hata oluştu.');
          }
        }
        else if (err.error?.title) {
          this.showToastMessage(`❌ Hata: ${err.error.title}`);
        }
        else {
          this.showToastMessage('❌ Hata: Görev eklenemedi.');
        }

        console.error('Add item error:', err);
      }
    });
  }

  onItemDelete(item: TodoItem) {
    this.todoService.delete(item.id).subscribe(() => {
      this.todoItems = this.todoItems.filter(i => i.id !== item.id);
      this.showToastMessage(`🗑️ "${item.title}" silindi!`);
      this.uiStateService.notifyTaskListUpdated();
    });
  }

  toggleCompleted(item: TodoItem) {
    const updatedItem = { ...item, isCompleted: !item.isCompleted };
    this.todoService.update(updatedItem).subscribe((res: TodoItem) => {
      const originalItem = this.todoItems.find(i => i.id === res.id);
      if (originalItem) {
        originalItem.isCompleted = res.isCompleted;
      }
      const status = res.isCompleted ? 'tamamlandı' : 'işareti kaldırıldı';
      this.showToastMessage(`✅ Görev ${status}!`);
      this.uiStateService.notifyTaskListUpdated();
    });
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
    if (item.dueDate) {
      const date = new Date(item.dueDate);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      this.editDueDate = `${year}-${month}-${day}`;
    } else {
      this.editDueDate = '';
    }
    this.editRecurrence = item.recurrenceRule || 'none';
  }

  closeEditModal() {
    this.editingItem = null;
  }

  saveEditModal() {
    if (!this.editingItem) return;
    const updatedItem = {
      ...this.editingItem,
      title: this.editTitle,
      description: this.editDescription,
      dueDate: this.editDueDate ? new Date(this.editDueDate) : undefined,
      recurrenceRule: this.editRecurrence
    };

    this.todoService.update(updatedItem).subscribe({
      next: (res: TodoItem) => {
        const index = this.todoItems.findIndex(i => i.id === res.id);
        if (index > -1) {
          this.todoItems[index] = res;
        }
        this.showToastMessage(`✏️ "${res.title}" güncellendi!`);
        this.editingItem = null;
        this.uiStateService.notifyTaskListUpdated();
      },
      error: (err: any) => {
        let errorMessages: string[] = [];
        if (err.status === 400 && err.error?.errors) {
          for (const key in err.error.errors) {
            if (err.error.errors.hasOwnProperty(key)) {
              errorMessages = errorMessages.concat(err.error.errors[key]);
            }
          }
          this.showToastMessage(`❌ Hata: ${errorMessages.join(' ')}`);
        } else {
          this.showToastMessage('❌ Hata: Görev güncellenemedi.');
        }
        console.error('Update item error:', err);
      }
    });
  }
}