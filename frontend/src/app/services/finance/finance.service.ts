import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import {
  CRUD_STATES,
  CrudState,
  Expense,
  ExpenseCrudData,
} from '../../../app.interfaces';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  private expenseData = signal<Expense[]>([]);
  EXPENSE_DATA = this.expenseData.asReadonly();
  private destroyRef = inject(DestroyRef);
  private httpClient = inject(HttpClient);
  private ApiUrlBase: string = 'https://localhost:7107/';
  private urlExpenses: string = this.ApiUrlBase + 'api/Expenses/';
  private CRUD_STATES = CRUD_STATES;

  // grab all expenses and store the result in the private expenseData set
  expenseFetchAll() {
    return this.httpFetchAllExpenses(this.urlExpenses).pipe(
      tap({
        next: (results) => {
          if (results.httpStatusCode === 200) {
            this.expenseData.set(results.expenseData);
          }
          console.log('finance.service:::expenseFetchAll');
          console.log('results:');
          console.log(results);
          console.log('results.expenseData:');
          console.log(results.expenseData);
          console.log('this.expenseData:');
          console.log(this.expenseData());
        },
      })
    );
  }

  // fetches all expenses with no search criteria
  private httpFetchAllExpenses(urlExpenses: string) {
    return this.httpClient.get<{
      httpStatusCode: number;
      expenseData: Expense[];
      errorMessage: string;
    }>(urlExpenses);
  }

  // deletes the expense with the expenseID sent in
  private httpDeleteExpense(expenseID: number) {
    return this.httpClient.delete<{
      httpStatusCode: number;
      errorMessage: string;
    }>(this.urlExpenses + expenseID);
  }

  // get the data for opening any of the crud modals for a given expense.

  // get the data for opening any of the crud modals for a given expense.
  async getExpenseCrudModel(
    expenseID: number,
    actionToTake: CrudState
  ): Promise<ExpenseCrudData> {
    console.log('finance.service:::getExpenseCrudModel');
    let expenseData: Expense = {
      expenseID: expenseID,
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
      expenseDate: new Date(1, 1, 1),
      lastUpdated: new Date(1, 1, 1),
    };
    console.log(expenseData);

    let returnValue: ExpenseCrudData = {
      expenseState: actionToTake,
      expenseData: expenseData,
    };

    // if this is not a brand new item, get the data for the expense object.
    if (actionToTake !== this.CRUD_STATES.create) {
      console.log(
        'finance.service:::getExpenseCrudModel - not creating new expense'
      );
      returnValue.expenseData = await this.getExpenseByID(expenseID);
    }
    console.log(
      'finance.service:::getExpenseCrudModel - data gotten back from "getExpenseByID"'
    );
    console.log('data to return: ' + JSON.stringify(returnValue));
    return returnValue;
  }

  // gets expense object from current information in memory
  //TODO: should PROBABLY get this from the server and update the item in memory before allowing an update.
  //	- alternatively, could update the sproc to throw an error if we are updating something out of date by using an
  //		identifier of (expenseID / lastUpdated).
  async getExpenseByID(expenseID: number): Promise<Expense> {
    console.log('finance.service:::getExpenseByID');
    let returnValue = this.expenseData().find(
      (item) => item.expenseID === expenseID
    ) as Expense;
    console.log(this.expenseData());
    console.log(
      'getExpenseByID data about to return: ' + JSON.stringify(returnValue)
    );
    return returnValue;
  }

  deleteExpense(expenseID: number) {
    return this.httpDeleteExpense(expenseID);
  }
}


