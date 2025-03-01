import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { PeriodicElement } from '../../../app.interfaces';

@Component({
  selector: 'app-dialog-add-element',
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-add-element.component.html',
  styleUrl: './dialog-add-element.component.css'
})
export class DialogAddElementComponent {

  submitNewElement(){
    let newElement: PeriodicElement = {
      elementId: 0,
      isEditing: false,
      actions: '',
      name: 'someElement',
      weight: 1.023,
      symbol: 'NA',
    }
    return newElement;
  }
}
