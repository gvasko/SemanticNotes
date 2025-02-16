import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lantor-note-editor',
  standalone: false,
  
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteEditorComponent {

  static openDialog(dialog: MatDialog): MatDialogRef<NoteEditorComponent, any> {
    var dialogRef = dialog.open(NoteEditorComponent, {
//      panelClass: 'custom-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Note editor result: ${result}`);
    });
    return dialogRef;
  }
}
