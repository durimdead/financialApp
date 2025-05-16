import { Injectable, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Expense } from './app.interfaces';

@Injectable({
  providedIn: 'root',
})
export class FormValidators {
  cannotSelectBoth(
    checkboxName1: string,
    checkboxName2: string
  ): import('@angular/forms').ValidatorFn {
    return (control: AbstractControl) => {
      const compareValue1 = control.get(checkboxName1)?.value;
      const compareValue2 = control.get(checkboxName2)?.value;

      if (compareValue1 === true && compareValue2 === true) {
        return { valuesBothSelected: true };
      }
      return null;
    };
  }

  mustBeANumber(control: AbstractControl) {
    if (Number.isNaN(Number(control.value))) {
      return { isNotANumber: true };
    }
    return null;
  }

  mustNotBeZero(control: AbstractControl) {
    if (!Number.isNaN(Number(control.value)) && Number(control.value) === 0) {
      return { valueIsZero: true };
    }
    return null;
  }

  mustBeADate(control: AbstractControl) {
    let dateFromControl = new Date(control.value);
    if (isNaN(dateFromControl.getTime())) {
      return { isNotADate: true };
    }
    return null;
  }

  isValidExpenseType(control: AbstractControl) {
    if (Number(control.value) === 0) {
      return { mustSelectValidExpenseType: true };
    }
    return null;
  }

  isValidPaymentType(control: AbstractControl) {
    if (Number(control.value) === 0) {
      return { mustSelectValidPaymentType: true };
    }
    return null;
  }

  isValidPaymentCategoryType(control: AbstractControl) {
    if (Number(control.value) === 0) {
      return { mustSelectValidPaymentCategoryType: true };
    }
    return null;
  }

  compileValidationErrorMessage(formGroup: FormGroup) {}

  //#region mark-form-group-dirty-touched
  //********************************************
  //********************************************

  // entry point for marking the form group dirty/touched
  markFormGroupAsDirtyTouched(form: FormGroup) {
    this.markGroupDirtyTouched(form);
  }

  // recursively marks a formGroup as dirty and Touched
  private markGroupDirtyTouched(formGroup: FormGroup) {
    formGroup.markAsDirty();
    formGroup.markAsTouched();
    Object.keys(formGroup.controls).forEach((key) => {
      let currentItem = formGroup.get(key);
      if (currentItem instanceof FormGroup) {
        this.markGroupDirtyTouched(currentItem as FormGroup);
      } else if (currentItem instanceof FormArray) {
        this.markArrayDirtyTouched(currentItem as FormArray);
      } else if (currentItem instanceof FormControl) {
        this.markControlDirty(currentItem as FormControl);
      }
    });
  }

  // recursively mark formArray as dirty and touched
  private markArrayDirtyTouched(formArray: FormArray) {
    formArray.markAsDirty();
    formArray.markAsTouched();
    formArray.controls.forEach((control) => {
      if (control instanceof FormGroup) {
        this.markGroupDirtyTouched(control as FormGroup);
      } else if (control instanceof FormArray) {
        this.markArrayDirtyTouched(control as FormArray);
      } else if (control instanceof FormControl) {
        this.markControlDirty(control as FormControl);
      }
    });
  }

  // mark form control dirty and touched
  private markControlDirty(formControl: FormControl) {
    formControl.markAsDirty();
    formControl.markAsTouched();
  }

  getFormControlErrorDetails(formControl: FormControl) {
    let messageToShow = '';
    const controlErrors: ValidationErrors =
      formControl.errors as ValidationErrors;
    Object.keys(controlErrors).forEach((currentError) => {
      let currentErrorMessage = '';
      if (currentError === 'required') {
        currentErrorMessage = 'Field is required.';
      } else if (currentError === 'minlength') {
        currentErrorMessage =
          'Minimum Length : ' + controlErrors[currentError].requiredLength;
      } else if (currentError === 'maxlength') {
        currentErrorMessage =
          'Maximum Length : ' + controlErrors[currentError].requiredLength;
      } else if (currentError === 'isNotANumber') {
        currentErrorMessage = 'This must be Numeric.';
      } else if (currentError === 'isNotADate') {
        currentErrorMessage = 'This value must be a valid date.';
      } else if (currentError === 'valueIsZero') {
        currentErrorMessage = 'This value must not be zero.';
      } else if (currentError === 'mustSelectValidExpenseType') {
        currentErrorMessage = 'A valid Expense Type must be selected.';
      } else if (currentError === 'mustSelectValidPaymentType') {
        currentErrorMessage = 'A valid Payment Type must be selected.';
      } else {
        currentErrorMessage = 'Unknown validation error.';
      }

      //TODO: still need to fix this part to show multiple lines rather than a "::::" separator
      if (messageToShow.length > 0) {
        messageToShow += ' :::: ';
      }
      messageToShow += currentErrorMessage;
    });
    return messageToShow;
  }

