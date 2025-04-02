import { NotePreview } from "./note-preview";
import { Tag } from "./tag";

export class NoteSimilarityValue {
  noteId: number = 0;
  value: number = 0;
}

export class NoteSimilarityResult {
  similarityValues: NoteSimilarityValue[] = [];
  durationMillisec: number = 0;
  significantCount: number = 0;

  constructor(source: NoteSimilarityResult) {
    this.similarityValues = source.similarityValues;
    this.durationMillisec = source.durationMillisec;
    this.significantCount = source.significantCount;
  }
}

export class SimilarNotePreview extends NotePreview {
  similarityValue: number = 0;

  constructor(source: NotePreview, value: number) {
    super(source)
    this.similarityValue = value;
  }
}

export class SimilarTag extends Tag {
  similarityValue: number = 0;

  constructor(source: Tag, value: number) {
    super(source);
    this.similarityValue = value;
  }
}

export class ExtendedNoteSimilarityResult extends NoteSimilarityResult {
  similarNotePreviews: SimilarNotePreview[] = [];
  similarTags: SimilarTag[] = [];

  constructor(source: NoteSimilarityResult, notePreviews: NotePreview[]) {
    super(source);

    source.similarityValues.forEach(similarityValue => {
      const note: NotePreview | undefined = notePreviews.find(note => note.id === similarityValue.noteId);
      if (note !== undefined) {
        this.similarNotePreviews.push(
          new SimilarNotePreview(note, similarityValue.value));
        note.tags?.forEach(tag => {
          this.similarTags.push(
            new SimilarTag(tag, similarityValue.value));
        });
        // TODO: remove duplicate tags, keep the highest similarity value
      }
    });

  }
}
