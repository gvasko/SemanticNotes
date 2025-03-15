import { Component, OnInit, ViewChild } from '@angular/core';
import { Note } from '../../../model/note';
import { MatPaginator } from '@angular/material/paginator';
import { QuickNoteEditorComponent } from '../../../quick-note-editor/quick-note-editor.component';
import { MatDialog } from '@angular/material/dialog';
import { NoteRepositoryService } from '../../../services/note-repository.service';

@Component({
  selector: 'lantor-card-list',
  standalone: false,
  
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss'
})
export class CardListComponent implements OnInit {

  constructor(private dialog: MatDialog, private noteRepositoryService: NoteRepositoryService) {

  }

  private items: Note[] = [];
  public filteredItems: Note[] = [];
  public pagedItems: Note[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.noteRepositoryService.init().then(() => {
      this.initItems();
    });
  }

  initItems() {
    this.items = this.noteRepositoryService.getNotes();
    this.filteredItems = [...this.items];
    this.pagedItems = [...this.items.slice(0, 5)];
  }

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
    var dialogRef = QuickNoteEditorComponent.openDialog(this.dialog).afterClosed().subscribe(result => {
      console.log(`Note editor result: ${result}`);
      this.initItems();
      this.paginator.lastPage();
    });
  }
}
