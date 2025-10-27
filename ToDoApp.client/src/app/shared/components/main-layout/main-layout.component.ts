import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '@app/features/auth/services/auth.service';
import { TodoService } from '@app/features/todo/services/todo.service';
import { TodoItem } from '@app/features/todo/models/todo-item.model';
import { UiStateService } from '@app/shared/services/ui-state.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [ CommonModule, RouterLink, RouterModule, FormsModule ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  
  showToast = false;
  toastMessage = '';
  isNotificationPanelOpen: boolean = false;
  searchTerm: string = '';
  todoItems: TodoItem[] = []; 

  constructor(
    private authService: AuthService,
    public router: Router,
    private todoService: TodoService,
    private uiStateService: UiStateService
  ) { }

  ngOnInit() {
    this.loadItemsForSidebar();

    this.uiStateService.toastMessage$.subscribe(message => {
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    });

    this.uiStateService.taskListUpdated$.subscribe(() => {
      this.loadItemsForSidebar();
    });
  }

  toggleCreateForm(): void {
    this.uiStateService.triggerToggleCreateForm();
  }

  onSearchChange(): void {
    this.uiStateService.setSearchTerm(this.searchTerm);
  }

  loadItemsForSidebar(): void {
    this.todoService.getAll().subscribe(items => {
      this.todoItems = items;
    });
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

  logout(): void {
    this.authService.removeToken();
    this.router.navigate(['/login']);
  }
  
  get totalCount(): number { return this.todoItems.length; }
  get completedCount(): number { return this.todoItems.filter(item => item.isCompleted).length; }
  get activeCount(): number { return this.todoItems.filter(item => !item.isCompleted).length; }
}