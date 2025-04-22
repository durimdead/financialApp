import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FormValidators } from '../../../../../app.form-validators';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FinanceService } from '../../../../services/finance/finance.service';
import { Expense, ExpenseType } from '../../../../../app.interfaces';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-expense-dialog-add',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
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
  search_expenseTypeResults = signal<ExpenseType[]>([]);
  private sampleExpenseTypes = signal<ExpenseType[]>([
    {
      expenseTypeID: 1,
      expenseTypeName: 'car maintenance',
      expenseTypeDescription: '',
      lastUpdated: new Date(),
    },
    {
      expenseTypeID: 2,
      expenseTypeName: 'other',
      expenseTypeDescription: '',
      lastUpdated: new Date(),
    },
  ]);

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
    expenseTypeName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    // paymentTypeName: new FormControl('', {
    //   validators: [Validators.required, Validators.minLength(3)],
    // }),
    expenseTypeID: new FormControl(0, {
      validators: [Validators.required], //TODO: Add in "mustSelectValidExpenseType" validator
    }),
    paymentTypeID: new FormControl(0, {
      validators: [Validators.required], //TODO: Add in "mustSelectValidPaymentType" validator
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

  //TODO: continue filling in the appropriate fields into the rest of the data.
  submitNewExpense() {
    console.log('hello');
    console.log(this.form);

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
        expenseTypeName: 'NOT USED FOR ADD',
        paymentTypeName: 'NOT USED FOR ADD',
        paymentTypeDescription: 'NOT USED FOR ADD',
        paymentTypeCategoryName: 'NOT USED FOR ADD',
        isIncome: this.form.controls.checkboxes.controls.isIncome
          .value as boolean,
        isInvestment: this.form.controls.checkboxes.controls.isInvestment
          .value as boolean,
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

  formControlHasError(formControl: FormControl) {
    if (formControl.touched && formControl.dirty && formControl.invalid) {
      return true;
    }
    return false;
  }

  formGroupHasError(formGroup: FormGroup) {
    if (formGroup.touched && formGroup.dirty && formGroup.invalid) {
      return true;
    }
    return false;
  }

  getFormControlErrorDetails(formControl: FormControl) {
    return this.formValidator.getFormControlErrorDetails(formControl);
  }
  getFormGroupErrorDetails(formGroup: FormGroup<any>) {
    return this.formValidator.getFormGroupErrorDetails(formGroup);
  }

  search_expenseTypes() {
    let currentSearchCriteria = this.form.controls.expenseTypeName.value;
    this.search_expenseTypeResults.set(
      this.sampleExpenseTypes().filter((x) =>
        x.expenseTypeName
          .toLowerCase()
          .includes(currentSearchCriteria!.toLowerCase())
      )
    );
    document
      .getElementById('searchResults_ExpenseType')
      ?.classList.remove('hidden-element');
  }

  click_expenseTypeResult(expenseTypeID: number) {
    let selectedExpenseTypeElement = document.getElementById(
      'expenseTypeSearchResult_' + expenseTypeID.toString()
    );
    let searchResults_ExpenseType = document.getElementById(
      'searchResults_ExpenseType'
    );

    // update the hidden input form value for expenseTypeID
    // expenseTypeIDElement.value = expenseTypeID.toString();
	this.form.controls.expenseTypeID.setValue(expenseTypeID);

    // hide the results since one of them has been chosen.
    searchResults_ExpenseType?.classList.add('hidden-element');

    // update the expenseTypeName form value to utilize the selected result
    // expenseTypeNameElement.value = selectedExpenseTypeElement!.innerHTML;
    this.form.controls.expenseTypeName.setValue(
      selectedExpenseTypeElement!.innerHTML
    );
  }
}
