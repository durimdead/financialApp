import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { CRUD_STATES, CrudState, Expense } from '../../app.interfaces';
import { FinanceService } from '../services/finance/finance.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseDialogAddComponent } from '../dialogs/finances/expense-dialog-routing/expense-dialog-add/expense-dialog-add.component';
import { ExpenseDialogDeleteComponent } from '../dialogs/finances/expense-dialog-routing/expense-dialog-delete/expense-dialog-delete.component';
import { ExpenseDialogRoutingComponent } from '../dialogs/finances/expense-dialog-routing/expense-dialog-routing.component';

@Component({
  selector: 'app-finances',
  imports: [
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    DatePipe,
  ],
  templateUrl: './finances.component.html',
  styleUrl: './finances.component.css',
})
export class FinancesComponent {
  //TODO: start filling in with code for the finance component items.
  private financeService = inject(FinanceService);
  private destroyRef = inject(DestroyRef);
  readonly dialog = inject(MatDialog);
  private expenseData = this.financeService.EXPENSE_DATA;
  private CRUD_STATES = CRUD_STATES;

  ngAfterViewInit() {
    this.updateExpensesFromDatasource();
  }

  dataSource = new MatTableDataSource(this.expenseData());
  displayedColumns: string[] = [
    'actions',
    'expenseDate',
    'expenseDescription',
    'expenseAmount',
    'expenseTypeName',
    'paymentTypeName',
  ];

  openAddExpenseModal(): void {
    // brings up modal to add another expense
    const modalData = this.financeService.getExpenseCrudModel(
      0,
      this.CRUD_STATES.create as CrudState
    );
    let dialogRef = this.dialog.open(ExpenseDialogRoutingComponent, {
      data: modalData,
    });

    console.log('finances.component:::openAddExpenseModal - got past open');

    // if the user submits a new element, we will get back an element to add to the table, else ''
    const subscription = dialogRef
      .afterClosed()
      .subscribe((result: Expense | '') => {
        // if (result !== '') {
        //   this.addExpense(result);
        // }
        console.log(
          'finances.component:::openAddExpenseModal - completed modal close'
        );
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  editExpense(expenseId: number): void {
    console.log('editing expense');
  }

  async confirmDeleteExpense(expenseID: number): Promise<void> {
    try {
      console.log(
        'finances.component:::confirmDeleteExpense - entered with expenseID: ' +
          expenseID
      );
      const modalData = await this.financeService.getExpenseCrudModel(
        expenseID,
        this.CRUD_STATES.delete as CrudState
      );
      console.log(modalData);
      // open the dialog and send data to display
      let dialogRef = this.dialog.open(ExpenseDialogRoutingComponent, {
        data: modalData,
      });

      // if the user confirms deletion
      const subscription = dialogRef.afterClosed().subscribe((result) => {
        console.log(
          'finances.component:::confirmDeleteExpense - got to return'
        );
        if (result === true) {
          console.log(
            'finances.component:::confirmDeleteExpense - confirmed would like to delete'
          );
          this.deleteExpense(modalData.expenseData.expenseID);
        }
      });
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    } catch (e) {
      console.log('finances.component:::confirmDeleteExpense');
      console.log('Error occurred:');
      console.log(e);
    }
  }

  deleteExpense(expenseID: number) {
    console.log('trigger expense deleted - expenseID: ' + expenseID);
  }

  // gets the data from the "source" (i.e. the API) and then refreshes the table appropriately
  //TODO: update the code in the FinanceService to make this work.
  //TODO: update the displayedColumns / HTML page to match the new model more completely
  updateExpensesFromDatasource() {
    const subscription = this.financeService.expenseFetchAll().subscribe({
      error: (error: Error) => {
        console.log('error fetching expenses from server: ');
        console.log(error);
      },
      complete: () => {
        this.expenseData = this.financeService.EXPENSE_DATA;
        this.refreshMatTableDataSource();
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // a little bit of a hack, but the most effective, simple way to update the datasource for
  // the material table.
  refreshMatTableDataSource() {
    this.dataSource.data = this.expenseData();
  }
}
