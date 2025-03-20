import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
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
        ? this.inputData.elementData.elementName
        : '',
      {
        validators: [Validators.required, Validators.minLength(3)],
      }
    ),
    elementWeight: new FormControl(
      this.inputData.elementData.elementId > 0
        ? this.inputData.elementData.elementWeight
        : '',
      [Validators.required, this.formValidator.mustBeNumber]
    ),
    elementSymbol: new FormControl(
      this.inputData.elementData.elementId > 0
        ? this.inputData.elementData.elementSymbol
        : '',
      {
        validators: [Validators.required, Validators.maxLength(3)],
      }
    ),
  });

  getElementCrudStates() {
    return this.elementService.crudStates;
  }

  saveEditedElement() {
    if (!this.form.invalid) {
      let editedElement = this.inputData.elementData;
      editedElement.elementName = this.form.controls.elementName.value;
      editedElement.elementWeight = Number(this.form.controls.elementWeight.value);
      editedElement.elementSymbol = this.form.controls.elementSymbol.value;
      this.dialogRef.close(editedElement);
    }
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
      } else if (currentError === 'maxlength') {
        currentErrorMessage =
          'Maximum Length : ' + controlErrors[currentError].requiredLength;
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
}
