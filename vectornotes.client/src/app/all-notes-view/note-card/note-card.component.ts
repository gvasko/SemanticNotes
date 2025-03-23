import { Component, Input } from '@angular/core';
import { Note } from '../../model/note';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'lantor-note-card',
  standalone: false,
  
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.scss'
})
export class NoteCardComponent {
  @Input() note: Note;

  constructor(private dialogService: DialogService) {
    this.note = new Note();
    this.note.title = "";
    this.note.content = "";
  }

  openEditorToEditNote() {
    this.dialogService.openQuickNoteEditor(this.note);
  }

}
