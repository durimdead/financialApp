import { AfterViewInit, Component, DestroyRef, inject, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { CRUD_STATES, CrudState, Expense } from '../../app.interfaces';
import { FinanceService } from '../services/finance/finance.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseDialogRoutingComponent } from '../dialogs/finances/expense-dialog-routing/expense-dialog-routing.component';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-finances',
  imports: [
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: './finances.component.html',
  styleUrl: './finances.component.css',
})
export class FinancesComponent implements AfterViewInit {
  private financeService = inject(FinanceService);
  private destroyRef = inject(DestroyRef);
  private _liveAnnouncer = inject(LiveAnnouncer);
  private expenseData = this.financeService.EXPENSE_DATA;
  private CRUD_STATES = CRUD_STATES;
  readonly dialog = inject(MatDialog);
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.updateExpensesFromDatasource();
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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

  async openAddExpenseModal(): Promise<void> {
    // brings up modal to add another expense
    const modalData = await this.financeService.getExpenseCrudModel(
      0,
      this.CRUD_STATES.create as CrudState
    );
    let dialogRef = this.dialog.open(ExpenseDialogRoutingComponent, {
      data: modalData,
    });

    // if the user submits a new element, we will get back an element to add to the table, else ''
    const subscription = dialogRef
      .afterClosed()
      .subscribe((result: Expense | '') => {
        if (result !== '') {
          this.addExpense(result);
        }
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  async openEditExpenseModal(expenseID: number): Promise<void> {
    // brings up modal to edit an expense
    const modalData = await this.financeService.getExpenseCrudModel(
      expenseID,
      this.CRUD_STATES.update as CrudState
    );
    let dialogRef = this.dialog.open(ExpenseDialogRoutingComponent, {
      data: modalData,
    });

    // if the user submits a new element, we will get back an element to add to the table, else ''
    const subscription = dialogRef
      .afterClosed()
      .subscribe((result: Expense | '') => {
        if (result !== '') {
          this.editExpense(result, expenseID);
        }
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  async openDeleteExpenseModal(expenseID: number): Promise<void> {
    try {
      const modalData = await this.financeService.getExpenseCrudModel(
        expenseID,
        this.CRUD_STATES.delete as CrudState
      );
      // open the dialog and send data to display
      let dialogRef = this.dialog.open(ExpenseDialogRoutingComponent, {
        data: modalData,
      });

      // if the user confirms deletion
      const subscription = dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.deleteExpense(modalData.expenseData.expenseID);
        }
      });
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    } catch (e) {
      console.error('Error occurred:');
      console.error(e);
    }
  }

  private deleteExpense(expenseID: number) {
    const subscription = this.financeService
      .deleteExpense(expenseID)
      .subscribe({
        next: (results) => {
          if (results.httpStatusCode === 200) {
            this.updateExpensesFromDatasource();
          } else {
            console.error(
              'server error deleting expenseID ' +
                expenseID +
                '. Error: ' +
                results.errorMessage
            );
          }
        },
        error: (error: Error) => {
          console.error('error deleting expenseID ' + expenseID + '. Error: ');
          console.error(error);
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  private addExpense(expenseToAdd: Expense) {
    const subscription = this.financeService
      .addExpense(expenseToAdd)
      .subscribe({
        next: (results) => {
          if (results.httpStatusCode === 200) {
            this.updateExpensesFromDatasource();
          } else {
            console.error(
              'server error adding expense ::: ' +
                '". Error message : ' +
                results.errorMessage
            );
            console.error(expenseToAdd);
          }
        },
        error: (error: Error) => {
          console.error('server error adding expense ::: ' + '". Full Error: ');
          console.error(error);
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  private editExpense(expenseToEdit: Expense, expenseID: number) {
    const subscription = this.financeService
      .editExpense(expenseToEdit, expenseID)
      .subscribe({
        next: (results) => {
          if (results.httpStatusCode === 200) {
            this.updateExpensesFromDatasource();
          } else {
            console.error(
              'server error adding expense ::: ' +
                '". Error message : ' +
                results.errorMessage
            );
            console.error(expenseToEdit);
          }
        },
        error: (error: Error) => {
          console.error('server error adding expense ::: ' + '". Full Error: ');
          console.error(error);
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  // gets the data from the "source" (i.e. the API) and then refreshes the table appropriately
  //TODO: update the code in the FinanceService to make this work.
  //TODO: update the displayedColumns / HTML page to match the new model more completely
  updateExpensesFromDatasource() {
    const subscription = this.financeService.expenseFetchAll().subscribe({
      error: (error: Error) => {
        console.error('error fetching expenses from server: ');
        console.error(error);
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
