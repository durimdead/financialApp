import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Expense } from '../../../../../app.interfaces';
import { ExpenseModalFormComponent } from '../expense-modal-form/expense-modal-form.component';

@Component({
  selector: 'app-expense-dialog-edit',
  imports: [ExpenseModalFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expense-dialog-edit.component.html',
  styleUrl: './expense-dialog-edit.component.css',
})
export class ExpenseDialogEditComponent {
  readonly inputData = inject(MAT_DIALOG_DATA);
  readonly expenseData = input.required<Expense>();
}
