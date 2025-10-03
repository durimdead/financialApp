import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CRUD_STATES } from '../../../../app.interfaces';
import { ExpenseDialogAddComponent } from './expense-dialog-add/expense-dialog-add.component';
import { ExpenseDialogDeleteComponent } from './expense-dialog-delete/expense-dialog-delete.component';
import { ExpenseDialogEditComponent } from './expense-dialog-edit/expense-dialog-edit.component';

@Component({
  selector: 'app-expense-dialog-routing',
  imports: [ExpenseDialogAddComponent, ExpenseDialogDeleteComponent, ExpenseDialogEditComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expense-dialog-routing.component.html',
  styleUrl: './expense-dialog-routing.component.css',
})
export class ExpenseDialogRoutingComponent {
  readonly inputData = inject(MAT_DIALOG_DATA);
  private CRUD_STATES = CRUD_STATES;

  getCrudStates() {
    return this.CRUD_STATES;
  }
}
