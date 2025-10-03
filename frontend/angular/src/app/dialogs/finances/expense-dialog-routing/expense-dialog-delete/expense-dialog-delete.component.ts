import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Expense } from '../../../../../app.interfaces';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expense-dialog-delete',
  imports: [MatDialogModule, MatButtonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expense-dialog-delete.component.html',
  styleUrl: './expense-dialog-delete.component.css',
})
export class ExpenseDialogDeleteComponent {
  expenseData = input.required<Expense>();
}
