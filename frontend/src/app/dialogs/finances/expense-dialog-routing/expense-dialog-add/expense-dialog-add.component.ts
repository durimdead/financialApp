import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormValidators } from '../../../../../app.form-validators';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FinanceService } from '../../../../services/finance/finance.service';
import { Expense } from '../../../../../app.interfaces';

@Component({
  selector: 'app-expense-dialog-add',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expense-dialog-add.component.html',
  styleUrl: './expense-dialog-add.component.css',
})
export class ExpenseDialogAddComponent {
  readonly inputData = inject(MAT_DIALOG_DATA);
  private formValidator = inject(FormValidators);
  private financeService = inject(FinanceService);
  public dialogRef = inject(MatDialogRef<ExpenseDialogAddComponent>);

  ngOnInit() {
    // console.log('inside the add dialog');
  }

  form = new FormGroup({
    //TODO: add in validator to make sure it's a valid date
    expenseDate: new FormControl(new Date(), {
      //validators: [Validators.required],
      validators: [Validators.required, this.formValidator.mustBeADate],
    }),
    expenseDescription: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    expenseAmount: new FormControl('', {
      validators: [
        Validators.required,
        this.formValidator.mustBeANumber,
        this.formValidator.mustNotBeZero,
      ],
    }),
  });

  //TODO: continue filling in the appropriate fields into the rest of the data.
  submitNewExpense() {
    if (!this.form.invalid) {
      let newExpense: Expense = {
        expenseDescription: this.form.controls.expenseDescription
          .value as string,
        expenseDate: this.form.controls.expenseDate.value as Date,
        expenseAmount: Number(this.form.controls.expenseAmount.value),
        expenseID: 0,
        expenseTypeID: 1,
        paymentTypeID: 1,
        paymentTypeCategoryID: 1,
        expenseTypeName: 'does not matter',
        paymentTypeName: 'does not matter',
        paymentTypeDescription: 'does not matter',
        paymentTypeCategoryName: 'does not matter',
        isIncome: false,
        isInvestment: false,
        //TODO: possibly update this to make this no longer needed here?
		// This is never utilized outside of displaying the last
		// updated date, which is driven by the database's temporal tables.
        lastUpdated: new Date(),
      };
      this.dialogRef.close(newExpense);
    }
    // the form is invalid, ensure we show which have issues
    this.formValidator.markFormGroupAsDirtyTouched(this.form);
  }
}
