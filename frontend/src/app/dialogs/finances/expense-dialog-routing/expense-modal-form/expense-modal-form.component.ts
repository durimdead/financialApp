import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormValidators } from '../../../../../app.form-validators';
import { FinanceService } from '../../../../services/finance/finance.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  CRUD_STATES,
  Expense,
  ExpenseType,
  PaymentType,
} from '../../../../../app.interfaces';
import { ExpenseDialogAddComponent } from '../expense-dialog-add/expense-dialog-add.component';
import { debounceTime } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-expense-modal-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './expense-modal-form.component.html',
  styleUrl: './expense-modal-form.component.css',
})
export class ExpenseModalFormComponent implements OnInit {
  private formValidator = inject(FormValidators);
  private financeService = inject(FinanceService);
  private destroyRef = inject(DestroyRef);
  private CRUD_STATES = CRUD_STATES;
  readonly inputData = inject(MAT_DIALOG_DATA);
  readonly expenseData = input.required<Expense>();
  public dialogRef = inject(MatDialogRef<ExpenseDialogAddComponent>);
  search_expenseTypeResults = signal<ExpenseType[]>([]);
  search_paymentTypeResults = signal<PaymentType[]>([]);
  crudOperation: string = this.inputData.expenseState.toString();

  // set all the values for the form from the expense input
  ngOnInit(): void {
    if (this.crudOperation === this.CRUD_STATES.create) {
      this.crudOperation = 'Create';
    } else if (this.crudOperation === this.CRUD_STATES.update) {
      this.crudOperation = 'Edit';
      this.expenseForm.controls.expenseDate.setValue(
        new Date(this.expenseData().expenseDate.toString())
          .toISOString()
          .substring(0, 10)
      );
      this.expenseForm.controls.expenseDescription.setValue(
        this.expenseData().expenseDescription
      );
      this.expenseForm.controls.expenseAmount.setValue(
        this.expenseData().expenseAmount.toString()
      );
      this.expenseForm.controls.expenseType.controls.expenseTypeName.setValue(
        this.expenseData().expenseTypeName.toString()
      );
      this.expenseForm.controls.paymentType.controls.paymentTypeName.setValue(
        this.expenseData().paymentTypeName.toString()
      );
      this.expenseForm.controls.expenseType.controls.expenseTypeID.setValue(
        this.expenseData().expenseTypeID
      );
      this.expenseForm.controls.paymentType.controls.paymentTypeID.setValue(
        this.expenseData().paymentTypeID
      );
      this.expenseForm.controls.paymentType.controls.paymentTypeCategoryID.setValue(
        this.expenseData().paymentTypeCategoryID
      );
      this.expenseForm.controls.checkboxes.controls.isInvestment.setValue(
        this.expenseData().isInvestment
      );
      this.expenseForm.controls.checkboxes.controls.isIncome.setValue(
        this.expenseData().isIncome
      );
    }
  }

