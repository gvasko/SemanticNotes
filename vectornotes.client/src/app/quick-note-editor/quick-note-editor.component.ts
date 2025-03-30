import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Note } from '../model/note';
import { NoteRepositoryService } from '../services/note-repository.service';
import { Tag } from '../model/tag';

@Component({
  selector: 'lantor-note-editor',
  standalone: false,
  
  templateUrl: './quick-note-editor.component.html',
  styleUrl: './quick-note-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickNoteEditorComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private currentNote: Note, private noteRepositoryService: NoteRepositoryService) {

  }

  public formGroup = new FormGroup({
    id: new FormControl(0),
    title: new FormControl(""),
    content: new FormControl(""),
    tags: new FormControl<Tag[]>([])
  });

  public ngOnInit() {
    if (this.currentNote) {
      this.formGroup.patchValue(this.currentNote);
    }
  }

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
      this.noteRepositoryService.updateNote(note);
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
