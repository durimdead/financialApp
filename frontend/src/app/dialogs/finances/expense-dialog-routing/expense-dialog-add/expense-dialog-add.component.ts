import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FinanceService } from '../../../../services/finance/finance.service';
import { CRUD_STATES } from '../../../../../app.interfaces';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-expense-dialog-add',
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './expense-dialog-add.component.html',
  styleUrl: './expense-dialog-add.component.css',
})
export class ExpenseDialogAddComponent {
  readonly inputData = inject(MAT_DIALOG_DATA);
//   private financeService = inject(FinanceService);
  private CRUD_STATES = CRUD_STATES;

//   getCrudStates(){
// 	return this.CRUD_STATES;
//   }
}
