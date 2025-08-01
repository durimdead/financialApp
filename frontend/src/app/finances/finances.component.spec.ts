import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancesComponent } from './finances.component';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('FinancesComponent', () => {
  let component: FinancesComponent;
  let fixture: ComponentFixture<FinancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancesComponent],
      providers: [HttpClient, HttpHandler],
    }).compileComponents();

    fixture = TestBed.createComponent(FinancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
