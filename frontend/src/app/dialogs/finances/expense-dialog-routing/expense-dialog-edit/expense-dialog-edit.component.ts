import {
  ChangeDetectionStrategy,
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
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  Expense,
  ExpenseType,
  PaymentType,
} from '../../../../../app.interfaces';
import { FormValidators } from '../../../../../app.form-validators';
import { FinanceService } from '../../../../services/finance/finance.service';
import { ExpenseDialogAddComponent } from '../expense-dialog-add/expense-dialog-add.component';
import { debounceTime } from 'rxjs';

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
  private formValidator = inject(FormValidators);
  private financeService = inject(FinanceService);
  private destroyRef = inject(DestroyRef);
  readonly inputData = inject(MAT_DIALOG_DATA);
  readonly expenseData = input.required<Expense>();
  public dialogRef = inject(MatDialogRef<ExpenseDialogAddComponent>);
  search_expenseTypeResults = signal<ExpenseType[]>([]);
  search_paymentTypeResults = signal<PaymentType[]>([]);

  // set all the values for the form from the expense input
  ngOnInit(): void {
    this.getForm().controls.expenseDate.setValue(
      new Date(this.expenseData().expenseDate.toString())
        .toISOString()
        .substring(0, 10)
    );
    this.getForm().controls.expenseDescription.setValue(
      this.expenseData().expenseDescription
    );
    this.getForm().controls.expenseAmount.setValue(
      this.expenseData().expenseAmount.toString()
    );
    this.getForm().controls.expenseType.controls.expenseTypeName.setValue(
      this.expenseData().expenseTypeName.toString()
    );
    this.getForm().controls.paymentType.controls.paymentTypeName.setValue(
      this.expenseData().paymentTypeName.toString()
    );
    this.getForm().controls.expenseType.controls.expenseTypeID.setValue(
      this.expenseData().expenseTypeID
    );
    this.getForm().controls.paymentType.controls.paymentTypeID.setValue(
      this.expenseData().paymentTypeID
    );
    this.getForm().controls.paymentType.controls.paymentTypeCategoryID.setValue(
      this.expenseData().paymentTypeCategoryID
    );
    this.getForm().controls.checkboxes.controls.isInvestment.setValue(
      this.expenseData().isInvestment
    );
    this.getForm().controls.checkboxes.controls.isIncome.setValue(
      this.expenseData().isIncome
    );
  }

  getForm(){
	return this.formValidator.expenseForm;
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
      this.getForm().controls.expenseType.controls.expenseTypeName.value;

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
    this.getForm().controls.expenseType.controls.expenseTypeID.setValue(0);
    this.getForm().controls.expenseType.controls.expenseTypeID.markAsTouched();
    this.getForm().controls.expenseType.controls.expenseTypeID.markAsDirty();
    document
      .getElementById('expenseTypeName')
      ?.classList.remove('validated-input');
  }

  // populates dropdown with set of selectable, valid payment types to choose from
  search_paymentTypes() {
    let currentSearchCriteria =
      this.getForm().controls.paymentType.controls.paymentTypeName.value;

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
    this.getForm().controls.paymentType.controls.paymentTypeID.setValue(0);
    this.getForm().controls.paymentType.controls.paymentTypeCategoryID.setValue(0);
    this.getForm().controls.paymentType.controls.paymentTypeID.markAsTouched();
    this.getForm().controls.paymentType.controls.paymentTypeID.markAsDirty();
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
    this.getForm().controls.expenseType.controls.expenseTypeID.setValue(
      expenseTypeID
    );

    // hide the results since one of them has been chosen.
    this.financeService.hideHTMLElement('searchResults_expenseType');

    // update the expenseTypeName form value to utilize the selected result
    this.getForm().controls.expenseType.controls.expenseTypeName.setValue(
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
    this.getForm().controls.paymentType.controls.paymentTypeID.setValue(
      paymentTypeID
    );
    this.getForm().controls.paymentType.controls.paymentTypeCategoryID.setValue(
      paymentTypeCategoryID
    );

    // hide the results since one of them has been chosen.
    this.financeService.hideHTMLElement('searchResults_paymentType');

    // update the paymentTypeName form value to utilize the selected result
    this.getForm().controls.paymentType.controls.paymentTypeName.setValue(
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
            this.getForm().controls.expenseType.controls.expenseTypeID.value !== 0;
          break;
        case 'paymenttype':
          userCompletedSelection =
            this.getForm().controls.paymentType.controls.paymentTypeID.value !== 0;
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

  hideElement(HTMLElementId: string) {
    this.financeService.hideHTMLElement(HTMLElementId);
  }
}
