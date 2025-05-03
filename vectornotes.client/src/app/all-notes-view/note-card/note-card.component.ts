import { Component, Input, OnInit } from '@angular/core';
import { Note } from '../../model/note';
import { DialogService } from '../../services/dialog.service';
import { Router } from '@angular/router';
import { NotePreview } from '../../model/note-preview';
import { NoteRepositoryService } from '../../services/note-repository.service';

@Component({
  selector: 'lantor-note-card',
  standalone: false,
  
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.scss'
})
export class NoteCardComponent implements OnInit {
  @Input() note!: NotePreview;

  constructor(private router: Router, private dialogService: DialogService, private noteRepositoryService: NoteRepositoryService) {
  }

  ngOnInit() {
  }

  openBrowser() {
    this.router.navigate(["/browser", this.note.id]);
  }

  openEditorToEditNote() {
    if (!this.note?.id) return;

    this.noteRepositoryService.getNote(this.note.id).then((fullNote) => {
      this.dialogService.openQuickNoteEditor(fullNote);
    });
  }

  moveNote() {

  }

  deleteNote() {
    if (!this.note?.title) return;

    this.dialogService.openYesNoDialog("Delete Note?", [this.note.title], this.deleteNoteClicked);
  }

  deleteNoteClicked = () => {
    if (this.note?.id) {
      this.noteRepositoryService.deleteNote(this.note?.id);
    }
  }
}
