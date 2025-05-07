import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Expense } from '../../../../../app.interfaces';

@Component({
  selector: 'app-expense-dialog-edit',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expense-dialog-edit.component.html',
  styleUrl: './expense-dialog-edit.component.css',
})
export class ExpenseDialogEditComponent {
  readonly inputData = inject(MAT_DIALOG_DATA);
  expenseData = input.required<Expense>();
}
