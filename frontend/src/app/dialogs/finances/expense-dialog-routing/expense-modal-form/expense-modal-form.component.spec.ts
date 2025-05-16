import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseModalFormComponent } from './expense-modal-form.component';

describe('ExpenseModalFormComponent', () => {
  let component: ExpenseModalFormComponent;
  let fixture: ComponentFixture<ExpenseModalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseModalFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseModalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
