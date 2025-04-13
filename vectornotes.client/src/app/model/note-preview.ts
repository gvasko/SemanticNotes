import { Tag } from "./tag";

export class NotePreview {
  id?: number;
  title?: string;
  contentPreview?: string;
  tags?: Tag[];

  constructor(source: NotePreview | undefined = undefined) {

    if (!source) return;

    this.id = source.id;
    this.title = source.title;
    this.contentPreview = source.contentPreview;
    this.tags = source.tags ? [...source.tags] : [];
  }
}
