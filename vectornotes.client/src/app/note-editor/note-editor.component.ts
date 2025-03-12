import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Note } from '../model/note';
import { NoteRepositoryService } from '../services/note-repository.service';

@Component({
  selector: 'lantor-note-editor',
  standalone: false,
  
  templateUrl: './note-editor.component.html',
  styleUrl: './note-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoteEditorComponent {

  static openDialog(dialog: MatDialog): MatDialogRef<NoteEditorComponent, any> {
    var dialogRef = dialog.open(NoteEditorComponent);

    return dialogRef;
  }

  constructor(private noteRepositoryService: NoteRepositoryService) {

  }

  public formGroup = new FormGroup({
    id: new FormControl(0),
    title: new FormControl(""),
    content: new FormControl("")
  });

  public saveButtonClicked() {
    const rawValue = this.formGroup.getRawValue();
    if (rawValue.id === null || rawValue.title === null || rawValue.content === null) {
      console.log("Cannot process note editor input");
      return;
    }

    const note = rawValue as Note;

    if (note.id === 0) {
      this.noteRepositoryService.addNote(note);
    } else {
      console.log("Update existing note...");
    }
  }

  public saveDisabled(): boolean {
    return this.formGroup.pristine;
  }

  public cancelButtonClicked() {

  }

  public cancelDisabled(): boolean {
    return false;
  }
}
