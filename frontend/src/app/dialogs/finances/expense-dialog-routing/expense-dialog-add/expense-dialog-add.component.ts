import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
  Validators,
} from '@angular/forms';
import { FormValidators } from '../../../../../app.form-validators';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FinanceService } from '../../../../services/finance/finance.service';
import {
  Expense,
  ExpenseType,
  PaymentType,
} from '../../../../../app.interfaces';
import { debounceTime } from 'rxjs';

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
  // This is never utilized outside of displaying the last
  // updated date, which is driven by the database's temporal tables.
  readonly inputData = inject(MAT_DIALOG_DATA);
  private formValidator = inject(FormValidators);
  private financeService = inject(FinanceService);
  public dialogRef = inject(MatDialogRef<ExpenseDialogAddComponent>);
  private destroyRef = inject(DestroyRef);
  search_expenseTypeResults = signal<ExpenseType[]>([]);
  search_paymentTypeResults = signal<PaymentType[]>([]);
  private sampleExpenseTypes = signal<ExpenseType[]>([
    {
      expenseTypeID: 1,
      expenseTypeName: 'car maintenance',
      expenseTypeDescription: 'NOT NEEDED',
    },
    {
      expenseTypeID: 2,
      expenseTypeName: 'other',
      expenseTypeDescription: 'NOT NEEDED',
    },
  ]);

  private samplePaymentTypes = signal<PaymentType[]>([
    {
      paymentTypeID: 1,
      paymentTypeCategoryID: 1,
      paymentTypeName: 'cash',
      paymentTypeDescription: 'NOT NEEDED',
    },
    {
      paymentTypeID: 2,
      paymentTypeCategoryID: 1,
      paymentTypeName: 'venmo',
      paymentTypeDescription: 'NOT NEEDED',
    },
  ]);

  ngOnInit() {
    // console.log('inside the add dialog');
  }

  form = new FormGroup({
    //TODO: add in validator to make sure a date is actually selected - might need to look up how to put a "blank" default value for a date.
    expenseDate: new FormControl(new Date().toISOString().substring(0, 10), {
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
	//TODO: Add in PaymentTypeCategoryID
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
    if (!this.form.invalid) {
      let newExpense: Expense = {
        expenseDescription: this.form.controls.expenseDescription
          .value as string,
        expenseDate: new Date(this.form.controls.expenseDate.value!.toString()),
        expenseAmount: Number(this.form.controls.expenseAmount.value),
        expenseID: 0,
        expenseTypeID: Number(this.form.controls.expenseTypeID.value),
        paymentTypeID: Number(this.form.controls.paymentTypeID.value),
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

  updateFormControlErrorLabelHTML(formControl: FormControl) {
    let formControlID = this.getFormControlID(formControl);
    if (formControlID === null) throw 'form control does not exist';
    let errorMessage =
      this.formValidator.getFormControlErrorDetailsHTML(formControl);
    if (errorMessage !== '') {
      document.getElementById(
        'errorLabel_' + formControlID.toString()
      )!.innerHTML = errorMessage;
    }
  }

  getFormGroupErrorDetails(formGroup: FormGroup<any>) {
    return this.formValidator.getFormGroupErrorDetails(formGroup);
  }

  // populates dropdown with set of selectable, valid expense types to choose from
  search_expenseTypes() {
    let currentSearchCriteria = this.form.controls.expenseTypeName.value;

    if (currentSearchCriteria === null) return;
    // call back to server to search the expense types
    const subscription = this.financeService
      .searchExpenseTypes(currentSearchCriteria)
      .pipe(debounceTime(200))
      .subscribe({
        next: (results) => {
          let dataToDisplay = results.expenseTypeData;
          if (dataToDisplay.length === 0) {
            dataToDisplay.push({
              expenseTypeDescription: '',
              expenseTypeName: 'No Search Results',
              expenseTypeID: 0,
            });
          }
          this.search_expenseTypeResults.set(dataToDisplay);
          this.showHTMLElement('searchResults_ExpenseType');
        },
        error: (error: Error) => {
          console.error('error fetching expense types from server: ');
          console.error(error);
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });

    // if we have updated the search criteria, a valid type MUST be chosen from the list
    this.form.controls.expenseTypeID.setValue(0);
    this.form.controls.expenseTypeID.markAsTouched();
    this.form.controls.expenseTypeID.markAsDirty();
  }

  // populates dropdown with set of selectable, valid payment types to choose from
  search_paymentTypes() {
    let currentSearchCriteria = this.form.controls.paymentTypeName.value;

    if (currentSearchCriteria === null) return;
    // call back to server to search the payment types
    const subscription = this.financeService
      .searchPaymentTypes(currentSearchCriteria)
      .pipe(debounceTime(200))
      .subscribe({
        next: (results) => {
          let dataToDisplay = results.paymentTypeData;
          if (dataToDisplay.length === 0) {
            dataToDisplay.push({
              paymentTypeDescription : '',
              paymentTypeName: 'No Search Results',
              paymentTypeID: 0,
			  paymentTypeCategoryID: 0
            });
          }
          this.search_paymentTypeResults.set(dataToDisplay);
          this.showHTMLElement('searchResults_PaymentType');
        },
        error: (error: Error) => {
          console.error('error fetching payment types from server: ');
          console.error(error);
        },
      });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });

    // if we have updated the search criteria, a valid type MUST be chosen from the list
    this.form.controls.paymentTypeID.setValue(0);
    this.form.controls.paymentTypeID.markAsTouched();
    this.form.controls.paymentTypeID.markAsDirty();
  }

  // updates information for expense type based on selected option from search results
  click_expenseTypeResult(expenseTypeID: number) {
    let selectedExpenseTypeElement = document.getElementById(
      'expenseTypeSearchResult_' + expenseTypeID.toString()
    );

    // update the hidden input form value for expenseTypeID
    this.form.controls.expenseTypeID.setValue(expenseTypeID);

    // hide the results since one of them has been chosen.
    this.hideHTMLElement('searchResults_ExpenseType');

    // update the expenseTypeName form value to utilize the selected result
    this.form.controls.expenseTypeName.setValue(
      selectedExpenseTypeElement!.title.trim()
    );
  }

  // updates information for payment type based on selected option from search results
  click_paymentTypeResult(paymentTypeID: number) {
    let selectedPaymentTypeElement = document.getElementById(
      'paymentTypeSearchResult_' + paymentTypeID.toString()
    );

    // update the hidden input form value for paymentTypeID
    this.form.controls.paymentTypeID.setValue(paymentTypeID);

    // hide the results since one of them has been chosen.
    this.hideHTMLElement('searchResults_PaymentType');

    // update the paymentTypeName form value to utilize the selected result
    this.form.controls.paymentTypeName.setValue(
      selectedPaymentTypeElement!.title.trim()
    );
  }

  // specifically for hiding an element on blur with .5s timeout.
  hideElementOnBlur(elementIdToHide: string) {
    setTimeout(() => {
      this.hideHTMLElement(elementIdToHide);
    }, 500);
  }

  hideElement(HTMLElementId: string) {
    this.hideHTMLElement(HTMLElementId);
  }

  private hideHTMLElement(HTMLElementId: string) {
    document
      .getElementById(HTMLElementId.toString())
      ?.classList.add('hidden-element');
  }

  private showHTMLElement(HTMLElementId: string) {
    document
      .getElementById(HTMLElementId.toString())
      ?.classList.remove('hidden-element');
  }

  // extracts the ID of a given FormControl given the control
  private getFormControlID(control: FormControl): string | null {
    let group = <FormGroup>control.parent;

    if (!group) {
      return null;
    }

    let name: string;

    Object.keys(group.controls).forEach((key) => {
      let childControl = group.get(key);

      if (childControl !== control) {
        return;
      }

      name = key;
    });

    return name!;
  }
}
