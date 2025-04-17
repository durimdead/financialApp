import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidators } from '../../../../../app.form-validators';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-expense-dialog-add',
  imports: [MatFormFieldModule,
	  MatInputModule,
	  FormsModule,
	  ReactiveFormsModule,
	  MatDialogModule,
	  MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expense-dialog-add.component.html',
  styleUrl: './expense-dialog-add.component.css',
})
export class ExpenseDialogAddComponent {
  readonly inputData = inject(MAT_DIALOG_DATA);
  private formValidator = inject(FormValidators);

	ngOnInit(){
		// console.log('inside the add dialog');
	}

  form = new FormGroup({
    //TODO: add in validator to make sure it's a valid date
    expenseDate: new FormControl(new Date(), {
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
  });
}
