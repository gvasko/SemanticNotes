import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NoteRepositoryService } from '../services/note-repository.service';
import { Note } from '../model/note';
import { DialogService } from '../services/dialog.service';
import { Subscription, take } from 'rxjs';
import { Tag } from '../model/tag';
import { SimilarNotePreview } from '../model/note-similarity-result';
import { NoteCollection } from '../model/note-collection';
import { NoteCollectionPreview } from '../model/note-collection-preview';

@Component({
  selector: 'lantor-semantic-browser',
  standalone: false,
  
  templateUrl: './semantic-browser.component.html',
  styleUrl: './semantic-browser.component.scss'
})
export class SemanticBrowserComponent implements OnInit, OnDestroy {
  similarNotes: SimilarNotePreview[] = [];
  similarTags: string[] = [];
  similarityValues: number[] = [];
  collectionTags: string[] = [];

  currentNote: Note | undefined = undefined;
  currentNoteCollection: NoteCollectionPreview | undefined = undefined;

  private notesSubscription: Subscription | undefined;
  private noteUpdateSubscription: Subscription | undefined;
  private noteCollectionIdUpdateSubscription: Subscription | undefined;
  private routerSubscription: Subscription | undefined;

  constructor(
    private noteRepositoryService: NoteRepositoryService,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService
  ) {

  }

  ngOnInit() {
    this.noteUpdateSubscription = this.noteRepositoryService.NoteUpdateSubject.subscribe((updatedNote) => {
      this.updateCurrentNote(updatedNote);
    });

    this.noteCollectionIdUpdateSubscription = this.noteRepositoryService.NoteCollectionIdSubject.subscribe((updatedCollectionId) => {
      this.updateSimilarities();
    });

    const noteIdParam = this.route.snapshot.paramMap.get("id");
    const noteId = noteIdParam === null ? 0 : +noteIdParam;
    if (noteId) {
      this.noteRepositoryService.initFromNote(noteId).then(() => {
        this.initCurrentNote(noteId);
      });
    } else {
      this.notesSubscription = this.noteRepositoryService.NotesSubject.subscribe((notes) => {
        const tags = notes?.flatMap(note => note.tags ?? []) ?? [];
        this.collectionTags = Array.from(new Set(tags.map(t => `${t.name}: ${t.value}`)));
      });
    }

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      const noteIdParam = this.route.snapshot.paramMap.get("id");
      const noteId = noteIdParam === null ? 0 : +noteIdParam;
      this.initCurrentNote(noteId);
    });
  }

  ngOnDestroy() {
    this.notesSubscription?.unsubscribe();
    this.noteUpdateSubscription?.unsubscribe();
    this.noteCollectionIdUpdateSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  get currentCollectionName(): string {
    return this.currentNoteCollection?.name ?? "undefined";
  }

  get currentCollectionTags(): string[] {
    return this.collectionTags;
  }

  initCurrentNote(noteId: number) {
    this.noteRepositoryService.getNote(noteId).then((note) => {
      this.currentNote = note;
      this.currentNoteCollection = this.noteRepositoryService.getCollections()
        .find(c => c.id === note.noteCollectionId);

      this.updateSimilarities();
    });
  }

  updateSimilarities() {
    if (this.currentNote?.id) {
      this.noteRepositoryService.getSimilarNotes(this.currentNote).then((similarityResult) => {
        this.similarNotes = similarityResult.similarNotePreviews;
        this.similarTags = similarityResult.similarTags.map(st => `[${st.similarityValue.toFixed(2)}] ${st.name}: ${st.value}`)
      });
    } else {
      this.similarNotes = [];
      this.similarTags = [];
      this.similarityValues = [];
    }
  }

  updateCurrentNote(updatedNote: Note) {
    if (updatedNote.id === this.currentNote?.id) {
      this.currentNote = updatedNote;
      this.updateSimilarities();
    }
  }

  similarNoteClicked(id?: number) {
    this.router.navigate(["/browser", id]);
  }

  editButtonClicked() {
    this.dialogService.openQuickNoteEditor(this.currentNote);
  }

  backButtonClicked() {
    if (this.currentNoteCollection?.id) {
      this.noteRepositoryService.setCurrentCollection(this.currentNoteCollection.id);
    }
    this.router.navigate(["/notes"]);
  }

  createNewTagClicked() {
    this.dialogService.openCreateTagDialog(this.currentNote);
  }

  deleteTag(tag: Tag) {
    if (!this.currentNote) return;

    this.noteRepositoryService.removeNoteTag(this.currentNote, tag);
  }

  deleteButtonClicked() {
    this.dialogService.openYesNoDialog("Delete Note?", [this.currentNote?.title ?? "Current note"], this.deleteNoteClicked);
  }

  deleteNoteClicked = () => {
    if (this.currentNote?.id) {
      this.noteRepositoryService.deleteNote(this.currentNote?.id);
    }
    this.router.navigate(["/notes"]);
  }
}