  expenseForm = new FormGroup({
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

  submitExpense() {
    if (!this.expenseForm.invalid) {
      let expenseToSendBack: Expense = {
        expenseDescription: this.expenseForm.controls.expenseDescription
          .value as string,
        expenseDate: new Date(
          this.expenseForm.controls.expenseDate.value!.toString()
        ),
        expenseAmount: Number(this.expenseForm.controls.expenseAmount.value),
        expenseID: this.expenseData().expenseID,
        expenseTypeID: Number(
          this.expenseForm.controls.expenseType.controls.expenseTypeID.value
        ),
        paymentTypeID: Number(
          this.expenseForm.controls.paymentType.controls.paymentTypeID.value
        ),
        paymentTypeCategoryID: Number(
          this.expenseForm.controls.paymentType.controls.paymentTypeCategoryID
            .value
        ),
        expenseTypeName: 'NOT USED',
        paymentTypeName: 'NOT USED',
        paymentTypeDescription: 'NOT USED',
        paymentTypeCategoryName: 'NOT USED',
        isIncome:
          this.expenseForm.controls.checkboxes.controls.isIncome.value ??
          (false as boolean),
        isInvestment:
          this.expenseForm.controls.checkboxes.controls.isInvestment.value ??
          (false as boolean),
        //TODO: possibly update this to make this no longer needed here?
        // This is never utilized outside of displaying the last
        // updated date, which is driven by the database's temporal tables.
        lastUpdated: new Date(),
      };
      this.dialogRef.close(expenseToSendBack);
    }
    // the form is invalid, ensure we show which have issues
    this.formValidator.markFormGroupAsDirtyTouched(this.expenseForm);
  }

  // give some time for user selection to register (up to one second). If no selection was made, try to auto-fill the selection.
  onSearchBlur(searchType: string, searchboxInputID: string) {
    setTimeout(() => {
      let userCompletedSelection: boolean = false;
      switch (searchType.toLowerCase()) {
        case 'expensetype':
          userCompletedSelection =
            this.expenseForm.controls.expenseType.controls.expenseTypeID
              .value !== 0;
          break;
        case 'paymenttype':
          userCompletedSelection =
            this.expenseForm.controls.paymentType.controls.paymentTypeID
              .value !== 0;
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

  // updates information for expense type based on selected option from search results
  click_expenseTypeResult(expenseTypeID: number) {
    let selectedExpenseTypeElement = document.getElementById(
      'expenseTypeSearchResult_' + expenseTypeID.toString()
    );

    // update the hidden input form value for expenseTypeID
    this.expenseForm.controls.expenseType.controls.expenseTypeID.setValue(
      expenseTypeID
    );

    // hide the results since one of them has been chosen.
    this.financeService.hideHTMLElement('searchResults_expenseType');

    // update the expenseTypeName form value to utilize the selected result
    this.expenseForm.controls.expenseType.controls.expenseTypeName.setValue(
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
    this.expenseForm.controls.paymentType.controls.paymentTypeID.setValue(
      paymentTypeID
    );
    this.expenseForm.controls.paymentType.controls.paymentTypeCategoryID.setValue(
      paymentTypeCategoryID
    );

    // hide the results since one of them has been chosen.
    this.financeService.hideHTMLElement('searchResults_paymentType');

    // update the paymentTypeName form value to utilize the selected result
    this.expenseForm.controls.paymentType.controls.paymentTypeName.setValue(
      selectedPaymentTypeElement!.title.trim()
    );

    document
      .getElementById('paymentTypeName')
      ?.classList.add('validated-input');
  }

  hideElement(HTMLElementId: string) {
    this.financeService.hideHTMLElement(HTMLElementId);
  }

  // true if error, otherwise false
  formControlHasError(formControl: FormControl) {
    return this.formValidator.formControlHasError(formControl);
  }

  // true if error, otherwise false
  formGroupHasError(formGroup: FormGroup) {
    return this.formValidator.formGroupHasError(formGroup);
  }

  // updates error information for form control
  updateFormControlErrorLabelHTML(formControl: FormControl) {
    this.formValidator.updateFormControlErrorLabelHTML(formControl);
  }

  // updates error information for form group
  getFormGroupErrorDetails(formGroup: FormGroup<any>) {
    return this.formValidator.getFormGroupErrorDetails(formGroup);
  }

  // populates dropdown with set of selectable, valid expense types to choose from
  search_expenseTypes() {
    let currentSearchCriteria =
      this.expenseForm.controls.expenseType.controls.expenseTypeName.value;

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
    this.expenseForm.controls.expenseType.controls.expenseTypeID.setValue(0);
    this.expenseForm.controls.expenseType.controls.expenseTypeID.markAsTouched();
    this.expenseForm.controls.expenseType.controls.expenseTypeID.markAsDirty();
    document
      .getElementById('expenseTypeName')
      ?.classList.remove('validated-input');
  }

  // populates dropdown with set of selectable, valid payment types to choose from
  search_paymentTypes() {
    let currentSearchCriteria =
      this.expenseForm.controls.paymentType.controls.paymentTypeName.value;

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
    this.expenseForm.controls.paymentType.controls.paymentTypeID.setValue(0);
    this.expenseForm.controls.paymentType.controls.paymentTypeCategoryID.setValue(
      0
    );
    this.expenseForm.controls.paymentType.controls.paymentTypeID.markAsTouched();
    this.expenseForm.controls.paymentType.controls.paymentTypeID.markAsDirty();
    document
      .getElementById('paymentTypeName')
      ?.classList.remove('validated-input');
  }
}
