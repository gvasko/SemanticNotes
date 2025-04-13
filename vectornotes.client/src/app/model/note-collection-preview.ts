
export class NoteCollectionPreview {
  id?: number;
  name?: string;

  constructor(source: NoteCollectionPreview | undefined = undefined) {

    if (!source) return;

    this.id = source.id;
    this.name = source.name;
  }
}
