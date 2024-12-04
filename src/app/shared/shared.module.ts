import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
  ],
  exports: [
    ReactiveFormsModule,
    MatDialogModule,
  ]
})
export class SharedModule {}
