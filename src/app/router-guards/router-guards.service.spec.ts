import { inject, TestBed } from '@angular/core/testing';

import { RouteGuardService } from './router-guards.service';

describe('RouteGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouteGuardService],
    });
  });

  it('should be created', inject([RouteGuardService], (service: RouteGuardService) => {
    expect(service).toBeTruthy();
  }));
});
