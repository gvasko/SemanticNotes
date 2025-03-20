import { Injectable } from '@angular/core';
import { Note } from '../model/note';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, Subject, throwError } from 'rxjs';
import { NotesApiService } from './api/notes-api.service';

@Injectable({
  providedIn: 'root'
})
export class NoteRepositoryService {


  constructor(private notesApiService: NotesApiService) { }

  private notes: Note[] = [];

  private notesSubject = new Subject<Note[]>();

  get NotesSubject(): Subject<Note[]> { return this.notesSubject; }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.notesApiService.getAll()
        .subscribe({
          next: (allNotes) => {
            this.notes = allNotes;
            this.NotesSubject.next(allNotes);
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

  addNote(newNote: Note): Promise<Note> {
    return new Promise((resolve, reject) => {
      this.notesApiService.create(newNote)
        .subscribe({
          next: (savedNote) => {
            this.init().then(() => resolve(savedNote));
          },
          error: (error) => {
            console.error('API call error:', error);
            reject();
          }
        })
    });
  }
}
