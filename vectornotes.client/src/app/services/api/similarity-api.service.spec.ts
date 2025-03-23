import { TestBed } from '@angular/core/testing';

import { SimilarityApiService } from './similarity-api.service';

describe('SimilarityApiService', () => {
  let service: SimilarityApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimilarityApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
