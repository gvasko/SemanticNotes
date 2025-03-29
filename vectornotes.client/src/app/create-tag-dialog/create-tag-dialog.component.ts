import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Note } from '../model/note';
import { NoteRepositoryService } from '../services/note-repository.service';
import { Tag } from '../model/tag';

@Component({
  selector: 'lantor-create-tag-dialog',
  standalone: false,
  
  templateUrl: './create-tag-dialog.component.html',
  styleUrl: './create-tag-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTagDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) private currentNote: Note, private noteRepositoryService: NoteRepositoryService) {

  }

  public formGroup = new FormGroup({
      name: new FormControl(""),
      value: new FormControl("")
    });

  public saveButtonClicked() {
    const rawValue = this.formGroup.getRawValue();
    if (rawValue.name === null || rawValue.value === null) {
      console.log("Cannot process new tag input");
      return;
    }

    const tag = rawValue as Tag;

    this.noteRepositoryService.addNoteTag(this.currentNote, tag);
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

