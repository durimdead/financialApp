import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTypeCategoryDialogRoutingComponent } from './payment-type-category-dialog-routing.component';

describe('PaymentTypeCategoryDialogRoutingComponent', () => {
  let component: PaymentTypeCategoryDialogRoutingComponent;
  let fixture: ComponentFixture<PaymentTypeCategoryDialogRoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTypeCategoryDialogRoutingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTypeCategoryDialogRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
