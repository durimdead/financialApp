import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatTableModule} from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-finances',
  imports: [MatTableModule, MatSortModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './finances.component.html',
  styleUrl: './finances.component.css',
})
export class FinancesComponent {
  //TODO: start filling in with code for the finance component items.

  openAddExpenseModal(): void {
    console.log('adding expense');
  }
}
