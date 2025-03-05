import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogElementCrudOperationsComponent } from './dialog-element-crud-operations.component';

describe('DialogElementCrudOperationsComponent', () => {
  let component: DialogElementCrudOperationsComponent;
  let fixture: ComponentFixture<DialogElementCrudOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogElementCrudOperationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogElementCrudOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
