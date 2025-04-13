import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Expense } from '../../../app.interfaces';
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

  // fetches all expenses with no search criteria
  httpFetchAllExpenses(urlExpenses: string) {
    return this.httpClient.get<{
      httpStatusCode: number;
      expenseData: Expense[];
      errorMessage: string;
    }>(urlExpenses);
  }
}
