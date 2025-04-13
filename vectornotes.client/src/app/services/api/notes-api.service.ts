import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Note } from '../../model/note';
import { BaseApiService } from './base-api.service';
import { NotePreview } from '../../model/note-preview';

@Injectable({
  providedIn: 'root'
})
export class NotesApiService extends BaseApiService<Note, NotePreview> {

  constructor(http: HttpClient) {
    super(http, "/api/note");
  }
}
