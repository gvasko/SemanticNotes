import { Injectable } from '@angular/core';
import { Note } from '../model/note';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, Subject, throwError } from 'rxjs';
import { NotesApiService } from './api/notes-api.service';
import { NotePreview } from '../model/note-preview';
import { SimilarityApiService } from './api/similarity-api.service';

@Injectable({
  providedIn: 'root'
})
export class NoteRepositoryService {
  // TODO: unsubscribe?

  constructor(private notesApiService: NotesApiService, private similarityService: SimilarityApiService) { }

  private notesPreview: NotePreview[] = [];

  private notesSubject = new Subject<NotePreview[]>();
  private noteUpdateSubject = new Subject<Note>();

  get NotesSubject(): Subject<NotePreview[]> { return this.notesSubject; }
  get NoteUpdateSubject(): Subject<Note> { return this.noteUpdateSubject; }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.notesApiService.getAll()
        .subscribe({
          next: (allNotes) => {
            this.notesPreview = allNotes;
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
    return this.notesPreview;
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
            let index = this.notesPreview.findIndex(note => note.id === savedNote.id);
            if (index !== -1) {
              this.notesPreview[index] = savedNote;
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

  getSimilarNotes(currentNote: Note): Promise<NotePreview[]> {
    return new Promise((resolve, reject) => {
      if (!currentNote?.id) {
        reject();
        return;
      }
      this.similarityService.getSimilarNotes(currentNote.id).subscribe({
        next: (similarNoteIds: number[]) => {
          var similarNotes: NotePreview[] = [];
          similarNoteIds.forEach(id => {
            const note: NotePreview | undefined = this.notesPreview.find(note => note.id === id);
            if (note !== undefined) {
              similarNotes.push(note);
            }
          });
          resolve(similarNotes);
        },
        error: (error) => {
          console.error('Similarity API call error:', error);
          reject();
        }
      });
    });
  }

}
