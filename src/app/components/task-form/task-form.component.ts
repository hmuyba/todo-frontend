import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { SharedModule } from '../../shared/shared.module'; // Import the shared module
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';  // Import MatInputModule for input fields
import { ReactiveFormsModule } from '@angular/forms'; // If you're using reactive forms
import { MatSelectModule } from '@angular/material/select';  // Import MatSelectModule for mat-select and mat-option
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    HttpClientModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule
],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task | null
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode = true;
      this.taskForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched(); // Mark all controls as touched to show validation errors
      return; // Prevent submission if form is invalid
    }
  
    if (this.isEditMode && this.data) {
      const updatedTask: Task = { ...this.data, ...this.taskForm.value };
      this.taskService.updateTask(updatedTask).subscribe(
        () => this.dialogRef.close('updated'),
        error => console.error('Error updating task', error)
      );
    } else {
      this.taskService.createTask(this.taskForm.value).subscribe(
        () => this.dialogRef.close('created'),
        error => console.error('Error creating task', error)
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
