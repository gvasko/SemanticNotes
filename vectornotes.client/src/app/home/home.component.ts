import { Component, OnInit } from '@angular/core';
import { NoteRepositoryService } from '../services/note-repository.service';

@Component({
  selector: 'lantor-home',
  standalone: false,
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

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
