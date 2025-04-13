import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NoteRepositoryService } from '../services/note-repository.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'lantor-create-collection-dialog',
  standalone: false,
  
  templateUrl: './create-collection-dialog.component.html',
  styleUrl: './create-collection-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateCollectionDialogComponent {
  constructor(private noteRepositoryService: NoteRepositoryService) {
  }

  public formGroup = new FormGroup({
    name: new FormControl(""),
  });

  public saveButtonClicked() {
    const rawValue = this.formGroup.getRawValue();
    if (rawValue.name === null) {
      console.log("Cannot process new tag input");
      return;
    }

    this.noteRepositoryService.addCollection(rawValue.name);
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
