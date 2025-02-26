import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {MatTableModule, MatTableDataSource} from '@angular/material/table'

@Component({
  selector: 'app-finances',
  imports: [RouterLink],
  templateUrl: './finances.component.html',
  styleUrl: './finances.component.css'
})
export class FinancesComponent {
  myData = [];
}
