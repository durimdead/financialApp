import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormValidators {
  mustBeNumber(control: AbstractControl) {
    if (Number.isNaN(Number(control.value))) {
      return of({ isNotNumber: true });
    }
    return null;
  }

  markFormGroupAsDirtyTouched(form: FormGroup) {
    this.markGroupDirtyTouched(form);
  }

  /********************************************
   *
   * START: marking form controls as dirty.
   * 		Might need more functions later
   *
   *******************************************/
  // recursively marks a formGroup as dirty and Touched
  private markGroupDirtyTouched(formGroup: FormGroup) {
    formGroup.markAllAsTouched();
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

  private markArrayDirtyTouched(formArray: FormArray) {
    formArray.markAllAsTouched();
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

  private markControlDirty(formControl: FormControl) {
    formControl.markAsDirty();
  }

  /********************************************
   *
   * END:   marking form controls as dirty.
   * 		Might need more functions later
   *
   *******************************************/
}
