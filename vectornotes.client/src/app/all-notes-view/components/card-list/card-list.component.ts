import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Note } from '../../../model/note';
import { MatPaginator } from '@angular/material/paginator';
import { QuickNoteEditorComponent } from '../../../quick-note-editor/quick-note-editor.component';
import { MatDialog } from '@angular/material/dialog';
import { NoteRepositoryService } from '../../../services/note-repository.service';
import { combineLatest, Subject, Subscription, take } from 'rxjs';

@Component({
  selector: 'lantor-card-list',
  standalone: false,
  
  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss'
})
export class CardListComponent implements OnInit, OnDestroy {

  constructor(private dialog: MatDialog, private noteRepositoryService: NoteRepositoryService) {

  }

  private items: Note[] = [];
  public filteredItems: Note[] = [];
  public pagedItems: Note[] = [];

  private notesSubscription: Subscription | undefined;

  private notesUpdated: Subject<number> = new Subject();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.notesSubscription = this.noteRepositoryService.NotesSubject.subscribe((notes) => {
      this.initItems(notes);
    });
    this.noteRepositoryService.init();
  }

  ngOnDestroy() {
    this.notesSubscription?.unsubscribe();
  }

  initItems(notes: Note[]) {
    this.items = notes;
    this.filteredItems = [...this.items];
    this.pagedItems = [...this.items.slice(0, 5)];
    this.paginator.length = this.filteredItems.length;
    this.paginator.firstPage();
    this.notesUpdated.next(notes.length);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.title?.toLowerCase().includes(filterValue) ||
      item.content?.toLowerCase().includes(filterValue)
    );
    this.paginator.firstPage();
    this.resetPagedItems();
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedItems = this.filteredItems.slice(startIndex, endIndex);
  }

  resetPagedItems() {
    this.pagedItems = this.filteredItems.slice(0, this.paginator.pageSize);
  }

  openNewEditor() {
    var dialogClosed: Subject<boolean> = new Subject();
    combineLatest([this.notesUpdated, dialogClosed]).pipe(take(1)).subscribe(() => {
      this.paginator?.lastPage();
    });
    var dialogRef = QuickNoteEditorComponent.openDialog(this.dialog).afterClosed().subscribe(result => {
      if (result) {
        dialogClosed.next(result);
      }
    });
  }
}
