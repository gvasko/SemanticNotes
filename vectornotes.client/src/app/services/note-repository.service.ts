import { Injectable } from '@angular/core';
import { Note } from '../model/note';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteRepositoryService {


  constructor(private http: HttpClient) { }
  public static readonly NotesApiUri = '/api/notes';

  private notes: Note[] = [];

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<Note[]>(NoteRepositoryService.NotesApiUri)
        .subscribe({
          next: (allNotes) => {
            this.notes = allNotes;
            resolve();
          },
          error: (error) => {
            console.error('API call error:', error);
            reject();
          }
        })
    });
  }

  getNotes(): Note[] {
    return this.notes;
  }

  addNote(note: Note) {
    this.notes.push(note);
  }
}
