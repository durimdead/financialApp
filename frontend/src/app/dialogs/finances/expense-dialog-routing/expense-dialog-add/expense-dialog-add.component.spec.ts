import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDialogAddComponent } from './expense-dialog-add.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('ExpenseDialogAddComponent', () => {
  let component: ExpenseDialogAddComponent;
  let fixture: ComponentFixture<ExpenseDialogAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseDialogAddComponent],
			providers: [
			  { provide: MAT_DIALOG_DATA, useValue: {} },
			  { provide: MatDialogRef, useValue: {} },
			],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseDialogAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
