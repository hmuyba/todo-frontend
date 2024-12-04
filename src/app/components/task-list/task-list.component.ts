import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialog} from '@angular/material/dialog';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskFormComponent } from '../task-form/task-form.component';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { MatCardModule } from '@angular/material/card';  // Import MatCardModule here
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
export class TaskListComponent implements OnInit {
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getTasks();
  }

  // Normalizer function to standardize status
  normalizeStatus(status: string): string {
    return status.toUpperCase().replace('-', '_');
  }

  getTasks(): void {
    this.taskService.getTasks().subscribe(
      (tasks: Task[]) => {
        this.todoTasks = tasks.filter(task => 
          task.status === 'TO_DO' || task.status === 'TO DO' || task.status === 'to_do'
        );
        this.inProgressTasks = tasks.filter(task => 
          task.status === 'IN_PROGRESS' || task.status === 'IN PROGRESS' || task.status === 'in_progress'
        );
        this.doneTasks = tasks.filter(task => 
          task.status === 'DONE' || task.status === 'Done' || task.status === 'done'
        );
      },
      error => console.error('Error fetching tasks', error)
    );
  }

  deleteTask(id: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(id).subscribe(
          () => this.getTasks(), // Refresh the list
          error => console.error('Error deleting task', error)
        );
      }
    });
  }

  editTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '400px',
      data: task // Pass the current task data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.getTasks(); // Refresh the task list after editing
      }
    });
  }

  openCreateTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'created') {
        this.getTasks(); // Refresh the task list after creating
      }
    });
  }

  onDrop(event: CdkDragDrop<Task[]>): void {
    const task = event.item.data as Task;
    const newStatus = this.normalizeStatus(event.container.id);
    const previousStatus = this.normalizeStatus(task.status);
    const currentIndex = event.currentIndex;
    const previousIndex = event.previousIndex;
  
    if (previousStatus !== newStatus) {
      // Moving task to a different column
      const previousArray = this.getTaskArrayByStatus(previousStatus);
      const newArray = this.getTaskArrayByStatus(newStatus);
  
      // Remove task from the original column
      previousArray.splice(previousIndex, 1);
  
      // Add task to the new column at the correct position
      newArray.splice(currentIndex, 0, task);
  
      // Update task status
      task.status = newStatus;
  
      // Update backend and refresh task list
      this.taskService.updateTask(task).subscribe(
        () => {
          console.log('Task status updated successfully');
          this.getTasks(); // Refresh the list
        },
        error => {
          console.error('Error updating task status', error);
          // Revert the changes in case of an error
          newArray.splice(currentIndex, 1);
          previousArray.splice(previousIndex, 0, task);
        }
      );
    } else {
      // Reordering within the same column
      const taskArray = this.getTaskArrayByStatus(newStatus);
  
      // Remove and reinsert the task at the new position
      const removedTask = taskArray.splice(previousIndex, 1)[0];
      taskArray.splice(currentIndex, 0, removedTask);
    }
  }
  
  getTaskArrayByStatus(status: string): Task[] {
    switch (status) {
      case 'TO_DO':
        return this.todoTasks;
      case 'IN_PROGRESS':
        return this.inProgressTasks;
      case 'DONE':
        return this.doneTasks;
      default:
        return [];
    }
  }
}
