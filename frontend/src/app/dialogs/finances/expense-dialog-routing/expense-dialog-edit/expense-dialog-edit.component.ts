import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Expense } from '../../../../../app.interfaces';
import { FormValidators } from '../../../../../app.form-validators';
import { FinanceService } from '../../../../services/finance/finance.service';
import { ExpenseDialogAddComponent } from '../expense-dialog-add/expense-dialog-add.component';

@Component({
  selector: 'app-expense-dialog-edit',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expense-dialog-edit.component.html',
  styleUrl: './expense-dialog-edit.component.css',
})
export class ExpenseDialogEditComponent implements OnInit {
  ngOnInit(): void {
    this.form.controls.expenseDate.setValue(
      new Date(this.expenseData().expenseDate.toString())
        .toISOString()
        .substring(0, 10)
    );
    this.form.controls.expenseDescription.setValue(
      this.expenseData().expenseDescription
    );
    this.form.controls.expenseAmount.setValue(
      this.expenseData().expenseAmount.toString()
    );
    this.form.controls.expenseTypeName.setValue(
      this.expenseData().expenseTypeName.toString()
    );
    this.form.controls.paymentTypeName.setValue(
      this.expenseData().paymentTypeName.toString()
    );
    this.form.controls.expenseTypeID.setValue(
      this.expenseData().expenseTypeID
    );
    this.form.controls.paymentTypeID.setValue(
      this.expenseData().paymentTypeID
    );
    this.form.controls.paymentTypeCategoryID.setValue(
      this.expenseData().paymentTypeCategoryID
    );
    this.form.controls.checkboxes.controls.isInvestment.setValue(
      this.expenseData().isInvestment
    );
    this.form.controls.checkboxes.controls.isIncome.setValue(
      this.expenseData().isIncome
    );
  }
  private formValidator = inject(FormValidators);
  private financeService = inject(FinanceService);
  public dialogRef = inject(MatDialogRef<ExpenseDialogAddComponent>);
  private destroyRef = inject(DestroyRef);
  readonly inputData = inject(MAT_DIALOG_DATA);
  expenseData = input.required<Expense>();

  form = new FormGroup({
    expenseDate: new FormControl(new Date().toISOString().substring(0, 10), {
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
    expenseTypeName: new FormControl('', {
      validators: [Validators.required],
    }),
    paymentTypeName: new FormControl('', {
      validators: [Validators.required],
    }),
    expenseTypeID: new FormControl(0, {
      validators: [Validators.required, this.formValidator.isValidExpenseType],
    }),
    paymentTypeID: new FormControl(0, {
      validators: [Validators.required, this.formValidator.isValidPaymentType],
    }),
    paymentTypeCategoryID: new FormControl(0, {
      validators: [
        Validators.required,
        this.formValidator.isValidPaymentCategoryType,
      ],
    }),
    checkboxes: new FormGroup(
      {
        isInvestment: new FormControl(false, {}),
        isIncome: new FormControl(false, {}),
      },
      {
        validators: [
          this.formValidator.cannotSelectBoth('isInvestment', 'isIncome'),
        ],
      }
    ),
  });
}
