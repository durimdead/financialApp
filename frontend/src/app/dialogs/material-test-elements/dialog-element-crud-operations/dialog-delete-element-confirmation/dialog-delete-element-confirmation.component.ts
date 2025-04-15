import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogModule} from '@angular/material/dialog';
import { PeriodicElement } from '../../../../../app.interfaces';

@Component({
  selector: 'app-dialog-delete-element-confirmation',
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-delete-element-confirmation.component.html',
  styleUrl: './dialog-delete-element-confirmation.component.css'
})
export class DialogDeleteElementConfirmationComponent {
  elementData = input.required<PeriodicElement>()
}