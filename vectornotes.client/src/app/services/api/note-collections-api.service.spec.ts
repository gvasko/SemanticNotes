import { TestBed } from '@angular/core/testing';

import { NoteCollectionsApiService } from './note-collections-api.service';

describe('NoteCollectionsApiService', () => {
  let service: NoteCollectionsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteCollectionsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
