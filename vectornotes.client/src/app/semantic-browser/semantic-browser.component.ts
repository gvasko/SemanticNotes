import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NoteRepositoryService } from '../services/note-repository.service';
import { Note } from '../model/note';
import { DialogService } from '../services/dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'lantor-semantic-browser',
  standalone: false,
  
  templateUrl: './semantic-browser.component.html',
  styleUrl: './semantic-browser.component.scss'
})
export class SemanticBrowserComponent implements OnInit, OnDestroy {
  similarNotes: Note[] = [];

  currentNote: Note | undefined = undefined;

  private noteUpdateSubscription: Subscription | undefined;

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
      this.noteRepositoryService.getNote(noteId).then((note) => {
        this.currentNote = note;
        if (this.currentNote?.id) {
          this.noteRepositoryService.getSimilarNotes(this.currentNote).then((similarNotes) => {
            this.similarNotes = similarNotes;
          });
        } else {
          this.similarNotes = this.noteRepositoryService.getNotes().slice(0, 10);
        }
      });
    });
  }

  ngOnDestroy() {
    this.noteUpdateSubscription?.unsubscribe();
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
}
