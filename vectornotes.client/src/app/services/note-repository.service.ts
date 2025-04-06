import { Injectable } from '@angular/core';
import { Note } from '../model/note';
import { catchError, of, Subject, throwError } from 'rxjs';
import { NotesApiService } from './api/notes-api.service';
import { NotePreview } from '../model/note-preview';
import { SimilarityApiService } from './api/similarity-api.service';
import { Tag } from '../model/tag';
import { ExtendedNoteSimilarityResult, NoteSimilarityResult } from '../model/note-similarity-result';
import { SimilarityMatrix } from '../model/similarity-matrix';

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

  getSimilarNotes(currentNote: Note): Promise<ExtendedNoteSimilarityResult> {
    return new Promise((resolve, reject) => {
      if (!currentNote?.id) {
        reject();
        return;
      }
      this.similarityService.getSimilarNotes(currentNote.id).subscribe({
        next: (similarityResult: NoteSimilarityResult) => {
          const extendedResult = new ExtendedNoteSimilarityResult(similarityResult, this.notesPreview);
          resolve(extendedResult);
        },
        error: (error) => {
          console.error('Similarity API call error:', error);
          reject();
        }
      });
    });
  }

  getSimilarityMatrix(): Promise<SimilarityMatrix> {
    // TODO: find a better solution for chaining
    return new Promise((resolve, reject) => {
      if (this.notesPreview.length === 0) {
        this.init().then(() => {
          this.getSimilarityMatrixPromiseImpl(resolve, reject);
        })
      } else {
        this.getSimilarityMatrixPromiseImpl(resolve, reject);
      }
    });
  }

  private getSimilarityMatrixPromiseImpl = (resolve: (sm: SimilarityMatrix) => void, reject: (reason?: any) => void) => {
    this.similarityService.getSimilarityMatrix().subscribe({
      next: (similarityMatrix: SimilarityMatrix) => {
        similarityMatrix.noteNames = [];
        similarityMatrix.noteIds.forEach(noteId => {
          const found = this.notesPreview.find(n => n.id === noteId);
          similarityMatrix.noteNames.push(found?.title ?? "Unknown");
        });
        resolve(similarityMatrix);
      },
      error: (error) => {
        console.error('Similarity API call error:', error);
        reject();
      }
    });
  }

  addNoteTag(note: Note, tag: Tag): Promise<Note> {
    note.tags?.push(tag);
    return this.updateNote(note);
  }

  removeNoteTag(note: Note, tag: Tag): Promise<Note> {
    if (note.tags) {
      note.tags = note.tags.filter(t => t.name !== tag.name && t.value !== tag.value);
    }
    return this.updateNote(note);
  }

}
