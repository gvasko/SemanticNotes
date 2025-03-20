import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Note } from '../../../model/note';
import { MatPaginator } from '@angular/material/paginator';
import { NoteRepositoryService } from '../../../services/note-repository.service';
import { combineLatest, Subject, Subscription, take } from 'rxjs';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'lantor-card-list',
  standalone: false,

  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss'
})
export class CardListComponent implements OnInit, OnDestroy {

  constructor(private dialogService: DialogService, private noteRepositoryService: NoteRepositoryService) {

  }

  private items: Note[] = [];
  private filterValue: string = "";
  public filteredItems: Note[] = [];
  public pagedItems: Note[] = [];

  private notesSubscription: Subscription | undefined;
  private noteUpdateSubscription: Subscription | undefined;

  private notesUpdated: Subject<number> = new Subject();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.notesSubscription = this.noteRepositoryService.NotesSubject.subscribe((notes) => {
      this.initItems(notes);
    });
    this.noteUpdateSubscription = this.noteRepositoryService.NoteUpdateSubject.subscribe((updatedNote) => {
      this.updateItem(updatedNote);
    });
    this.noteRepositoryService.init();
  }

  ngOnDestroy() {
    this.notesSubscription?.unsubscribe();
    this.noteUpdateSubscription?.unsubscribe();
  }

  initItems(notes: Note[]) {
    this.items = notes;
    this.filteredItems = [...this.items];
    this.pagedItems = [...this.items.slice(0, 5)];
    this.paginator.length = this.filteredItems.length;
    this.paginator.firstPage();
    this.notesUpdated.next(notes.length);
  }

  updateItem(updatedNote: Note) {
    this.setFilteredItems();
    this.onPageChange(this.paginator);
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.setFilteredItems();
    this.paginator.firstPage();
    this.resetPagedItems();
  }

  private setFilteredItems() {
    this.filteredItems = this.items.filter(item =>
      item.title?.toLowerCase().includes(this.filterValue) ||
      item.content?.toLowerCase().includes(this.filterValue)
    );
  }

  onPageChange(event: any) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedItems = this.filteredItems.slice(startIndex, endIndex);
  }

  resetPagedItems() {
    this.pagedItems = this.filteredItems.slice(0, this.paginator.pageSize);
  }

  openEditorToCreateNewNote() {
    var dialogClosed: Subject<boolean> = new Subject();
    combineLatest([this.notesUpdated, dialogClosed]).pipe(take(1)).subscribe(() => {
      this.paginator?.lastPage();
    });
    this.dialogService.openQuickNoteEditor().afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        dialogClosed.next(result);
      }
    });
  }

  openEditorToEditNote(note: Note) {
    this.dialogService.openQuickNoteEditor(note);
  }
}
