import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTypeDialogRoutingComponent } from './payment-type-dialog-routing.component';

describe('PaymentTypeDialogRoutingComponent', () => {
  let component: PaymentTypeDialogRoutingComponent;
  let fixture: ComponentFixture<PaymentTypeDialogRoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTypeDialogRoutingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTypeDialogRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
