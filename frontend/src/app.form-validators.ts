import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

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
}
