import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import { ExpenseDialogEditComponent } from './expense-dialog-edit.component';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('ExpenseDialogEditComponent', () => {
  let component: ExpenseDialogEditComponent;
  let fixture: ComponentFixture<ExpenseDialogEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseDialogEditComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        HttpClient,
		HttpHandler
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseDialogEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
