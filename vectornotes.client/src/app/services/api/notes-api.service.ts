import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Note } from '../../model/note';
import { BaseApiService } from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class NotesApiService extends BaseApiService<Note> {

  constructor(http: HttpClient) {
    super(http, "/api/note");
  }
}
