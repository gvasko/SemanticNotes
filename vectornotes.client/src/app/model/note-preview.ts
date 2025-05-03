import { Note } from "./note";
import { Tag } from "./tag";

export class NotePreview {
  id?: number;
  title?: string;
  contentPreview?: string;
  noteCollectionId?: number;
  tags?: Tag[];

  constructor(source: NotePreview | Note | undefined = undefined) {

    if (!source) return;

    this.id = source.id;
    this.title = source.title;
    if (source instanceof NotePreview) {
      this.contentPreview = source.contentPreview;
    }
    if (source instanceof Note) {
      this.contentPreview = source.content?.substring(0, 64);
    }
    this.tags = source.tags ? [...source.tags] : [];
  }
}
