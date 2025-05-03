import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Note } from '../model/note';
import { NoteRepositoryService } from '../services/note-repository.service';
import { NoteCollectionPreview } from '../model/note-collection-preview';

@Component({
  selector: 'lantor-move-note-dialog',
  standalone: false,
  
  templateUrl: './move-note-dialog.component.html',
  styleUrl: './move-note-dialog.component.scss'
})
export class MoveNoteDialogComponent {

  currentCollection: NoteCollectionPreview | undefined = undefined;

  constructor(@Inject(MAT_DIALOG_DATA) private currentNote: Note | undefined, private noteRepositoryService: NoteRepositoryService) {
    if (this.currentNote?.noteCollectionId) {
      this.currentCollection = this.noteRepositoryService.getCollections().find(c => c.id === this.currentNote!.noteCollectionId);
    }
  }

  get currentNoteTitle(): string {
    return this.currentNote?.title ?? "undefined";
  }

  get currentNoteCollectionName(): string {
    return this.currentCollection?.name ?? "undefined";
  }

  onClickMoveButton() {

  }

  onClickNoButton() {

  }
}
