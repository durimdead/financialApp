import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { Expense } from '../../app.interfaces';
import { FinanceService } from '../services/finance/finance.service';

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
  private financeService = inject(FinanceService);
  private destroyRef = inject(DestroyRef);
  private expenseData = signal<Expense[]>([]);

  dataSource = new MatTableDataSource(this.expenseData());
  displayedColumns: string[] = [
    'actions',
    'ExpenseDate',
    'ExpenseDescription',
    'ExpenseAmount',
    'ExpenseType',
    'ExpensePaymentType',
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

  // gets the data from the "source" (i.e. the API) and then refreshes the table appropriately
  //TODO: update the code in the FinanceService to make this work.
  //TODO: update the displayedColumns / HTML page to match the new model more completely
  updateExpensesFromDatasource() {
    // const subscription = this.financeService.expensesFetcher().subscribe({
    //   error: (error: Error) => {
    //     console.log('error fetching expenses from server: ');
    //     console.log(error);
    //   },
    //   complete: () => {
    //     this.refreshMatTableDataSource();
    //   },
    // });

    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe();
    // });
  }

  // a little bit of a hack, but the most effective, simple way to update the datasource for
  // the material table.
  refreshMatTableDataSource() {
    this.dataSource.data = this.expenseData();
  }
}
