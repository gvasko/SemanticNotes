import { Component, Input } from '@angular/core';
import { Note } from '../../model/note';
import { DialogService } from '../../services/dialog.service';
import { Router } from '@angular/router';
import { NotePreview } from '../../model/note-preview';

@Component({
  selector: 'lantor-note-card',
  standalone: false,
  
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.scss'
})
export class NoteCardComponent {
  @Input() note: NotePreview;

  constructor(private router: Router, private dialogService: DialogService) {
    this.note = new NotePreview();
    this.note.title = "";
    this.note.contentPreview = "";
  }

  openEditorToEditNote() {
    //this.dialogService.openQuickNoteEditor(this.note);
    this.router.navigate(["/browser", this.note.id]);
  }

}
