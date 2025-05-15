import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
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
    expenseType: new FormGroup(
      {
        expenseTypeName: new FormControl('', {}),
        expenseTypeID: new FormControl(0, {
          validators: [
            Validators.required,
            this.formValidator.isValidExpenseType,
          ],
        }),
      },
      {
        validators: [Validators.required],
      }
    ),
    paymentType: new FormGroup(
      {
        paymentTypeName: new FormControl('', {}),
        paymentTypeID: new FormControl(0, {
          validators: [
            Validators.required,
            this.formValidator.isValidPaymentType,
          ],
        }),
        paymentTypeCategoryID: new FormControl(0, {
          validators: [
            Validators.required,
            this.formValidator.isValidPaymentCategoryType,
          ],
        }),
      },
      {
        validators: [Validators.required],
      }
    ),
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

  // Submits the new expense that has been filled out in the form
  submitNewExpense() {
    if (!this.form.invalid) {
      let newExpense: Expense = {
        expenseDescription: this.form.controls.expenseDescription
          .value as string,
        expenseDate: new Date(this.form.controls.expenseDate.value!.toString()),
        expenseAmount: Number(this.form.controls.expenseAmount.value),
        expenseID: 0,
        expenseTypeID: Number(
          this.form.controls.expenseType.controls.expenseTypeID.value
        ),
        paymentTypeID: Number(
          this.form.controls.paymentType.controls.paymentTypeID.value
        ),
        paymentTypeCategoryID: Number(
          this.form.controls.paymentType.controls.paymentTypeCategoryID.value
        ),
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
    return this.formValidator.formControlHasError(formControl);
  }

  formGroupHasError(formGroup: FormGroup) {
    return this.formValidator.formGroupHasError(formGroup);
  }

  updateFormControlErrorLabelHTML(formControl: FormControl) {
    this.formValidator.updateFormControlErrorLabelHTML(formControl);
  }

  getFormGroupErrorDetails(formGroup: FormGroup<any>) {
    return this.formValidator.getFormGroupErrorDetails(formGroup);
  }

  // populates dropdown with set of selectable, valid expense types to choose from
  search_expenseTypes() {
    let currentSearchCriteria =
      this.form.controls.expenseType.controls.expenseTypeName.value;

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
          this.financeService.showHTMLElement('searchResults_expenseType');
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
    this.form.controls.expenseType.controls.expenseTypeID.setValue(0);
    this.form.controls.expenseType.controls.expenseTypeID.markAsTouched();
    this.form.controls.expenseType.controls.expenseTypeID.markAsDirty();
    document
      .getElementById('expenseTypeName')
      ?.classList.remove('validated-input');
  }

  // populates dropdown with set of selectable, valid payment types to choose from
  search_paymentTypes() {
    let currentSearchCriteria =
      this.form.controls.paymentType.controls.paymentTypeName.value;

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
              paymentTypeDescription: '',
              paymentTypeName: 'No Search Results',
              paymentTypeID: 0,
              paymentTypeCategoryID: 0,
            });
          }
          this.search_paymentTypeResults.set(dataToDisplay);
          this.financeService.showHTMLElement('searchResults_paymentType');
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
    this.form.controls.paymentType.controls.paymentTypeID.setValue(0);
    this.form.controls.paymentType.controls.paymentTypeCategoryID.setValue(0);
    this.form.controls.paymentType.controls.paymentTypeID.markAsTouched();
    this.form.controls.paymentType.controls.paymentTypeID.markAsDirty();
    document
      .getElementById('paymentTypeName')
      ?.classList.remove('validated-input');
  }

  // updates information for expense type based on selected option from search results
  click_expenseTypeResult(expenseTypeID: number) {
    let selectedExpenseTypeElement = document.getElementById(
      'expenseTypeSearchResult_' + expenseTypeID.toString()
    );

    // update the hidden input form value for expenseTypeID
    this.form.controls.expenseType.controls.expenseTypeID.setValue(
      expenseTypeID
    );

    // hide the results since one of them has been chosen.
    this.financeService.hideHTMLElement('searchResults_expenseType');

    // update the expenseTypeName form value to utilize the selected result
    this.form.controls.expenseType.controls.expenseTypeName.setValue(
      selectedExpenseTypeElement!.title.trim()
    );

    document
      .getElementById('expenseTypeName')
      ?.classList.add('validated-input');
  }

  // updates information for payment type based on selected option from search results
  click_paymentTypeResult(
    paymentTypeID: number,
    paymentTypeCategoryID: number
  ) {
    let selectedPaymentTypeElement = document.getElementById(
      'paymentTypeSearchResult_' + paymentTypeID.toString()
    );

    // update the hidden input form values for paymentTypeID and paymentTypeCategoryID
    this.form.controls.paymentType.controls.paymentTypeID.setValue(
      paymentTypeID
    );
    this.form.controls.paymentType.controls.paymentTypeCategoryID.setValue(
      paymentTypeCategoryID
    );

    // hide the results since one of them has been chosen.
    this.financeService.hideHTMLElement('searchResults_paymentType');

    // update the paymentTypeName form value to utilize the selected result
    this.form.controls.paymentType.controls.paymentTypeName.setValue(
      selectedPaymentTypeElement!.title.trim()
    );

    document
      .getElementById('paymentTypeName')
      ?.classList.add('validated-input');
  }

  // give some time for user selection to register (up to one second). If no selection was made, try to auto-fill the selection.
  onSearchBlur(searchType: string, searchboxInputID: string) {
    setTimeout(() => {
      let userCompletedSelection: boolean = false;
      switch (searchType.toLowerCase()) {
        case 'expensetype':
          userCompletedSelection =
            this.form.controls.expenseType.controls.expenseTypeID.value !== 0;
          break;
        case 'paymenttype':
          userCompletedSelection =
            this.form.controls.paymentType.controls.paymentTypeID.value !== 0;
          break;
      }
      if (!userCompletedSelection) {
        this.financeService.selectFromListIfMatched(
          searchType,
          searchboxInputID
        );
      }
    }, 1000);
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

  hideElement(HTMLElementId: string) {
    this.financeService.hideHTMLElement(HTMLElementId);
  }
}
