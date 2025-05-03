import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QuickNoteEditorComponent } from '../quick-note-editor/quick-note-editor.component';
import { Note } from '../model/note';
import { CreateTagDialogComponent } from '../create-tag-dialog/create-tag-dialog.component';
import { CreateCollectionDialogComponent } from '../create-collection-dialog/create-collection-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationData } from '../confirmation-dialog/confirmation-data';
import { MoveNoteDialogComponent } from '../move-note-dialog/move-note-dialog.component';

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

  openCreateCollectionDialog(): MatDialogRef<CreateCollectionDialogComponent, any> {
    return this.dialog.open(CreateCollectionDialogComponent);
  }

  openMoveNoteDialog(note: Note | undefined = undefined): MatDialogRef<MoveNoteDialogComponent, any> {
    return this.dialog.open(MoveNoteDialogComponent, {
      data: note
    });
  }

  openYesNoCancelDialog(title: string, content: string[], action: () => void): MatDialogRef<ConfirmationDialogComponent, any> {
    return this.dialog.open(ConfirmationDialogComponent, {
      data: ConfirmationData.CreateYesNoCancelData(title, content, action)
    });
  }

  openYesNoDialog(title: string, content: string[], action: () => void): MatDialogRef<ConfirmationDialogComponent, any> {
    return this.dialog.open(ConfirmationDialogComponent, {
      data: ConfirmationData.CreateYesNoData(title, content, action)
    });
  }
}
