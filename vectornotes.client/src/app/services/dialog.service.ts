import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QuickNoteEditorComponent } from '../quick-note-editor/quick-note-editor.component';
import { Note } from '../model/note';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openQuickNoteEditor(note: Note | undefined = undefined): MatDialogRef<QuickNoteEditorComponent, any> {
    return this.dialog.open(QuickNoteEditorComponent, {
      data: note,
      width: '50vw',
      minWidth: '600px',
      height: '75vh'
    });
  }
}
