import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditElementComponent } from './dialog-edit-element.component';

describe('DialogEditElementComponent', () => {
  let component: DialogEditElementComponent;
  let fixture: ComponentFixture<DialogEditElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
