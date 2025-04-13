import { Injectable, signal } from '@angular/core';
import { Expense } from '../../../app.interfaces';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  private expenseData = signal<Expense[]>([]);
  EXPENSE_DATA = this.expenseData.asReadonly();

  expenseFetcher() {
    //TODO: add in code to call api
  }
}
