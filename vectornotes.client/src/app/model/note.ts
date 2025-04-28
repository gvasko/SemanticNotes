import { Tag } from "./tag";

export class Note {
  id?: number;
  title?: string;
  content?: string;
  noteCollectionId?: number;
  tags?: Tag[];

  constructor(source: Note | undefined = undefined) {
    if (!source) return;

    this.id = source.id;
    this.title = source.title;
    this.content = source.content;
    this.noteCollectionId = source.noteCollectionId;
    this.tags = source.tags ? [...source.tags] : [];
  }
}
