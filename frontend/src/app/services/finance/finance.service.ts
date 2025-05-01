import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import {
  CRUD_STATES,
  CrudState,
  Expense,
  ExpenseCrudData,
  ExpenseType,
  PaymentType,
} from '../../../app.interfaces';
import { tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  private expenseData = signal<Expense[]>([]);
  EXPENSE_DATA = this.expenseData.asReadonly();
  private httpClient = inject(HttpClient);
  private ApiUrlBase: string = 'https://localhost:7107/';
  private urlExpenses: string = this.ApiUrlBase + 'api/Expenses/';
  private urlExpenseTypes: string = this.ApiUrlBase + 'api/ExpenseTypes/';
  private urlPaymentTypes: string = this.ApiUrlBase + 'api/PaymentTypes/';
  private urlSearchExpenseTypes: string =
    this.urlExpenseTypes + 'SearchByExpenseTypeName';
  private urlSearchPaymentTypes: string =
    this.urlPaymentTypes + 'SearchByPaymentTypeName';
  private CRUD_STATES = CRUD_STATES;

  // grab all expenses and store the result in the private expenseData set
  expenseFetchAll() {
    return this.httpFetchAllExpenses(this.urlExpenses).pipe(
      tap({
        next: (results) => {
          if (results.httpStatusCode === 200) {
            this.expenseData.set(results.expenseData);
          }
        },
      })
    );
  }

  searchExpenseTypes(expenseTypeSearchString: string) {
    return this.httpSearchExpenseTypes(expenseTypeSearchString);
  }

  searchPaymentTypes(paymentTypeSearchString: string) {
    return this.httpSearchPaymentTypes(paymentTypeSearchString);
  }

  addExpense(expenseToAdd: Expense) {
    //TODO: do we add additional validation here? Is there a decently easy way to do so?
    return this.httpAddExpense(expenseToAdd);
  }

  private httpSearchExpenseTypes(expenseTypeSearchString: string) {
    const paramData = { expenseTypeSearchString: expenseTypeSearchString };
    const params = new HttpParams().append(
      'expenseTypeSearchString',
      expenseTypeSearchString.toString()
    );
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      }),
      params: params,
    };
    return this.httpClient.post<{
      httpStatusCode: number;
      expenseTypeData: ExpenseType[];
      errorMessage: string;
    }>(this.urlSearchExpenseTypes, paramData, headers);
  }

  private httpSearchPaymentTypes(paymentTypeSearchString: string) {
    const paramData = { paymentTypeSearchString: paymentTypeSearchString };
    const params = new HttpParams().append(
      'paymentTypeSearchString',
      paymentTypeSearchString.toString()
    );
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      }),
      params: params,
    };
    return this.httpClient.post<{
      httpStatusCode: number;
      paymentTypeData: PaymentType[];
      errorMessage: string;
    }>(this.urlSearchPaymentTypes, paramData, headers);
  }

  // calls the API method to add a new expense to the database.
  private httpAddExpense(expenseToAdd: Expense) {
    const expenseParam = JSON.stringify(expenseToAdd);
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
      }),
    };
    return this.httpClient.post<{
      httpStatusCode: number;
      errorMessage: string;
    }>(this.urlExpenses, expenseParam, headers);
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
  async getExpenseCrudModel(
    expenseID: number,
    actionToTake: CrudState
  ): Promise<ExpenseCrudData> {
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

    let returnValue: ExpenseCrudData = {
      expenseState: actionToTake,
      expenseData: expenseData,
    };

    // if this is not a brand new item, get the data for the expense object.
    if (actionToTake !== this.CRUD_STATES.create) {
      returnValue.expenseData = await this.getExpenseByID(expenseID);
    }

    return returnValue;
  }

  // gets expense object from current information in memory
  //TODO: should PROBABLY get this from the server and update the item in memory before allowing an update.
  //	- alternatively, could update the sproc to throw an error if we are updating something out of date by using an
  //		identifier of (expenseID / lastUpdated).
  async getExpenseByID(expenseID: number): Promise<Expense> {
    let returnValue = this.expenseData().find(
      (item) => item.expenseID === expenseID
    ) as Expense;

    return returnValue;
  }

  deleteExpense(expenseID: number) {
    return this.httpDeleteExpense(expenseID);
  }
}