  getFormControlErrorDetailsHTML(formControl: FormControl) {
    let messageToShow = '';
    const controlErrors: ValidationErrors =
      formControl.errors as ValidationErrors;
    Object.keys(controlErrors).forEach((currentError) => {
      let currentErrorMessage = '';
      if (currentError === 'required') {
        currentErrorMessage = 'Field is required.';
      } else if (currentError === 'minlength') {
        currentErrorMessage =
          'Minimum Length : ' + controlErrors[currentError].requiredLength;
      } else if (currentError === 'maxlength') {
        currentErrorMessage =
          'Maximum Length : ' + controlErrors[currentError].requiredLength;
      } else if (currentError === 'isNotANumber') {
        currentErrorMessage = 'This must be Numeric.';
      } else if (currentError === 'isNotADate') {
        currentErrorMessage = 'This value must be a valid date.';
      } else if (currentError === 'valueIsZero') {
        currentErrorMessage = 'This value must not be zero.';
      } else if (currentError === 'mustSelectValidExpenseType') {
        currentErrorMessage = 'A valid Expense Type must be selected.';
      } else if (currentError === 'mustSelectValidPaymentType') {
        currentErrorMessage = 'A valid Payment Type must be selected.';
      } else {
        currentErrorMessage = 'Unknown validation error.';
      }

      if (messageToShow.length > 0) {
        messageToShow += '<br/>';
      }
      messageToShow += currentErrorMessage;
    });
    return messageToShow;
  }

  getFormGroupErrorDetails(formGroup: FormGroup<any>) {
    let messageToShow = '';
    const groupErrors: ValidationErrors = formGroup.errors as ValidationErrors;
    Object.keys(groupErrors).forEach((currentError) => {
      let currentErrorMessage = '';
      if (currentError === 'valuesBothSelected') {
        currentErrorMessage = 'Cannot have both checkboxes selected.';
      } else {
        currentErrorMessage = 'Unknown validation error.';
      }

      //TODO: still need to fix this part
      if (messageToShow.length > 0) {
        messageToShow += ' :::: ';
      }
      messageToShow += currentErrorMessage;
    });
    return messageToShow;
  }

  //********************************************
  //********************************************
  //#endregion mark-form-group-dirty-touched

  formControlHasError(formControl: FormControl) {
    if (formControl.touched && formControl.dirty && formControl.invalid) {
      return true;
    }
    if (formControl.touched && formControl.dirty) {
      let formControlID = this.getFormControlID(formControl);
      formControlID = formControlID === undefined ? '' : formControlID!;
      document.getElementById(formControlID)?.classList.add('validated-input');
    }
    return false;
  }

  formGroupHasError(formGroup: FormGroup) {
    if (formGroup.touched && formGroup.dirty && formGroup.invalid) {
      return true;
    }
    return false;
  }

  updateFormControlErrorLabelHTML(formControl: FormControl) {
    let formControlID = this.getFormControlID(formControl);
    if (formControlID === null) throw 'form control does not exist';
    let errorMessage = this.getFormControlErrorDetailsHTML(formControl);
    if (errorMessage !== '') {
      document.getElementById(
        'errorLabel_' + formControlID.toString()
      )!.innerHTML = errorMessage;
    }
  }

  // extracts the ID of a given FormControl given the control
  private getFormControlID(control: FormControl): string | null {
    let group = <FormGroup>control.parent;

    // if we can't find the group, it is the actual group and doesn't have an ID
    if (!group) {
      return null;
    }

    let name: string;

    // go through the objects and find the ID for the control that matches.
    Object.keys(group.controls).forEach((key) => {
      let childControl = group.get(key);
      if (childControl === control) {
        name = key;
      }
    });

    return name!;
  }

  extractExpenseToSubmit() {
    if (!this.expenseForm.invalid) {
		let newExpense:Expense = {
        expenseDescription: this.expenseForm.controls.expenseDescription
          .value as string,
        expenseDate: new Date(
          this.expenseForm.controls.expenseDate.value!.toString()
        ),
        expenseAmount: Number(this.expenseForm.controls.expenseAmount.value),
        expenseID: 0,
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
        expenseTypeName: 'NOT USED FOR ADD',
        paymentTypeName: 'NOT USED FOR ADD',
        paymentTypeDescription: 'NOT USED FOR ADD',
        paymentTypeCategoryName: 'NOT USED FOR ADD',
        isIncome: this.expenseForm.controls.checkboxes.controls.isIncome
          .value ?? false as boolean,
        isInvestment: this.expenseForm.controls.checkboxes.controls.isInvestment
          .value ?? false as boolean,
        //TODO: possibly update this to make this no longer needed here?
        // This is never utilized outside of displaying the last
        // updated date, which is driven by the database's temporal tables.
        lastUpdated: new Date(),
      };
	  return newExpense;
    }
    // the form is invalid, ensure we show which have issues
    this.markFormGroupAsDirtyTouched(this.expenseForm);
	return undefined;
  }

  //TODO: probably move this to a "Forms" class to store all of the form structures for
  // the different CRUD operations
  expenseForm = new FormGroup({
    expenseDate: new FormControl(new Date().toISOString().substring(0, 10), {
      validators: [Validators.required, this.mustBeADate],
    }),
    expenseDescription: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    expenseAmount: new FormControl('', {
      validators: [Validators.required, this.mustBeANumber, this.mustNotBeZero],
    }),
    expenseType: new FormGroup(
      {
        expenseTypeName: new FormControl('', {}),
        expenseTypeID: new FormControl(0, {
          validators: [Validators.required, this.isValidExpenseType],
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
          validators: [Validators.required, this.isValidPaymentType],
        }),
        paymentTypeCategoryID: new FormControl(0, {
          validators: [Validators.required, this.isValidPaymentCategoryType],
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
        validators: [this.cannotSelectBoth('isInvestment', 'isIncome')],
      }
    ),
  });
}
