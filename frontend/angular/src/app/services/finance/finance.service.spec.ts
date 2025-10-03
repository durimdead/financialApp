import { TestBed } from '@angular/core/testing';

import { FinanceService } from './finance.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('FinanceService', () => {
  let service: FinanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler],
    });
    service = TestBed.inject(FinanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
