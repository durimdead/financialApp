import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  Expense,
} from '../../../../../app.interfaces';
import { ExpenseModalFormComponent } from '../expense-modal-form/expense-modal-form.component';

@Component({
  selector: 'app-expense-dialog-add',
  imports: [ExpenseModalFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expense-dialog-add.component.html',
  styleUrl: './expense-dialog-add.component.css',
})
export class ExpenseDialogAddComponent {
  readonly inputData = inject(MAT_DIALOG_DATA);
  readonly expenseData: Expense = {
    expenseID: 0,
    expenseTypeID: 0,
    paymentTypeID: 0,
    paymentTypeCategoryID: 0,
    expenseTypeName: '',
    paymentTypeName: '',
    paymentTypeDescription: '',
    paymentTypeCategoryName: '',
    isIncome: false,
    isInvestment: false,
    expenseDescription: '',
    expenseAmount: 0,
    expenseDate: new Date(),
    lastUpdated: new Date(),
  };
}
