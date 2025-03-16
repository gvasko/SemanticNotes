import { Injectable } from '@angular/core';
import { Note } from '../model/note';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { NotesApiService } from './api/notes-api.service';

@Injectable({
  providedIn: 'root'
})
export class NoteRepositoryService {


  constructor(private notesApiService: NotesApiService) { }

  private notes: Note[] = [];

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.notesApiService.getAll()
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
