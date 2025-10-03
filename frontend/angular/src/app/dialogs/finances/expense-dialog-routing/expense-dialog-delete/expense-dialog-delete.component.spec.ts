import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDialogDeleteComponent } from './expense-dialog-delete.component';
import { Expense } from '../../../../../app.interfaces';

describe('ExpenseDialogDeleteComponent', () => {
  let component: ExpenseDialogDeleteComponent;
  let fixture: ComponentFixture<ExpenseDialogDeleteComponent>;

  const expenseData: Expense = {
    expenseID: 0,
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseDialogDeleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseDialogDeleteComponent);
    fixture.componentRef.setInput('expenseData', expenseData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
