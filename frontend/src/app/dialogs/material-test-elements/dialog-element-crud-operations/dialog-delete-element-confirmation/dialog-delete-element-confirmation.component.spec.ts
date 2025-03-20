import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDeleteElementConfirmationComponent } from './dialog-delete-element-confirmation.component';

describe('DialogDeleteElementConfirmationComponent', () => {
  let component: DialogDeleteElementConfirmationComponent;
  let fixture: ComponentFixture<DialogDeleteElementConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDeleteElementConfirmationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogDeleteElementConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
