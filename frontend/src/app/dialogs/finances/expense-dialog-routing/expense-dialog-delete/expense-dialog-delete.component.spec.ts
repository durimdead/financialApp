import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDialogDeleteComponent } from './expense-dialog-delete.component';

describe('ExpenseDialogDeleteComponent', () => {
  let component: ExpenseDialogDeleteComponent;
  let fixture: ComponentFixture<ExpenseDialogDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseDialogDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseDialogDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
