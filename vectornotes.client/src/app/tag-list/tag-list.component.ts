import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from '../model/tag';

@Component({
  selector: 'lantor-tag-list',
  standalone: false,
  
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.scss'
})
export class TagListComponent {
  @Input() tags: Tag[] = [];
  @Output() removeTag = new EventEmitter<Tag>();

  removeTagClicked(tag: Tag) {
    this.removeTag?.emit(tag);
  }

  removeEnabled() {
    return this.removeTag.observers.length > 0;
  }
}
