import { Injectable } from '@angular/core';
import { Note } from '../model/note';

@Injectable({
  providedIn: 'root'
})
export class NoteRepositoryService {

  private notes: Note[] = [
    { title: "Example1", content: "Content, content..." },
    { title: "Example2", content: "Content, content..." },
    { title: "Example3", content: "Content, content..." },
    { title: "Example4", content: "Content, content..." },
    { title: "Example5", content: "Content, content..." },
    { title: "Example6", content: "Content, content..." },
    { title: "Example7", content: "Content, content, content, content, content, content, content, content, content, content..." },
    { title: "Example8", content: "Content, content, 2..." }
  ];

  constructor() { }

  getNotes(): Note[] {
    return this.notes;
  }

  addNote(note: Note) {
    this.notes.push(note);
  }
}
