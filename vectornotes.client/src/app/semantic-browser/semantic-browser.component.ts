import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NoteRepositoryService } from '../services/note-repository.service';
import { Note } from '../model/note';
import { DialogService } from '../services/dialog.service';
import { Subscription } from 'rxjs';
import { Tag } from '../model/tag';
import { NotePreview } from '../model/note-preview';
import { SimilarNotePreview } from '../model/note-similarity-result';

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

  currentNote: Note | undefined = undefined;

  private noteUpdateSubscription: Subscription | undefined;
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

    const noteIdParam = this.route.snapshot.paramMap.get("id");
    const noteId = noteIdParam === null ? 0 : +noteIdParam;
    this.noteRepositoryService.init().then(() => {
      this.initCurrentNote(noteId);
    });

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
    this.noteUpdateSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  initCurrentNote(noteId: number) {
    this.noteRepositoryService.getNote(noteId).then((note) => {
      this.currentNote = note;
      if (this.currentNote?.id) {
        this.noteRepositoryService.getSimilarNotes(this.currentNote).then((similarityResult) => {
          this.similarNotes = similarityResult.similarNotePreviews;
          this.similarTags = similarityResult.similarTags.map(st => `[${st.similarityValue.toFixed(2) }] ${st.name}: ${st.value}`)
        });
      } else {
        this.similarNotes = [];
        this.similarTags = [];
        this.similarityValues = [];
      }
    });
  }

  updateCurrentNote(updatedNote: Note) {
    if (updatedNote.id === this.currentNote?.id) {
      this.currentNote = updatedNote;
    }
  }

  similarNoteClicked(id?: number) {
    this.router.navigate(["/browser", id]);
  }

  editButtonClicked() {
    this.dialogService.openQuickNoteEditor(this.currentNote);
  }

  createNewTagClicked() {
    this.dialogService.openCreateTagDialog(this.currentNote);
  }

  deleteTag(tag: Tag) {
    if (!this.currentNote) return;

    this.noteRepositoryService.removeNoteTag(this.currentNote, tag);
  }

}
