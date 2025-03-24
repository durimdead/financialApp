import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { ExpenseData } from '../../app.interfaces';

@Component({
  selector: 'app-finances',
  imports: [
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './finances.component.html',
  styleUrl: './finances.component.css',
})
export class FinancesComponent {
  //TODO: start filling in with code for the finance component items.
  private expenses = signal<ExpenseData[]>([]);
  dataSource = new MatTableDataSource(this.expenses());
  displayedColumns: string[] = [
    'actions',
    'expenseDate',
    'expenseDescription',
    'expenseAmount',
	'expenseType',
	'expensePaymentType',
	'expensePaymentDescription',
  ];

  openAddExpenseModal(): void {
    console.log('adding expense');
  }

  editExpense(expenseId: number): void {
    console.log('editing expense');
  }

  confirmDeleteExpense(expenseId: number): void {
    console.log('deleting expense');
  }
}
