import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-delete-element-confirmation',
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-delete-element-confirmation.component.html',
  styleUrl: './dialog-delete-element-confirmation.component.css'
})
export class DialogDeleteElementConfirmationComponent {
  readonly inputData = JSON.parse(inject(MAT_DIALOG_DATA));
}