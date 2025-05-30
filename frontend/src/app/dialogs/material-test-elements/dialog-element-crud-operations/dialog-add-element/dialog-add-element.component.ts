import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PeriodicElement } from '../../../../../app.interfaces';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ElementService } from '../../../../services/periodic-elements/element.service';
import { FormValidators } from '../../../../../app.form-validators';

@Component({
  selector: 'app-dialog-add-element',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-add-element.component.html',
  styleUrl: './dialog-add-element.component.css',
})
export class DialogAddElementComponent {
  readonly inputData = inject(MAT_DIALOG_DATA);
  private elementService = inject(ElementService);
  public dialogRef = inject(MatDialogRef<DialogAddElementComponent>);
  private formValidator = inject(FormValidators);

  form = new FormGroup({
    elementName: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    elementWeight: new FormControl('', [
      Validators.required,
      this.formValidator.mustBeANumber,
    ]),
    elementSymbol: new FormControl('', {
		validators: [Validators.required, Validators.maxLength(3)]
	}),
  });

  getElementCrudStates() {
    return this.elementService.crudStates;
  }

  // if the form is valid, submit the element information.
  submitNewElement() {
    // form is valid - bubble up element to Add
    if (!this.form.invalid) {
      let newElement: PeriodicElement = {
        elementID: this.elementService.getNextElementId(),
        elementName: this.form.controls.elementName.value as string,
        elementWeight: Number(this.form.controls.elementWeight.value),
        elementSymbol: this.form.controls.elementSymbol.value as string,
      };
      this.dialogRef.close(newElement);
    }
    // the form is invalid, ensure we show which have issues
    this.formValidator.markFormGroupAsDirtyTouched(this.form);
  }

  hasError(formControl: FormControl) {
    if (formControl.touched && formControl.dirty && formControl.invalid) {
      return true;
    }
    return false;
  }

  //TODO: 	need to update this to put these messages more specfically WITHIN the form as this appears to be
  // 		the more standardized way to do this
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
      } else if (currentError === 'isNotANumber') {
        currentErrorMessage = 'This must be Numeric.';
      } else if (currentError === 'maxlength'){
		currentErrorMessage = 'Maximum Length : ' + controlErrors[currentError].requiredLength;
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

  // constructor() {
  // merge(this.email.statusChanges, this.email.valueChanges)
  //   .pipe(takeUntilDestroyed())
  //   .subscribe(() => this.updateErrorMessage());
  // }

  // updateErrorMessage() {
  //   if (this.email.hasError('required')) {
  //     this.errorMessage.set('You must enter a value');
  //   } else if (this.email.hasError('email')) {
  //     this.errorMessage.set('Not a valid email');
  //   } else {
  //     this.errorMessage.set('');
  //   }
  // }
}
