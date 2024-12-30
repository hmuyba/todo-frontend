import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://mysql-todo-7693b48fef7f.herokuapp.com/api/tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {
    this.refreshTasks();
  }

  private updateLocalState(tasks: Task[]) {
    this.tasksSubject.next([...tasks]);
  }

  refreshTasks() {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap(tasks => this.updateLocalState(tasks))
    ).subscribe();
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap(tasks => this.updateLocalState(tasks))
    );
  }

  taskUpdate(task: Task): Observable<Task> {
    // Optimistically update the local state
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.map(t => t.id === task.id ? {...task} : t);
    this.updateLocalState(updatedTasks);

    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task).pipe(
      tap(() => this.refreshTasks()),
      catchError(error => {
        // Revert the local state on error
        this.updateLocalState(currentTasks);
        throw error;
      })
    );
  }


  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(() => this.refreshTasks())
    );
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task).pipe(
      tap(() => this.refreshTasks())
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refreshTasks())
    );
  }
}