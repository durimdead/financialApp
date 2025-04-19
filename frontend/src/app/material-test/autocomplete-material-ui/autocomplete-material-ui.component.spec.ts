import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteMaterialUiComponent } from './autocomplete-material-ui.component';

describe('AutocompleteMaterialUiComponent', () => {
  let component: AutocompleteMaterialUiComponent;
  let fixture: ComponentFixture<AutocompleteMaterialUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteMaterialUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutocompleteMaterialUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
