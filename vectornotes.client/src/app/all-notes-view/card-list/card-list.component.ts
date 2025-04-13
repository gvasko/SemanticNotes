import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Note } from '../../model/note';
import { MatPaginator } from '@angular/material/paginator';
import { NoteRepositoryService } from '../../services/note-repository.service';
import { combineLatest, Subject, Subscription, take } from 'rxjs';
import { DialogService } from '../../services/dialog.service';
import { NotePreview } from '../../model/note-preview';
import { PaginatorService } from '../services/paginator.service';

@Component({
  selector: 'lantor-card-list',
  standalone: false,

  templateUrl: './card-list.component.html',
  styleUrl: './card-list.component.scss'
})
export class CardListComponent implements OnInit, OnDestroy {

  constructor(
    private paginatorService: PaginatorService,
    private dialogService: DialogService,
    private noteRepositoryService: NoteRepositoryService) {

  }

  private items: NotePreview[] = [];
  private filterValue: string = "";
  public filteredItems: Note[] = [];
  public pagedItems: Note[] = [];

  private notesSubscription: Subscription | undefined;
  private noteUpdateSubscription: Subscription | undefined;

  private notesUpdated: Subject<number> = new Subject();

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;

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

  get pageSize(): number {
    return this.paginatorService.pageSize;
  }

  get pageSizeOptions(): number[] {
    return this.paginatorService.pageSizeOptions;
  }

  initItems(notes: NotePreview[]) {
    this.items = notes;
    this.filteredItems = [...this.items];
    const startIndex = this.paginatorService.pageSize * this.paginatorService.pageIndex;
    this.pagedItems = [...this.items.slice(startIndex, startIndex + this.paginatorService.pageSize)];
    this.paginator.length = this.filteredItems.length;
    this.paginator.pageIndex = this.paginatorService.pageIndex;
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
      item.contentPreview?.toLowerCase().includes(this.filterValue)
    );
  }

  onPageChange(event: any) {
    this.paginatorService.pageIndex = event.pageIndex;
    this.paginatorService.pageSize = event.pageSize;
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

}
