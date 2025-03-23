import { Injectable } from '@angular/core';
import { Note } from '../model/note';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, Subject, throwError } from 'rxjs';
import { NotesApiService } from './api/notes-api.service';
import { NotePreview } from '../model/note-preview';

@Injectable({
  providedIn: 'root'
})
export class NoteRepositoryService {


  constructor(private notesApiService: NotesApiService) { }

  private notes: NotePreview[] = [];

  private notesSubject = new Subject<NotePreview[]>();
  private noteUpdateSubject = new Subject<Note>();

  get NotesSubject(): Subject<NotePreview[]> { return this.notesSubject; }
  get NoteUpdateSubject(): Subject<Note> { return this.noteUpdateSubject; }

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

  getNotes(): NotePreview[] {
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

  getNote(id: number): Promise<Note> {
    return new Promise((resolve, reject) => {
      this.notesApiService.getById(id)
        .subscribe({
          next: (note) => {
            resolve(note);
          },
          error: (error) => {
            console.error('API call error:', error);
            reject();
          }
        })
    });
  }

  updateNote(existingNote: Note): Promise<Note> {
    return new Promise((resolve, reject) => {
      this.notesApiService.update(existingNote)
        .subscribe({
          next: (savedNote) => {
            let index = this.notes.findIndex(note => note.id === savedNote.id);
            if (index !== -1) {
              this.notes[index] = savedNote;
              this.noteUpdateSubject.next(savedNote);
              resolve(savedNote);
            } else {
              console.error('Saved note not found');
              reject();
            }
          },
          error: (error) => {
            console.error('API call error:', error);
            reject();
          }
        })
    });
  }

}
