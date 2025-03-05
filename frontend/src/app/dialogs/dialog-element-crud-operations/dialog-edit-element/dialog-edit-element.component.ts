import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';
import { PeriodicElement } from '../../../../app.interfaces';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ElementService } from '../../../element.service';
import { FormValidators } from '../../../../app.form-validators';
@Component({
  selector: 'app-dialog-edit-element',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-edit-element.component.html',
  styleUrl: './dialog-edit-element.component.css',
})
export class DialogEditElementComponent {
  //   readonly email = new FormControl('', [Validators.required, Validators.email]);
  elementData = input.required<PeriodicElement>();
  readonly inputData = inject(MAT_DIALOG_DATA);
  private elementService = inject(ElementService);
  public dialogRef = inject(MatDialogRef<DialogEditElementComponent>);
  private formValidator = inject(FormValidators);

  form = new FormGroup({
    elementName: new FormControl(
      this.inputData.elementData.elementId > 0
        ? this.inputData.elementData.name
        : '',
      {
        validators: [Validators.required, Validators.minLength(3)],
      }
    ),
    elementWeight: new FormControl(
      this.inputData.elementData.elementId > 0
        ? this.inputData.elementData.weight
        : '',
      [Validators.required, this.formValidator.mustBeNumber]
    ),
    elementSymbol: new FormControl(
      this.inputData.elementData.elementId > 0
        ? this.inputData.elementData.symbol
        : '',
      [Validators.required]
    ),
  });

  getElementCrudStates() {
    return this.elementService.crudStates;
  }

  saveEditedElement() {
    if (!this.form.invalid) {
      let editedElement = this.inputData.elementData;
      editedElement.name = this.form.controls.elementName.value;
      editedElement.weight = this.form.controls.elementWeight.value;
      editedElement.symbol = this.form.controls.elementSymbol.value;
      this.dialogRef.close(editedElement);
    }
  }

  // if the form is valid, submit the element information.
  submitNewElement() {
    // form is valid - bubble up element to Add
    if (!this.form.invalid) {
      let newElement: PeriodicElement = {
        elementId: this.elementService.getNextElementId(),
        actions: '',
        name: this.form.controls.elementName.value as string,
        weight: Number(this.form.controls.elementWeight.value),
        symbol: this.form.controls.elementSymbol.value as string,
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
