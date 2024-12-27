import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialogModule, MatDialog} from '@angular/material/dialog';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { MatCardModule } from '@angular/material/card';  
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-task-list',
    imports: [
        CommonModule,
        MatDialogModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        DragDropModule,
        ReactiveFormsModule,
        FormsModule
    ],
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.css']
})

export class TaskListComponent implements OnInit, OnDestroy {
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];
  private tasksSubscription: Subscription | undefined;

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    // Initialize the subscription
    this.tasksSubscription = this.taskService.tasks$.subscribe(
      (tasks: Task[]) => {
        this.todoTasks = tasks.filter(task => 
          this.normalizeStatus(task.status) === 'TO_DO'
        );
        this.inProgressTasks = tasks.filter(task => 
          this.normalizeStatus(task.status) === 'IN_PROGRESS'
        );
        this.doneTasks = tasks.filter(task => 
          this.normalizeStatus(task.status) === 'DONE'
        );
      },
      error => {
        console.error('Error in tasks subscription:', error);
      }
    );

    // Initial load
    this.taskService.refreshTasks();
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  normalizeStatus(status: string): string {
    return status.toUpperCase().replace(/[\s-]/g, '_');
  }

  deleteTask(id: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(id).subscribe({
          next: () => {
            // The refresh is handled by the service
          },
          error: (error) => {
            console.error('Error deleting task:', error);
            this.taskService.refreshTasks(); // Refresh to ensure consistent state
          }
        });
      }
    });
  }

  editTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '400px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.taskService.refreshTasks();
      }
    });
  }

  openCreateTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.taskService.refreshTasks();
      }
    });
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    const task = event.item.data as Task;
    const newStatus = this.normalizeStatus(event.container.id);
    const previousStatus = this.normalizeStatus(task.status);
    
    if (previousStatus !== newStatus) {
      const updatedTask = { ...task, status: newStatus };
      this.taskService.updateTask(updatedTask).subscribe({
        next: () => {
          // The refresh is handled by the service
        },
        error: (error) => {
          console.error('Error updating task status:', error);
          this.taskService.refreshTasks(); // Refresh to revert changes on error
        }
      });
    }
  }
}
