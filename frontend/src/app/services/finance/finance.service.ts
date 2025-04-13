import { Injectable, signal } from '@angular/core';
import { ExpenseDetail } from '../../../app.interfaces';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  private expenseData = signal<ExpenseDetail[]>([]);
  EXPENSE_DATA = this.expenseData.asReadonly();

  expenseFetcher() {
    //TODO: add in code to call api
  }
}
