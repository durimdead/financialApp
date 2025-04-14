import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseDialogRoutingComponent } from './expense-dialog-routing.component';

describe('ExpenseDialogRoutingComponent', () => {
  let component: ExpenseDialogRoutingComponent;
  let fixture: ComponentFixture<ExpenseDialogRoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseDialogRoutingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseDialogRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
