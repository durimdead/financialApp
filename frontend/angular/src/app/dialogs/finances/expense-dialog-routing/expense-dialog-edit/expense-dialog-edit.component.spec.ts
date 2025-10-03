import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import { ExpenseDialogEditComponent } from './expense-dialog-edit.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Expense } from '../../../../../app.interfaces';

describe('ExpenseDialogEditComponent', () => {
  let component: ExpenseDialogEditComponent;
  let fixture: ComponentFixture<ExpenseDialogEditComponent>;

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
      imports: [ExpenseDialogEditComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        HttpClient,
        HttpHandler,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseDialogEditComponent);
    fixture.componentRef.setInput('expenseData', expenseData);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
