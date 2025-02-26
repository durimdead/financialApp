import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTestComponent } from './material-test.component';

describe('MaterialTestComponent', () => {
  let component: MaterialTestComponent;
  let fixture: ComponentFixture<MaterialTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
