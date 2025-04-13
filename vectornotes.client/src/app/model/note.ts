import { Tag } from "./tag";

export class Note {
  id?: number;
  title?: string;
  content?: string;
  noteCollectionId?: number;
  tags?: Tag[];
}
