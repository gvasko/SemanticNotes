import { NotePreview } from "./note-preview";

export class NoteCollection {
  id?: number;
  name?: string;
  notes?: NotePreview[];

  constructor(source: NoteCollection | undefined = undefined) {

    if (!source) return;

    this.id = source.id;
    this.name = source.name;
    this.notes = source.notes ? [...source.notes] : [];
  }
}
