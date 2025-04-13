import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { NoteCollection } from '../../model/note-collection';
import { NoteCollectionPreview } from '../../model/note-collection-preview';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NoteCollectionsApiService extends BaseApiService<NoteCollection, NoteCollectionPreview> {

  constructor(http: HttpClient) {
    super(http, "/api/notecollection");
  }
}
