import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDialogEditComponent } from './expense-dialog-edit.component';

describe('ExpenseDialogEditComponent', () => {
  let component: ExpenseDialogEditComponent;
  let fixture: ComponentFixture<ExpenseDialogEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseDialogEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseDialogEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
