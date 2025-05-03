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
  selectedCollection: NoteCollectionPreview | undefined = undefined;

  constructor(@Inject(MAT_DIALOG_DATA) private currentNote: Note | undefined, private noteRepositoryService: NoteRepositoryService) {
    if (this.currentNote?.noteCollectionId) {
      this.currentCollection = this.noteRepositoryService.getCollections().find(c => c.id === this.currentNote!.noteCollectionId);
      this.selectedCollection = this.currentCollection;
    }
  }

  get currentNoteTitle(): string {
    return this.currentNote?.title ?? "undefined";
  }

  get currentNoteCollectionName(): string {
    return this.currentCollection?.name ?? "undefined";
  }

  get selectedNoteCollectionName(): string {
    return this.selectedCollection?.name ?? "undefined";
  }

  get moveButtonDisabled(): boolean {
    return this.currentCollection?.id === this.selectedCollection?.id;
  }

  selectCollection(collection: NoteCollectionPreview) {
    this.selectedCollection = collection;
  }

  onClickMoveButton() {
    if (!this.currentNote || !this.selectedCollection?.id) return;

    this.noteRepositoryService.moveNoteToCollection(this.currentNote, this.selectedCollection.id);
  }

  onClickNoButton() {

  }
}
