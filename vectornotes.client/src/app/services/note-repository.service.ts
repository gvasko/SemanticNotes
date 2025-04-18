import { Injectable } from '@angular/core';
import { Note } from '../model/note';
import { catchError, Observable, of, Subject, switchMap, take, throwError } from 'rxjs';
import { NotesApiService } from './api/notes-api.service';
import { NotePreview } from '../model/note-preview';
import { SimilarityApiService } from './api/similarity-api.service';
import { Tag } from '../model/tag';
import { ExtendedNoteSimilarityResult, NoteSimilarityResult } from '../model/note-similarity-result';
import { SimilarityMatrix } from '../model/similarity-matrix';
import { NoteCollectionsApiService } from './api/note-collections-api.service';
import { NoteCollectionPreview } from '../model/note-collection-preview';
import { NoteCollection } from '../model/note-collection';

@Injectable({
  providedIn: 'root'
})
export class NoteRepositoryService {

  constructor(
    private noteCollectionsApiService: NoteCollectionsApiService,
    private notesApiService: NotesApiService,
    private similarityService: SimilarityApiService) { }

  private notesPreview: NotePreview[] = [];
  private collectionsPreview: NoteCollectionPreview[] = [];

  private notesSubject = new Subject<NotePreview[]>();
  private noteUpdateSubject = new Subject<Note>();

  private currentNoteCollectionId: number = 0;

  get NotesSubject(): Subject<NotePreview[]> { return this.notesSubject; }
  get NoteUpdateSubject(): Subject<Note> { return this.noteUpdateSubject; }

  get CurrentNoteCollection(): NoteCollection | undefined { return this.collectionsPreview.find(cp => cp.id === this.currentNoteCollectionId) }

  init(): Promise<void> {
    if (this.notesPreview.length === 0) {
      return this.load();
    } else {
      this.NotesSubject.next(this.notesPreview);
      return Promise.resolve();
    }
  }

  load(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.noteCollectionsApiService.getAll()
        .pipe(take(1), switchMap((allNoteCollections) => {
          if (allNoteCollections?.length > 0) {
            this.collectionsPreview = allNoteCollections;
            if (!this.collectionsPreview.find(cp => cp.id === this.currentNoteCollectionId)) {
              this.currentNoteCollectionId = allNoteCollections[0].id ?? 0;
            }
          } else {
            this.collectionsPreview = [];
            this.currentNoteCollectionId = 0;
          }
          if (this.currentNoteCollectionId > 0) {
            return this.noteCollectionsApiService.getById(this.currentNoteCollectionId);
          } else {
            return of(null);
          }
        }))
        .subscribe({
          next: (noteCollection) => {
            this.notesPreview = noteCollection?.notes ?? [];
            this.NotesSubject.next(this.notesPreview);
            resolve();
          },
          error: (error) => {
            console.error('API call error:', error);
            reject();
          }
        });
    });
  }

  getNotes(): NotePreview[] {
    return this.notesPreview;
  }

  getCollections(): NoteCollectionPreview[] {
    return this.collectionsPreview;
  }

  addNote(newNote: Note): Promise<Note> {
    newNote.noteCollectionId = this.currentNoteCollectionId;
    return new Promise((resolve, reject) => {
      this.notesApiService.create(newNote)
        .pipe(take(1))
        .subscribe({
          next: (savedNote) => {
            this.load().then(() => resolve(savedNote));
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
        .pipe(take(1))
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
        .pipe(take(1))
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
      this.similarityService.getSimilarNotes(currentNote.id)
        .pipe(take(1))
        .subscribe({
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

  getSimilarityMatrix(noteCollectionId: number): Promise<SimilarityMatrix> {
    // TODO: find a better solution for chaining
    return new Promise((resolve, reject) => {
      if (this.notesPreview.length === 0) {
        this.init().then(() => {
          this.getSimilarityMatrixPromiseImpl(noteCollectionId, resolve, reject);
        })
      } else {
        this.getSimilarityMatrixPromiseImpl(noteCollectionId, resolve, reject);
      }
    });
  }

  private getSimilarityMatrixPromiseImpl = (noteCollectionId: number, resolve: (sm: SimilarityMatrix) => void, reject: (reason?: any) => void) => {
    this.similarityService.getSimilarityMatrix(noteCollectionId)
      .pipe(take(1))
      .subscribe({
        next: (similarityMatrixJson: SimilarityMatrix) => {
          similarityMatrixJson.noteNames = [];
          similarityMatrixJson.noteIds.forEach(noteId => {
            const found = this.notesPreview.find(n => n.id === noteId);
            similarityMatrixJson.noteNames.push(found?.title ?? "Unknown");
          });
          const similarityMatrix = new SimilarityMatrix(similarityMatrixJson);
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

  addCollection(name: string) {
    const nc = new NoteCollection();
    nc.name = name;
    this.noteCollectionsApiService.create(nc).pipe(take(1)).subscribe((noteCollection) => {
      this.currentNoteCollectionId = noteCollection?.id ?? 0;
      this.load();
    });
  }

  setCurrentCollection(noteCollectionId: number) {
    this.currentNoteCollectionId = noteCollectionId;
    this.load();
  }
}
