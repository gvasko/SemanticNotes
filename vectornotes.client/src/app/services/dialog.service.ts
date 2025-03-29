import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QuickNoteEditorComponent } from '../quick-note-editor/quick-note-editor.component';
import { Note } from '../model/note';
import { CreateTagDialogComponent } from '../create-tag-dialog/create-tag-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openQuickNoteEditor(note: Note | undefined = undefined): MatDialogRef<QuickNoteEditorComponent, any> {
    return this.dialog.open(QuickNoteEditorComponent, {
      data: note,
      width: 'min(90vw, 600px)',
      minWidth: 'min(90vw, 600px)',
      maxWidth: '600px',
      height: '75vh'
    });
  }

  openCreateTagDialog(note: Note | undefined = undefined): MatDialogRef<CreateTagDialogComponent, any> {
    return this.dialog.open(CreateTagDialogComponent, {
      data: note
    });
  }

}
