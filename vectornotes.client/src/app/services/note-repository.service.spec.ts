import { TestBed } from '@angular/core/testing';

import { NoteRepositoryService } from './note-repository.service';

describe('NoteRepositoryService', () => {
  let service: NoteRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
