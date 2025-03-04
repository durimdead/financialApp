import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidators {
  mustBeNumber(control: AbstractControl) {
    if (Number.isNaN(Number(control.value))) {
      return { isNotANumber: true };
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

  //********************************************
  //********************************************
  //#endregion mark-form-group-dirty-touched
}
