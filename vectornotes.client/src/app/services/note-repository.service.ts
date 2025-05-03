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
  private noteCollectionIdSubject = new Subject<number>();

  private currentNoteCollectionId: number = 0;

  get NotesSubject(): Subject<NotePreview[]> { return this.notesSubject; }
  get NoteUpdateSubject(): Subject<Note> { return this.noteUpdateSubject; }

  get NoteCollectionIdSubject(): Subject<number> { return this.noteCollectionIdSubject; }

  get CurrentNoteCollection(): NoteCollection | undefined { return this.collectionsPreview.find(cp => cp.id === this.currentNoteCollectionId) }

  initFromNote(noteId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.notesApiService.getById(noteId).subscribe({
        next: (note: Note) => {
          // TODO: optimize, content is not needed here
          if (!note.noteCollectionId) {
            console.log("Cannot init notes");
            reject("Cannot init notes");
            return;
          }
          this.initCollection(note.noteCollectionId).then(resolve).catch(reject);
        },
        error: (error) => {
          reject(error);
        }
      });
    })
  }

  initCollection(collectionId: number): Promise<void> {
    if (this.currentNoteCollectionId !== collectionId) {
      return this.setCurrentCollection(collectionId);
    } else {
      this.NotesSubject.next(this.notesPreview);
      return Promise.resolve();
    }
  }

  initFromDefaultCollection(): Promise<void> {
    return this.load();
  }

  load(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.noteCollectionsApiService.getAll()
        .pipe(take(1), switchMap((allNoteCollections) => {
          if (allNoteCollections?.length > 0) {
            this.collectionsPreview = allNoteCollections;
            const i = this.collectionsPreview.findIndex(collection => collection.id === this.currentNoteCollectionId);
            const loadIndex = i >= 0 ? i : 0;
            this.currentNoteCollectionId = this.collectionsPreview[loadIndex].id ?? 0;
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
          next: (savedNoteJson: Note) => {
            let savedNote = new Note(savedNoteJson);
            let index = this.notesPreview.findIndex(note => note.id === savedNote.id);
            if (index !== -1) {
              this.notesPreview[index] = new NotePreview(savedNote);
              this.notesSubject.next(this.notesPreview);
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

  deleteNote(noteId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.notesApiService.delete(noteId)
        .subscribe({
          next: () => {
            this.load().then(resolve).catch(reject);
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
      this.similarityService.getSimilarNotes(this.currentNoteCollectionId, currentNote.id)
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
        this.initCollection(noteCollectionId).then(() => {
          this.getSimilarityMatrixPromiseImpl(noteCollectionId, resolve, reject);
        })
      } else {
        this.getSimilarityMatrixPromiseImpl(noteCollectionId, resolve, reject);
      }
    });
  }

  private getSimilarityMatrixPromiseImpl = (noteCollectionId: number, resolve: (sm: SimilarityMatrix) => void, reject: (reason?: any) => void) => {
    this.similarityService.getSimilarityMatrix(noteCollectionId)
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
    this.noteCollectionsApiService.create(nc).subscribe((noteCollection) => {
      this.setCurrentCollection(noteCollection?.id ?? 0);
    });
  }

  setCurrentCollection(noteCollectionId: number): Promise<void> {
    if (noteCollectionId === this.currentNoteCollectionId) return Promise.resolve();

    this.currentNoteCollectionId = noteCollectionId;
    this.noteCollectionIdSubject.next(this.currentNoteCollectionId);
    return this.load();
  }

  moveNoteToCollection(note: Note, collectionId: number): Promise<void> {
    note.noteCollectionId = collectionId;
    return new Promise((resolve, reject) => {
      this.notesApiService.update(note)
        .subscribe({
          next: () => {
            this.load().then(resolve).catch(reject);
          },
          error: (error) => {
            console.error('API call error:', error);
            reject();
          }
        })
    });
  }
}
