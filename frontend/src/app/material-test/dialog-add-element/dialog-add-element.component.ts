import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
import { PeriodicElement } from '../../../app.interfaces';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ElementService } from '../../element.service';
import { FormValidators } from '../../../app.form-validators';

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
//   readonly email = new FormControl('', [Validators.required, Validators.email]);
  private elementService = inject(ElementService);
  public dialogRef = inject(MatDialogRef<DialogAddElementComponent>);
  private formValidator = inject(FormValidators);

  form = new FormGroup({
    elementName: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
    elementWeight: new FormControl('', {
      validators: [Validators.required, this.formValidator.mustBeNumber],
    }),
    elementSymbol: new FormControl('', { validators: [Validators.required] }),
  });

  // if the form is valid, submit the element information.
  submitNewElement() {
    // form is valid - bubble up element to Add
    if (!this.form.invalid) {
      let newElement: PeriodicElement = {
        elementId: this.elementService.getNextElementId(),
        isEditing: false,
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

  hasError(formControl: FormControl){
	if(formControl.touched && formControl.dirty && formControl.invalid){
		return true;
	}
	return false;
  }

  getFormControlErrorDetails(formControl: FormControl){
	let messageToShow = '';
	const controlErrors: ValidationErrors = formControl.errors as ValidationErrors;
	Object.keys(controlErrors).forEach(currentError => {
		console.log('keyError: ' + currentError);
		console.log('errorValue: ');
		console.log(controlErrors[currentError]);
		let currentErrorMessage = '';
		if(currentError === 'required'){
			currentErrorMessage = 'Field is required.';
		}
		else if (currentError === 'minlength'){
			currentErrorMessage = 'Minimum Length : ' + controlErrors[currentError].requiredLength;
		}
		else if (currentError === '_subscribe'){
			currentErrorMessage = 'Must Be a Number.';
			// currentErrorMessage = 'customError : Must Be a Number (most likely)';
			//TODO: look up "subscribe to custom validation errors"
		}
		else{
			currentErrorMessage = 'some other message';
		}
		console.log('current error\'s message : ' + currentErrorMessage);
		// else if (currentError.)
		if (messageToShow.length > 0){
			messageToShow += '<br/>';
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
