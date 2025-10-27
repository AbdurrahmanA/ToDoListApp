import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {
  private toastMessageSubject = new Subject<string>();
  public toastMessage$ = this.toastMessageSubject.asObservable();
  
  private taskListUpdatedSubject = new Subject<void>();
  public taskListUpdated$ = this.taskListUpdatedSubject.asObservable();
  private searchTermSubject = new BehaviorSubject<string>('');
  public searchTerm$ = this.searchTermSubject.asObservable();
  private toggleCreateFormSubject = new Subject<void>();
  public toggleCreateForm$ = this.toggleCreateFormSubject.asObservable();

  showToast(message: string) {
    this.toastMessageSubject.next(message);
  }
  
  notifyTaskListUpdated(): void {
    this.taskListUpdatedSubject.next();
  }
  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }
  triggerToggleCreateForm(): void {
    this.toggleCreateFormSubject.next();
  }
}