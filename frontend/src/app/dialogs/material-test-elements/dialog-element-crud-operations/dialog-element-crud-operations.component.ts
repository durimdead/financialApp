import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ElementService } from '../../../services/periodic-elements/element.service';
import { DialogDeleteElementConfirmationComponent } from './dialog-delete-element-confirmation/dialog-delete-element-confirmation.component';
import { DialogAddElementComponent } from './dialog-add-element/dialog-add-element.component';
import { DialogEditElementComponent } from './dialog-edit-element/dialog-edit-element.component';

@Component({
  selector: 'app-dialog-element-crud-operations',
  imports: [
    DialogDeleteElementConfirmationComponent,
    DialogAddElementComponent,
	DialogEditElementComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-element-crud-operations.component.html',
  styleUrl: './dialog-element-crud-operations.component.css',
})
export class DialogElementCrudOperationsComponent {
  //   readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly inputData = inject(MAT_DIALOG_DATA);
  private elementService = inject(ElementService);

  getElementCrudStates() {
    return this.elementService.crudStates;
  }
}
