import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDialogAddComponent } from './expense-dialog-add.component';

describe('ExpenseDialogAddComponent', () => {
  let component: ExpenseDialogAddComponent;
  let fixture: ComponentFixture<ExpenseDialogAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseDialogAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseDialogAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
