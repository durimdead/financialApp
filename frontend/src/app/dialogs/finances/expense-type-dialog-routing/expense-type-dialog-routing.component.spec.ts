import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTypeDialogRoutingComponent } from './expense-type-dialog-routing.component';

describe('ExpenseTypeDialogRoutingComponent', () => {
  let component: ExpenseTypeDialogRoutingComponent;
  let fixture: ComponentFixture<ExpenseTypeDialogRoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseTypeDialogRoutingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseTypeDialogRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
