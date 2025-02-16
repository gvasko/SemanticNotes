import { Component, ViewChild } from '@angular/core';
import { Note } from '../../../model/note';
import { MatPaginator } from '@angular/material/paginator';
import { NoteEditorComponent } from '../../../note-editor/note-editor.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'lantor-card-list',
  standalone: false,
  
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss'
})
export class CardListComponent {

  constructor(private dialog: MatDialog) {

  }

  public items: Note[] = [
    { title: "Example1", content: "Content, content..." },
    { title: "Example2", content: "Content, content..." },
    { title: "Example3", content: "Content, content..." },
    { title: "Example4", content: "Content, content..." },
    { title: "Example5", content: "Content, content..." },
    { title: "Example6", content: "Content, content..." },
    { title: "Example7", content: "Content, content, content, content, content, content, content, content, content, content..." },
    { title: "Example8", content: "Content, content, 2..." }
  ];

  filteredItems = [...this.items];
  pagedItems = [...this.items.slice(0, 5)];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.title?.toLowerCase().includes(filterValue) ||
      item.content?.toLowerCase().includes(filterValue)
    );
    this.paginator.firstPage();
    this.updatePagedItems();
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedItems = this.filteredItems.slice(startIndex, endIndex);
  }

  updatePagedItems() {
    this.pagedItems = this.filteredItems.slice(0, this.paginator.pageSize);
  }

  openNewEditor() {
    NoteEditorComponent.openDialog(this.dialog);
  }
}
