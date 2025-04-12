import { TestBed } from '@angular/core/testing';

import { StoriesServiceService } from './stories-service.service';

describe('StoriesServiceService', () => {
  let service: StoriesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoriesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
