import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NoteRepositoryService } from '../services/note-repository.service';
import { NoteCollectionPreview } from '../model/note-collection-preview';
import { Subscription } from 'rxjs';
import { DialogService } from '../services/dialog.service';
import { NoteCollection } from '../model/note-collection';

@Component({
  selector: 'lantor-collection-selector',
  standalone: false,
  
  templateUrl: './collection-selector.component.html',
  styleUrl: './collection-selector.component.scss'
})
export class CollectionSelectorComponent implements OnInit, OnDestroy {
  @Input() allowCreatingCollection: boolean = false;
  @Input() setCurrentCollection: boolean = true;
  @Output() collectionSelectedEvent = new EventEmitter<NoteCollectionPreview>();

  collections: NoteCollectionPreview[] = [];
  selectedCollection: NoteCollectionPreview | undefined = undefined;

  private notesSubscription: Subscription | undefined;

  constructor(
    private noteRepositoryService: NoteRepositoryService,
    private dialogService: DialogService
  ) {

  }

  ngOnInit() {
    this.notesSubscription = this.noteRepositoryService.NotesSubject.subscribe((notes) => {
      this.load();
    });
    this.noteRepositoryService.initFromDefaultCollection().then(() => {
      this.load();
    });
  }

  ngOnDestroy() {
    this.notesSubscription?.unsubscribe();
  }

  private load() {
    this.collections = this.noteRepositoryService.getCollections();
    if (this.collections) {
      this.selectedCollection = this.noteRepositoryService.CurrentNoteCollection;
    } else {
      this.selectedCollection = undefined;
    }

  }

  openEditorToCreateNewCollection() {
    this.dialogService.openCreateCollectionDialog();
  }

  selectioinChanged() {
    this.collectionSelectedEvent.emit(this.selectedCollection);

    if (!this.setCurrentCollection) return;

    const newId = this.selectedCollection?.id ?? 0;
    this.noteRepositoryService.setCurrentCollection(newId);
  }
}
