import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module'; // Import the shared module
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';  // Import MatInputModule for input fields
import { ReactiveFormsModule } from '@angular/forms'; // If you're using reactive forms
import { MatSelectModule } from '@angular/material/select';  // Import MatSelectModule for mat-select and mat-option
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-delete-confirmation',
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
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationComponent {
  constructor(private dialogRef: MatDialogRef<DeleteConfirmationComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Return true if confirmed
  }

  onCancel(): void {
    this.dialogRef.close(false); // Return false if canceled
  }
}
