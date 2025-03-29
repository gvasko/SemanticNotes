import { Component, OnInit } from '@angular/core';
import { NoteRepositoryService } from '../services/note-repository.service';

@Component({
  selector: 'lantor-insight',
  standalone: false,
  
  templateUrl: './insight.component.html',
  styleUrl: './insight.component.scss'
})
export class InsightComponent implements OnInit {
  constructor(private noteRepositoryService: NoteRepositoryService) {

  }

  ngOnInit() {
    this.noteRepositoryService.init();
  }

  getNoteCount(): number {
    return this.noteRepositoryService.getNotes().length;
  }

  getCachedVectorCount(): number {
    return 11;
  }

}
