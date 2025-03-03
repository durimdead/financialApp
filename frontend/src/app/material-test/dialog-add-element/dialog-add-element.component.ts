import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';
import { PeriodicElement } from '../../../app.interfaces';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ElementService } from '../../element.service';

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
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  private elementService = inject(ElementService);
  public dialogRef = inject(MatDialogRef<DialogAddElementComponent>);



  form = new FormGroup({
    elementName: new FormControl('', { validators: [Validators.required] }),
    elementWeight: new FormControl('', { validators: [Validators.required] }),
    elementSymbol: new FormControl('', { validators: [Validators.required] }),
  });

  submitNewElement() {
    if (this.form.invalid || this.elementService.isNotANumber(this.form.controls.elementWeight.value as string)) {
      console.log('form invalid');
      return;
    }
    let newElement: PeriodicElement = {
      elementId: 0,
      isEditing: false,
      actions: '',
      name: this.form.controls.elementName.value as string,
      weight: Number(this.form.controls.elementWeight.value),
      symbol: this.form.controls.elementSymbol.value as string,
    };
    this.dialogRef.close(newElement);
  }

  // errorMessage = signal('');

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
